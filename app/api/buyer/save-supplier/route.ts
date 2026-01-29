import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { supplierId, buyerId } = body;

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

        if (!finalBuyerId) {
            return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
        }

        // Check if already saved
        const existing = await prisma.savedSupplier.findUnique({
            where: {
                buyerId_supplierId: {
                    buyerId: finalBuyerId,
                    supplierId,
                },
            },
        });

        if (existing) {
            // Remove from saved
            await prisma.savedSupplier.delete({
                where: { id: existing.id },
            });
            return NextResponse.json({
                success: true,
                saved: false,
                message: "Supplier removed from saved",
            });
        }

        // Save the supplier
        await prisma.savedSupplier.create({
            data: {
                buyerId: finalBuyerId,
                supplierId,
            },
        });

        // Log activity
        await prisma.activityLog.create({
            data: {
                action: "supplier_saved",
                entityType: "supplier",
                entityId: supplierId,
                message: `Buyer saved supplier`,
            },
        });

        return NextResponse.json({
            success: true,
            saved: true,
            message: "Supplier saved",
        });
    } catch (error) {
        console.error("Save supplier error:", error);
        return NextResponse.json(
            { error: "Failed to save supplier" },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession();
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        const buyer = await prisma.buyer.findUnique({
            where: { email: session.user.email },
        });

        if (!buyer) {
            return NextResponse.json({ suppliers: [] });
        }

        const savedSuppliers = await prisma.savedSupplier.findMany({
            where: { buyerId: buyer.id },
            orderBy: { savedAt: "desc" },
        });

        // Get supplier details
        const supplierIds = savedSuppliers.map(s => s.supplierId);
        const suppliers = await prisma.supplier.findMany({
            where: { id: { in: supplierIds } },
            select: {
                id: true,
                companyName: true,
                city: true,
                productCategories: true,
                badges: true,
                phone: true,
            },
        });

        return NextResponse.json({
            success: true,
            suppliers,
        });
    } catch (error) {
        console.error("Get saved suppliers error:", error);
        return NextResponse.json(
            { error: "Failed to get saved suppliers" },
            { status: 500 }
        );
    }
}
