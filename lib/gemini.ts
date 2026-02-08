import { GoogleGenAI } from "@google/genai";

// Initialize with API key from environment
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || "";
const ai = new GoogleGenAI({ apiKey });

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

// Category specification from database
export interface CategorySpec {
    name: string;
    key: string;
    type: "single" | "multi";
    important: boolean;
    options: string[];
}

// Category context from database
export interface CategoryContext {
    name: string;
    slug: string;
    description?: string;
    commonNames: string[];
    specifications: CategorySpec[];
}

// Extract specifications that user already provided in their message
export function extractProvidedSpecs(
    message: string,
    categorySpecs: CategorySpec[]
): { key: string; value: string }[] {
    const lowerMessage = message.toLowerCase();
    const providedSpecs: { key: string; value: string }[] = [];

    for (const spec of categorySpecs) {
        for (const option of spec.options) {
            // Check if user mentioned this option (or close variant)
            const optionLower = option.toLowerCase();
            const optionVariants = [
                optionLower,
                optionLower.replace(/\s+/g, ""), // "65 ml" -> "65ml"
                optionLower.replace(/[()]/g, "").trim(), // Remove parentheses
            ];

            for (const variant of optionVariants) {
                if (variant !== "other" && lowerMessage.includes(variant)) {
                    providedSpecs.push({ key: spec.key, value: option });
                    break;
                }
            }
        }
    }

    return providedSpecs;
}

// Match user message to a category using common names
export function matchCategory(
    message: string,
    categories: CategoryContext[]
): CategoryContext | null {
    const lowerMessage = message.toLowerCase();

    for (const category of categories) {
        // Check category name
        if (lowerMessage.includes(category.name.toLowerCase())) {
            return category;
        }

        // Check common names
        for (const commonName of category.commonNames || []) {
            if (lowerMessage.includes(commonName.toLowerCase())) {
                return category;
            }
        }

        // Check slug
        if (lowerMessage.includes(category.slug.replace(/-/g, " "))) {
            return category;
        }
    }

    return null;
}

// Get missing important specifications
export function getMissingSpecs(
    providedSpecs: { key: string; value: string }[],
    categorySpecs: CategorySpec[]
): CategorySpec[] {
    const providedKeys = new Set(providedSpecs.map(s => s.key));

    return categorySpecs.filter(
        spec => spec.important && !providedKeys.has(spec.key)
    );
}

// Build dynamic system prompt with category context
export function buildSystemPrompt(
    categories: CategoryContext[],
    matchedCategory?: CategoryContext,
    providedSpecs?: { key: string; value: string }[],
    missingSpecs?: CategorySpec[]
): string {
    let prompt = `You are Chidiya, a friendly B2B sourcing assistant for India.

CRITICAL RULES:
- Keep responses SHORT (1-2 sentences max)
- DO NOT use markdown formatting (no **, no *, no #)
- Use plain text only
- Be conversational and warm
- NEVER say things like "Great choice!" or "Perfect!"
- DO NOT list suppliers in text - they are shown as visual cards
- DO NOT ask questions the user already answered
- When suppliers are found, just say you found them

`;

    // Add category knowledge
    if (categories.length > 0) {
        prompt += `AVAILABLE CATEGORIES (with common Indian names):\n`;
        for (const cat of categories.slice(0, 10)) {
            const names = [cat.name, ...(cat.commonNames || []).slice(0, 3)].join(", ");
            prompt += `- ${names}\n`;
        }
        prompt += "\n";
    }

    // Add matched category context
    if (matchedCategory) {
        prompt += `USER IS ASKING ABOUT: ${matchedCategory.name}\n`;

        if (providedSpecs && providedSpecs.length > 0) {
            prompt += `ALREADY PROVIDED:\n`;
            for (const spec of providedSpecs) {
                prompt += `- ${spec.key}: ${spec.value}\n`;
            }
        }

        if (missingSpecs && missingSpecs.length > 0) {
            const nextSpec = missingSpecs[0];
            prompt += `\nASK ABOUT THIS NEXT: ${nextSpec.name}\n`;
            prompt += `Valid options: ${nextSpec.options.slice(0, 5).join(", ")}\n`;
            prompt += `\nAsk naturally, like: "What ${nextSpec.name.toLowerCase()} do you need?" - DO NOT list all options.\n`;
        }
    }

    prompt += `
Your job:
1. Identify what product/category user needs
2. Ask ONE simple question about missing details (size, type, quantity)
3. When you have enough info, say "Finding suppliers for you..." 
4. After suppliers are found, ask if they need help refining

NEVER list options like "Options: 65ml, 90ml..." - just ask naturally.`;

    return prompt;
}

// Generate a response from Gemini with category context
export async function generateChatResponse(
    userMessage: string,
    conversationHistory: ChatMessage[],
    userRequirements?: UserRequirements,
    supplierData?: string,
    categoryContext?: {
        categories: CategoryContext[];
        matchedCategory?: CategoryContext;
        providedSpecs?: { key: string; value: string }[];
        missingSpecs?: CategorySpec[];
    }
): Promise<string> {
    try {
        // Build dynamic system prompt
        const systemPrompt = categoryContext
            ? buildSystemPrompt(
                categoryContext.categories,
                categoryContext.matchedCategory,
                categoryContext.providedSpecs,
                categoryContext.missingSpecs
            )
            : buildSystemPrompt([]);

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

        // Add supplier data notification
        if (supplierData) {
            contextMessage += "\n\n[System: Supplier cards are now displayed in the UI. DO NOT list suppliers. Just acknowledge you found them and ask if user needs to refine their search.]";
        }

        // Build the full prompt with history
        const historyText = conversationHistory
            .map((msg) => (msg.role === "user" ? "User" : "Assistant") + ": " + msg.content)
            .join("\n\n");

        const fullPrompt = systemPrompt + contextMessage + "\n\n" +
            (historyText ? "Previous conversation:\n" + historyText + "\n\n" : "") +
            "User: " + userMessage + "\n\nAssistant:";

        // Call Gemini API
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
            return "I'm experiencing high traffic right now. Please try again in a few seconds. Your request for " +
                (userRequirements?.category || "packaging products") + " in " +
                (userRequirements?.location || "your area") + " is noted!";
        }

        throw error;
    }
}

// Check if we should fetch suppliers based on conversation
export function shouldFetchSuppliers(
    messageCount: number,
    lastMessage: string,
    providedSpecs?: { key: string; value: string }[],
    missingImportantSpecs?: CategorySpec[]
): boolean {
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

    // If we have provided specs and few/no missing important specs, fetch suppliers
    const hasEnoughSpecs = providedSpecs && providedSpecs.length >= 1 &&
        (!missingImportantSpecs || missingImportantSpecs.length <= 1);

    // Fetch on first message if it contains product info with specs, OR after 2 messages
    return (messageCount >= 1 && hasProductKeyword && (hasQuantity || hasEnoughSpecs)) ||
        messageCount >= 3;
}
