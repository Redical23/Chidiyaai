import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET() {
    try {
        const buyers = await prisma.buyer.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                _count: {
                    select: {
                        chatSessions: true,
                        contactLogs: true,
                        inquiries: true
                    }
                }
            }
        });

        // Transform to include counts
        const transformedBuyers = buyers.map(buyer => ({
            ...buyer,
            chatCount: buyer._count.chatSessions,
            contactCount: buyer._count.contactLogs,
            inquiries: buyer._count.inquiries,
            severity: buyer.flagSeverity
        }));

        return NextResponse.json(transformedBuyers);
    } catch (error) {
        console.error("Fetch Buyers Error:", error);
        return NextResponse.json({ error: "Failed to fetch buyers" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const { id, action } = await req.json();

        let updateData: any = {};
        let logMessage = "";

        switch (action) {
            case "flag":
                updateData = { flagged: true, flagSeverity: "medium" };
                logMessage = "Flagged buyer";
                break;

            case "dismiss":
                updateData = { flagged: false, flagReason: null, flagSeverity: null };
                logMessage = "Dismissed flag from buyer";
                break;

            case "warn":
                updateData = { status: "warned" };
                logMessage = "Warned buyer";
                break;

            case "restrict":
                updateData = { status: "restricted" };
                logMessage = "Restricted buyer";
                break;

            case "restore":
                updateData = { status: "active", flagged: false, flagReason: null, flagSeverity: null };
                logMessage = "Restored buyer access";
                break;

            default:
                return NextResponse.json({ error: "Invalid action" }, { status: 400 });
        }

        const buyer = await prisma.buyer.update({
            where: { id },
            data: updateData,
            include: {
                _count: {
                    select: {
                        chatSessions: true,
                        contactLogs: true,
                        inquiries: true
                    }
                }
            }
        });

        // Log activity
        await prisma.activityLog.create({
            data: {
                action: action,
                entityType: "buyer",
                entityId: id,
                message: `${logMessage}: ${buyer.name}`
            }
        });

        // Transform response
        const transformedBuyer = {
            ...buyer,
            chatCount: buyer._count.chatSessions,
            contactCount: buyer._count.contactLogs,
            inquiries: buyer._count.inquiries,
            severity: buyer.flagSeverity
        };

        return NextResponse.json(transformedBuyer);
    } catch (error) {
        console.error("Buyer Update Error:", error);
        return NextResponse.json({ error: "Failed to update buyer" }, { status: 500 });
    }
}
