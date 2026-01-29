import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

// Create a new chat session
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession();
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        const body = await request.json();
        const { location, category, quantity, budget } = body;

        // Find or create buyer
        let buyer = await prisma.buyer.findUnique({
            where: { email: session.user.email },
        });

        if (!buyer) {
            buyer = await prisma.buyer.create({
                data: {
                    email: session.user.email,
                    name: session.user.name || "User",
                },
            });
        }

        // Create chat session
        const chatSession = await prisma.chatSession.create({
            data: {
                buyerId: buyer.id,
                location,
                category,
                quantity,
                budget,
                status: "active",
            },
        });

        // Update buyer inquiry count
        await prisma.buyer.update({
            where: { id: buyer.id },
            data: { inquiryCount: { increment: 1 } },
        });

        // Log activity
        await prisma.activityLog.create({
            data: {
                action: "chat_session_started",
                entityType: "chat_session",
                entityId: chatSession.id,
                message: `Buyer started search for ${category} in ${location}`,
            },
        });

        return NextResponse.json({
            success: true,
            sessionId: chatSession.id,
        });
    } catch (error) {
        console.error("Create chat session error:", error);
        return NextResponse.json(
            { error: "Failed to create chat session" },
            { status: 500 }
        );
    }
}

// Update chat session status
export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { sessionId, status } = body;

        if (!sessionId) {
            return NextResponse.json({ error: "Session ID required" }, { status: 400 });
        }

        await prisma.chatSession.update({
            where: { id: sessionId },
            data: { status },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Update chat session error:", error);
        return NextResponse.json(
            { error: "Failed to update session" },
            { status: 500 }
        );
    }
}
