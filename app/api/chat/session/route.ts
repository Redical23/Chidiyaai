import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET(request: NextRequest) {
    try {
        // Get session ID from query params
        const { searchParams } = new URL(request.url);
        const sessionId = searchParams.get("id");

        if (!sessionId) {
            return NextResponse.json({ success: false, error: "Session ID required" }, { status: 400 });
        }

        // Verify user is authenticated
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret") as { email: string; userType: string };
        } catch {
            return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });
        }

        // Get buyer
        const buyer = await prisma.buyer.findUnique({
            where: { email: decoded.email }
        });

        if (!buyer) {
            return NextResponse.json({ success: false, error: "Buyer not found" }, { status: 404 });
        }

        // Get chat session with messages
        const session = await prisma.chatSession.findFirst({
            where: {
                id: sessionId,
                buyerId: buyer.id
            },
            include: {
                messages: {
                    orderBy: { createdAt: "asc" }
                }
            }
        });

        if (!session) {
            return NextResponse.json({ success: false, error: "Session not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            session: {
                id: session.id,
                location: session.location,
                category: session.category,
                quantity: session.quantity,
                budget: session.budget,
                status: session.status,
                messages: session.messages.map(msg => ({
                    role: msg.role,
                    content: msg.content,
                    createdAt: msg.createdAt.toISOString()
                }))
            }
        });
    } catch (error) {
        console.error("Error fetching session:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch session" }, { status: 500 });
    }
}
