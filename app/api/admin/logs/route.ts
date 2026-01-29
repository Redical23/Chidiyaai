import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const type = searchParams.get("type") || "all";
        const search = searchParams.get("search") || "";
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "50");

        const where: any = {};

        // Filter by type
        if (type && type !== "all") {
            where.action = { contains: type };
        }

        // Search in message
        if (search) {
            where.message = { contains: search, mode: "insensitive" };
        }

        // Fetch logs with pagination, sorted by most recent first
        const [logs, total] = await Promise.all([
            prisma.activityLog.findMany({
                where,
                orderBy: { createdAt: "desc" },
                skip: (page - 1) * limit,
                take: limit,
                include: {
                    admin: {
                        select: { name: true, email: true }
                    }
                }
            }),
            prisma.activityLog.count({ where })
        ]);

        // Transform logs for frontend
        const transformedLogs = logs.map(log => ({
            id: log.id,
            type: getLogType(log.action),
            action: formatAction(log.action),
            details: log.message,
            user: log.admin?.name || log.admin?.email || "System",
            timestamp: log.createdAt.toISOString(),
            entityType: log.entityType,
            entityId: log.entityId
        }));

        return NextResponse.json({
            logs: transformedLogs,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        });
    } catch (error) {
        console.error("Fetch Logs Error:", error);
        return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 });
    }
}

// Export logs as JSON (can be converted to PDF on frontend)
export async function POST(req: Request) {
    try {
        const { type, search, startDate, endDate } = await req.json();

        const where: any = {};

        if (type && type !== "all") {
            where.action = { contains: type };
        }

        if (search) {
            where.message = { contains: search, mode: "insensitive" };
        }

        if (startDate || endDate) {
            where.createdAt = {};
            if (startDate) where.createdAt.gte = new Date(startDate);
            if (endDate) where.createdAt.lte = new Date(endDate);
        }

        const logs = await prisma.activityLog.findMany({
            where,
            orderBy: { createdAt: "desc" },
            include: {
                admin: {
                    select: { name: true, email: true }
                }
            }
        });

        const exportData = logs.map(log => ({
            id: log.id,
            action: formatAction(log.action),
            details: log.message,
            user: log.admin?.name || log.admin?.email || "System",
            timestamp: log.createdAt.toISOString(),
            entityType: log.entityType,
            entityId: log.entityId
        }));

        return NextResponse.json({
            success: true,
            logs: exportData,
            exportedAt: new Date().toISOString()
        });
    } catch (error) {
        console.error("Export Logs Error:", error);
        return NextResponse.json({ error: "Failed to export logs" }, { status: 500 });
    }
}

// Helper functions
function getLogType(action: string): string {
    if (action.includes("approve") || action.includes("reject")) return "approval";
    if (action.includes("suspend") || action.includes("ban")) return "suspension";
    if (action.includes("badge")) return "badge";
    if (action.includes("warn") || action.includes("flag") || action.includes("restrict")) return "buyer_action";
    if (action.includes("category")) return "category";
    if (action.includes("login")) return "login";
    if (action.includes("inquiry")) return "inquiry";
    return "general";
}

function formatAction(action: string): string {
    // Convert snake_case to Title Case
    return action
        .split("_")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}
