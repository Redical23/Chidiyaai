import { GoogleGenAI } from "@google/genai";

// Initialize with API key from environment
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || "";
const ai = new GoogleGenAI({ apiKey });

// System prompt for the B2B sourcing assistant
export const SYSTEM_PROMPT = `You are Chidiya, a friendly B2B packaging sourcing assistant for India.

IMPORTANT RULES:
- Keep responses SHORT (1-2 sentences max)
- DO NOT use markdown formatting (no **, no *, no #)
- Use plain text only
- Be conversational and warm
- NEVER list options like "Options: 65ml, 90ml, 120ml..."
- NEVER say things like "Great choice!" or "Perfect!"
- DO NOT list suppliers in text - they are shown separately as visual cards
- DO NOT ask questions the user already answered
- When suppliers are found, just say you found them and ask if they need help

Your job:
1. If user gives full details (product, size, quantity), say you're finding suppliers
2. If details are missing, ask ONE simple question
3. When suppliers are found, say "I found some suppliers for you!" and ask if they need anything else
4. NEVER list suppliers - the UI shows cards

Examples of GOOD responses:
- "What size paper cups do you need?"
- "How many do you need?"
- "I found some suppliers for you! Need help with anything else?"

Examples of BAD responses (NEVER do these):
- "Great choice! For paper cup, which size/type do you prefer? Options: 65ml, 90ml..."
- "Found 3 suppliers: 1. ABC Packaging..."`;


// Message history type
export interface ChatMessage {
    role: "user" | "model";
    content: string;
}

// User requirements from pre-chat questionnaire
export interface UserRequirements {
    location?: string;
    category?: string;
    quantity?: string;
    budget?: string;
}

// Generate a response from Gemini
export async function generateChatResponse(
    userMessage: string,
    conversationHistory: ChatMessage[],
    userRequirements?: UserRequirements,
    supplierData?: string
): Promise<string> {
    try {
        // Build the conversation context
        let contextMessage = "";

        if (userRequirements) {
            const reqs = [];
            if (userRequirements.location) reqs.push("Location: " + userRequirements.location);
            if (userRequirements.category) reqs.push("Category: " + userRequirements.category);
            if (userRequirements.quantity) reqs.push("Quantity: " + userRequirements.quantity);
            if (userRequirements.budget) reqs.push("Budget: " + userRequirements.budget);

            if (reqs.length > 0) {
                contextMessage = "\n\nUser's initial requirements:\n" + reqs.join("\n");
            }
        }

        // Add supplier data if available
        if (supplierData) {
            contextMessage += "\n\n[System: Supplier cards are being displayed separately in the UI. DO NOT list suppliers in your response. Just acknowledge you found suppliers and ask if they need anything else or want to refine their search.]";
        }

        // Build the full prompt with history
        const historyText = conversationHistory
            .map((msg) => (msg.role === "user" ? "User" : "Assistant") + ": " + msg.content)
            .join("\n\n");

        const fullPrompt = SYSTEM_PROMPT + contextMessage + "\n\n" +
            (historyText ? "Previous conversation:\n" + historyText + "\n\n" : "") +
            "User: " + userMessage + "\n\nAssistant:";

        // Call Gemini API with gemini-2.5-flash
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: fullPrompt,
        });

        // Extract text from response
        const text = response.candidates?.[0]?.content?.parts?.[0]?.text ||
            response.text ||
            "I apologize, but I could not generate a response. Please try again.";

        return text;
    } catch (error: unknown) {
        console.error("Gemini API Error:", error);

        // Check if it's a rate limit error
        const errorStr = String(error);
        if (errorStr.includes("429") || errorStr.includes("quota")) {
            // Return a friendly message instead of throwing
            return "I'm experiencing high traffic right now. Please try again in a few seconds. Your request for " +
                (userRequirements?.category || "packaging products") + " in " +
                (userRequirements?.location || "your area") + " is noted!";
        }

        throw error;
    }
}

// Check if we should fetch suppliers based on conversation
export function shouldFetchSuppliers(messageCount: number, lastMessage: string): boolean {
    const lowerMessage = lastMessage.toLowerCase();

    // Product keywords that indicate user wants to find suppliers
    const productKeywords = [
        "cup", "box", "tape", "bag", "wrap", "packaging", "poly", "corrugated", "bopp",
        "need", "want", "looking", "find", "search", "get", "show", "require", "order"
    ];

    // Check if message contains product keywords
    const hasProductKeyword = productKeywords.some(keyword => lowerMessage.includes(keyword));

    // Always fetch if user mentions a product or quantity
    const hasQuantity = /\d+/.test(lastMessage);

    // Fetch on first message if it contains product info, OR after 2 messages, OR if has trigger phrases
    return (messageCount >= 1 && (hasProductKeyword || hasQuantity)) || messageCount >= 3;
}

