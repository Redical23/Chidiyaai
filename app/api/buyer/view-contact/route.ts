import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

const DAILY_CONTACT_LIMIT = 5;

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { supplierId, buyerId, sessionId } = body;

        if (!supplierId) {
            return NextResponse.json({ error: "Supplier ID required" }, { status: 400 });
        }

        // Get buyer ID from session or use provided
        let finalBuyerId = buyerId;
        if (!finalBuyerId) {
            const session = await getServerSession();
            if (session?.user?.email) {
                const buyer = await prisma.buyer.findUnique({
                    where: { email: session.user.email },
                });
                finalBuyerId = buyer?.id;
            }
        }

        // Check daily contact limit
        if (finalBuyerId) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const contactsToday = await prisma.supplierContactLog.count({
                where: {
                    buyerId: finalBuyerId,
                    viewedAt: {
                        gte: today,
                    },
                },
            });

            // Check if daily limit exceeded
            if (contactsToday >= DAILY_CONTACT_LIMIT) {
                return NextResponse.json({
                    success: false,
                    limitExceeded: true,
                    message: "Daily contact limit reached (5 contacts per day)",
                    contactsUsed: contactsToday,
                    limit: DAILY_CONTACT_LIMIT,
                });
            }

            // Log the contact view
            await prisma.supplierContactLog.create({
                data: {
                    buyerId: finalBuyerId,
                    supplierId,
                    sessionId,
                },
            });

            // Also log as activity
            await prisma.activityLog.create({
                data: {
                    action: "supplier_contact_viewed",
                    entityType: "supplier",
                    entityId: supplierId,
                    message: `Buyer viewed contact for supplier`,
                },
            });
        }

        // Get supplier phone
        const supplier = await prisma.supplier.findUnique({
            where: { id: supplierId },
            select: { phone: true, companyName: true },
        });

        return NextResponse.json({
            success: true,
            phone: supplier?.phone || "Contact not available",
            companyName: supplier?.companyName,
        });
    } catch (error) {
        console.error("View contact error:", error);
        return NextResponse.json(
            { error: "Failed to get contact" },
            { status: 500 }
        );
    }
}

