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

// Match user message to a category using common names and keyword matching
export function matchCategory(
    message: string,
    categories: CategoryContext[]
): CategoryContext | null {
    const lowerMessage = message.toLowerCase();
    const stopWords = ['and', 'the', 'for', 'raw', 'fabric', 'fabrics', 'materials'];

    for (const category of categories) {
        // Check if full category name is in message
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

        // NEW: Check if any significant keyword from category name appears in message
        // This allows "polyester" to match "Polyester Fabric"
        const categoryWords = category.name.toLowerCase().split(' ')
            .filter(word => word.length > 3 && !stopWords.includes(word));

        for (const word of categoryWords) {
            if (lowerMessage.includes(word)) {
                return category;
            }
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
    missingSpecs?: CategorySpec[],
    suppliersFound?: boolean
): string {
    let prompt = `You are Chidiya, a friendly B2B sourcing assistant for India.

CRITICAL RULES:
- Keep responses SHORT (1-2 sentences max)
- DO NOT use markdown formatting (no **, no *, no #)
- Use plain text only
- Be warm but professional
- DO NOT list suppliers - they appear as visual cards BELOW your message
- DO NOT ask questions the user already answered

`;

    // Response structure based on whether suppliers are found
    if (suppliersFound) {
        prompt += `RESPONSE STRUCTURE (IMPORTANT):
When suppliers are found, your message should follow this EXACT format:
1. First line: Acknowledge what they asked for (e.g., "Found some suppliers for cotton textiles in your area.")
2. Second line: Brief note that cards are showing below
3. Third line (optional): Suggest providing more details for better matches

Example good response when suppliers found:
"Based on your requirements, here are some suppliers for cotton textiles. For more accurate matches, you can specify the type (woven, knitted) or quantity needed."

DO NOT ask "What kind of..." questions BEFORE showing results.
The question/suggestion should come AFTER acknowledging the results.

`;
    } else {
        prompt += `RESPONSE STRUCTURE:
When no suppliers found or need more info:
1. Acknowledge what they're looking for
2. Ask ONE simple clarifying question

Example: "Looking for cotton textiles. Which city are you in?"

`;
    }

    // Add category knowledge
    if (categories.length > 0) {
        prompt += `AVAILABLE CATEGORIES:\n`;
        for (const cat of categories.slice(0, 8)) {
            prompt += `- ${cat.name}\n`;
        }
        prompt += "\n";
    }

    // Add matched category context
    if (matchedCategory) {
        prompt += `USER IS LOOKING FOR: ${matchedCategory.name}\n`;

        if (providedSpecs && providedSpecs.length > 0) {
            prompt += `Details provided: `;
            prompt += providedSpecs.map(s => `${s.key}=${s.value}`).join(", ");
            prompt += "\n";
        }

        if (!suppliersFound && missingSpecs && missingSpecs.length > 0) {
            const nextSpec = missingSpecs[0];
            prompt += `You may ask about: ${nextSpec.name}\n`;
        }
    }

    prompt += `
Remember: Supplier cards appear BELOW your text message. Your job is just to acknowledge and guide, not list anything.`;

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
        // Detect if suppliers were found
        const suppliersFound = !!supplierData && supplierData.length > 0;

        // Build dynamic system prompt
        const systemPrompt = categoryContext
            ? buildSystemPrompt(
                categoryContext.categories,
                categoryContext.matchedCategory,
                categoryContext.providedSpecs,
                categoryContext.missingSpecs,
                suppliersFound
            )
            : buildSystemPrompt([], undefined, undefined, undefined, suppliersFound);


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
