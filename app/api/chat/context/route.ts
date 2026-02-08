import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Unified Context API - provides all data needed for AI chat responses
// This includes: categories with specifications, suppliers with products/badges/pricing

export async function GET() {
    try {
        // Fetch all active category templates with specifications
        const categoryTemplates = await prisma.categoryTemplate.findMany({
            where: { isActive: true },
            select: {
                id: true,
                name: true,
                slug: true,
                description: true,
                specifications: true,
                commonNames: true,
            },
        });

        // Fetch all approved suppliers with their products and details
        const suppliers = await prisma.supplier.findMany({
            where: { status: "approved" },
            select: {
                id: true,
                companyName: true,
                city: true,
                state: true,
                phone: true,
                email: true,
                description: true,
                productCategories: true,
                badges: true,
                moq: true,
                products: {
                    where: { isActive: true },
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        price: true,
                        priceUnit: true,
                        moq: true,
                        specifications: true,
                        categoryTemplate: {
                            select: {
                                name: true,
                                slug: true,
                            },
                        },
                    },
                    take: 20, // Limit products per supplier
                },
            },
        });

        // Build context object for AI
        const context = {
            // Category information with specifications
            categories: categoryTemplates.map(cat => ({
                name: cat.name,
                slug: cat.slug,
                description: cat.description,
                commonNames: cat.commonNames || [],
                specifications: cat.specifications as Array<{
                    name: string;
                    key: string;
                    type: string;
                    important: boolean;
                    options: string[];
                }>,
            })),

            // Supplier information with products
            suppliers: suppliers.map(s => ({
                id: s.id,
                companyName: s.companyName,
                city: s.city,
                state: s.state,
                badges: s.badges || [],
                moq: s.moq,
                productCategories: s.productCategories || [],
                productCount: s.products.length,
                products: s.products.map(p => ({
                    id: p.id,
                    name: p.name,
                    price: p.price,
                    priceUnit: p.priceUnit,
                    moq: p.moq,
                    category: p.categoryTemplate?.name,
                    specifications: p.specifications,
                })),
            })),

            // Summary stats
            stats: {
                totalCategories: categoryTemplates.length,
                totalSuppliers: suppliers.length,
                totalProducts: suppliers.reduce((sum, s) => sum + s.products.length, 0),
            },
        };

        return NextResponse.json({
            success: true,
            context,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error("Context API Error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch context" },
            { status: 500 }
        );
    }
}
