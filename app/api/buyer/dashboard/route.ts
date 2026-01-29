import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession();
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        // Find buyer by email
        const buyer = await prisma.buyer.findUnique({
            where: { email: session.user.email },
        });

        if (!buyer) {
            return NextResponse.json({
                chatSessions: [],
                savedSuppliers: [],
                recentActivity: []
            });
        }

        // Get chat sessions
        const chatSessions = await prisma.chatSession.findMany({
            where: { buyerId: buyer.id },
            orderBy: { createdAt: "desc" },
            take: 10,
            include: {
                messages: {
                    take: 1,
                    orderBy: { createdAt: "desc" },
                },
            },
        });

        // Get saved suppliers
        const savedSupplierRecords = await prisma.savedSupplier.findMany({
            where: { buyerId: buyer.id },
            orderBy: { savedAt: "desc" },
            take: 10,
        });

        const supplierIds = savedSupplierRecords.map(s => s.supplierId);
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

        // Get contact logs as recent activity
        const contactLogs = await prisma.supplierContactLog.findMany({
            where: { buyerId: buyer.id },
            orderBy: { viewedAt: "desc" },
            take: 10,
        });

        // Build recent activity from contact logs
        const contactSupplierIds = contactLogs.map(c => c.supplierId);
        const contactedSuppliers = await prisma.supplier.findMany({
            where: { id: { in: contactSupplierIds } },
            select: { id: true, companyName: true },
        });

        const supplierMap = new Map(contactedSuppliers.map(s => [s.id, s]));

        const recentActivity = contactLogs.map(log => ({
            type: "contact_viewed",
            supplierId: log.supplierId,
            supplierName: supplierMap.get(log.supplierId)?.companyName || "Unknown",
            timestamp: log.viewedAt,
        }));

        return NextResponse.json({
            success: true,
            chatSessions: chatSessions.map(cs => ({
                id: cs.id,
                location: cs.location,
                category: cs.category,
                quantity: cs.quantity,
                budget: cs.budget,
                status: cs.status,
                createdAt: cs.createdAt,
                lastMessage: cs.messages[0]?.content?.substring(0, 100) || null,
            })),
            savedSuppliers: suppliers,
            recentActivity,
        });
    } catch (error) {
        console.error("Dashboard data error:", error);
        return NextResponse.json(
            { error: "Failed to get dashboard data" },
            { status: 500 }
        );
    }
}
