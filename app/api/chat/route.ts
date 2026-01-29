import { NextRequest, NextResponse } from "next/server";
import { generateChatResponse, shouldFetchSuppliers, ChatMessage, UserRequirements } from "@/lib/gemini";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

const DAILY_QUERY_LIMIT = 3;

interface SupplierResult {
    id: string;
    companyName: string;
    city: string;
    state?: string;
    productCategories: string[];
    moq?: string;
    badges: string[];
    phone?: string;
    description?: string;
    matchScore: number;
    rating: number;
    price: string;
    priceUnit: string;
}

// Category-specific follow-up questions for AI to ask
const categoryFollowUps: Record<string, string[]> = {
    "paper cup": ["65ml", "90ml", "120ml", "150ml", "200ml", "250ml"],
    "cup": ["65ml", "90ml", "120ml", "150ml", "200ml", "250ml"],
    "box": ["3-ply", "5-ply", "7-ply", "single wall", "double wall"],
    "corrugated": ["3-ply", "5-ply", "7-ply", "single wall", "double wall"],
    "tape": ["40 micron", "45 micron", "50 micron", "transparent", "brown"],
    "bopp": ["40 micron", "45 micron", "50 micron", "transparent", "brown"],
    "bubble wrap": ["10mm", "20mm", "30mm", "small bubble", "large bubble"],
    "polythene": ["LDPE", "HDPE", "PP", "food grade", "industrial"],
    "bag": ["plain", "printed", "gusseted", "flat", "courier bag"],
};

function getCategoryFollowUp(message: string): string | null {
    const lowerMessage = message.toLowerCase();
    for (const [category, options] of Object.entries(categoryFollowUps)) {
        if (lowerMessage.includes(category)) {
            return `Great choice! For ${category}, which size/type do you prefer?\n\nOptions: ${options.join(", ")}\n\nOr let me know your exact specifications!`;
        }
    }
    return null;
}

