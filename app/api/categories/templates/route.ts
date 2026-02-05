import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET - Fetch all active category templates
export async function GET(request: NextRequest) {
    try {
        const categories = await prisma.categoryTemplate.findMany({
            where: {
                isActive: true
            },
            orderBy: {
                name: 'asc'
            },
            select: {
                id: true,
                name: true,
                slug: true,
                description: true,
                image: true,
                specifications: true
            }
        });

        return NextResponse.json({
            categories,
            count: categories.length
        });
    } catch (error) {
        console.error("Error fetching category templates:", error);
        return NextResponse.json(
            { error: "Failed to fetch categories" },
            { status: 500 }
        );
    }
}