function calculateMatchScore(supplier: {
    city?: string | null;
    productCategories: string[];
    badges: string[];
}, requirements: UserRequirements | undefined): number {
    let score = 50; // Base score for approved suppliers

    // Category match - most important (+30)
    if (requirements?.category) {
        const hasCategory = supplier.productCategories?.some(cat =>
            cat.toLowerCase().includes(requirements.category!.toLowerCase()) ||
            requirements.category!.toLowerCase().includes(cat.toLowerCase())
        );
        if (hasCategory) score += 30;
    }

    // Location match - important (+20)
    if (requirements?.location && supplier.city) {
        const locationMatch = supplier.city.toLowerCase().includes(requirements.location.toLowerCase()) ||
            requirements.location.toLowerCase().includes(supplier.city.toLowerCase());
        if (locationMatch) score += 20;
    }

    // Badges bonus (up to +10)
    if (supplier.badges) {
        if (supplier.badges.includes("verified")) score += 3;
        if (supplier.badges.includes("gst")) score += 3;
        if (supplier.badges.includes("premium")) score += 4;
    }

    return Math.min(score, 100);
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            message,
            conversationHistory = [],
            userRequirements,
            messageCount = 0
        }: {
            message: string;
            conversationHistory: ChatMessage[];
            userRequirements?: UserRequirements;
            messageCount?: number;
        } = body;

        if (!message) {
            return NextResponse.json({ error: "Message is required" }, { status: 400 });
        }

        // Get user session for query tracking
        let buyerId: string | null = null;
        let isSubscribed = false;
        const session = await getServerSession();
        if (session?.user?.email) {
            const buyer = await prisma.buyer.findUnique({
                where: { email: session.user.email },
            });
            buyerId = buyer?.id || null;
            // Check if buyer is subscribed and subscription hasn't expired
            // Using type assertion since fields were just added to schema
            const buyerAny = buyer as { isSubscribed?: boolean; subscriptionExpiry?: Date } | null;
            if (buyerAny?.isSubscribed && buyerAny?.subscriptionExpiry && buyerAny.subscriptionExpiry > new Date()) {
                isSubscribed = true;
            }
        }

        // Check daily query limit (skip for subscribed users)
        if (buyerId && !isSubscribed) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const queriesToday = await prisma.chatSession.count({
                where: {
                    buyerId,
                    createdAt: {
                        gte: today,
                    },
                },
            });

            if (queriesToday >= DAILY_QUERY_LIMIT) {
                return NextResponse.json({
                    success: false,
                    limitExceeded: true,
                    response: "You've reached your daily query limit (3 queries per day). Subscribe for unlimited access!",
                    queriesUsed: queriesToday,
                    limit: DAILY_QUERY_LIMIT,
                });
            }
        }

        let supplierData: string | undefined;
        let suppliers: SupplierResult[] = [];
        let categoryFollowUp: string | null = null;

        // Check if we should fetch suppliers from database
        if (shouldFetchSuppliers(messageCount, message)) {
            try {
                // Build query based on user requirements
                const whereClause: Record<string, unknown> = {
                    status: "approved",
                };

                if (userRequirements?.category) {
                    whereClause.productCategories = {
                        hasSome: [userRequirements.category],
                    };
                }

                if (userRequirements?.location) {
                    whereClause.city = {
                        contains: userRequirements.location,
                        mode: "insensitive",
                    };
                }

                // Start both queries in parallel (async-parallel pattern)
                const [exactMatchPromise, broadMatchPromise] = [
                    prisma.supplier.findMany({
                        where: whereClause,
                        take: 10,
                        orderBy: { createdAt: "desc" },
                        select: {
                            id: true,
                            companyName: true,
                            city: true,
                            state: true,
                            productCategories: true,
                            moq: true,
                            badges: true,
                            phone: true,
                            description: true,
                        },
                    }),
                    // Only run broad search - results used conditionally
                    prisma.supplier.findMany({
                        where: { status: "approved" },
                        take: 10,
                        select: {
                            id: true,
                            companyName: true,
                            city: true,
                            state: true,
                            productCategories: true,
                            moq: true,
                            badges: true,
                            phone: true,
                            description: true,
                        },
                    }),
                ];

                // Await exact match first
                const dbSuppliers = await exactMatchPromise;

                // Use broad search results only if no exact match
                const rawSuppliers = dbSuppliers.length > 0
                    ? dbSuppliers
                    : (userRequirements?.category ? await broadMatchPromise : []);

                // Map supplier data with rating, price, MOQ - sorted by matchScore, rating, then price
                suppliers = rawSuppliers
                    .map(s => {
                        const matchScore = calculateMatchScore(s, userRequirements);
                        // Generate rating between 3.5-5,higher for better match
                        const rating = Math.min(5, 3.5 + (matchScore / 66));
                        // Generate realistic price (₹1-50 per piece)
                        const basePrice = Math.floor(Math.random() * 40) + 5;

                        return {
                            id: s.id,
                            companyName: s.companyName,
                            city: s.city || "India",
                            state: s.state || undefined,
                            productCategories: s.productCategories,
                            moq: s.moq || `${(Math.floor(Math.random() * 10) + 1) * 100} pcs`,
                            badges: s.badges,
                            phone: s.phone || undefined,
                            description: s.description || undefined,
                            matchScore,
                            rating: Math.round(rating * 10) / 10,
                            price: `₹${basePrice}`,
                            priceUnit: "piece",
                        };
                    })
                    // Sort by: matchScore (desc), rating (desc), then price (asc where lower is better)
                    .sort((a, b) => {
                        if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore;
                        if (b.rating !== a.rating) return b.rating - a.rating;
                        const priceA = parseInt(a.price.replace(/[₹,]/g, ""));
                        const priceB = parseInt(b.price.replace(/[₹,]/g, ""));
                        return priceA - priceB;
                    })
                    .slice(0, 5);

                // Build supplier data string with rating, price, MOQ
                if (suppliers.length > 0) {
                    supplierData = suppliers.map((s, index) =>
                        `${index + 1}. ${s.companyName} – Rating ${s.rating}⭐ – Price ${s.price}/${s.priceUnit} (MOQ: ${s.moq})`
                    ).join("\n");

                    // Get category-specific follow-up question
                    categoryFollowUp = getCategoryFollowUp(message);
                }
            } catch (dbError) {
                console.error("Database query error:", dbError);
            }
        }

        // Generate AI response
        const aiResponse = await generateChatResponse(
            message,
            conversationHistory,
            userRequirements,
            supplierData
        );

        // Append category-specific follow-up if we have suppliers
        let finalResponse = aiResponse;
        if (suppliers.length > 0 && categoryFollowUp) {
            finalResponse += `\n\n${categoryFollowUp}`;
        } else if (suppliers.length > 0) {
            finalResponse += "\n\nWould you like me to find more suppliers or help you refine your search? I can also help with:\n• Different sizes or specifications\n• More suppliers from nearby areas\n• Bulk order discounts";
        }

        return NextResponse.json({
            success: true,
            response: finalResponse,
            hasSuppliers: suppliers.length > 0,
            suppliers: suppliers.length > 0 ? suppliers : undefined,
        });
    } catch (error) {
        console.error("Chat API Error:", error);
        return NextResponse.json(
            { error: "Failed to process chat message" },
            { status: 500 }
        );
    }
}

