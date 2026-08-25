export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

const GEMINI_API_KEY = "AQ.Ab8RN6K_O4b8cufFGt3iH76N9sGosy6sz4i1MsR2zPhbpW8y8w";
const GEMINI_MODELS = ["gemini-3.5-flash-lite", "gemini-3.6-flash"];

const SYSTEM_INSTRUCTION = `You are Chef Rosette 👩‍🍳, the AI Master Pastry Chef & Sweet Sommelier of CakeBox Bakery.
Your mission is to provide delightful, fast, and highly practical cake design, portion calculations, and flavor pairing advice directly inside the CakeBox mobile app.

CRITICAL BEHAVIOR RULES:
1. Mobile-Optimized Length: Keep replies under 100 words. Never output long walls of text or introductory fluff.
2. No Repetitive Greetings: Only say "Bonjour!" or welcome if the user specifically greets you first. Otherwise, dive directly into your answer.
3. Clean Visual Structure: Use clear markdown with bold headers, bullet points (max 2-3), and generous spacing for small phone screens.
4. Accurate CakeBox Specs:
   - Portions: 6" (4-6 slices), 8" (8-10 slices), 10" (14-18 slices), 2-Tier (20-25 slices).
   - Signatures: Red Velvet Ganache, Strawberry Shortcake, Triple Belgian Chocolate, Pistachio Rose, Vintage Lambeth Buttercream.
5. Tone: Warm, chic, expert, and encouraging with tasteful emojis (🍰, 🍓, ✨, 🎂, 🍫). End with 1 focused, helpful question.`;

export async function askGeminiChef(
  history: ChatMessage[],
  userPrompt: string
): Promise<string> {
  // Format conversation history for Gemini API
  const contents = history.map((msg) => ({
    role: msg.role === 'model' ? 'model' : 'user',
    parts: [{ text: msg.text }]
  }));

  // Append latest user message
  contents.push({
    role: 'user',
    parts: [{ text: userPrompt }]
  });

  let lastError: any = null;

  for (const model of GEMINI_MODELS) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: SYSTEM_INSTRUCTION }]
          },
          contents: contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 800
          }
        })
      });

      if (!response.ok) {
        const errorData = (await response.json().catch(() => ({}))) as any;
        console.warn(`Gemini (${model}) returned ${response.status}:`, errorData?.error?.message);
        lastError = new Error(errorData?.error?.message || `Gemini API error (${response.status})`);
        continue; // Try next model in chain
      }

      const data = (await response.json()) as any;
      const candidate = data?.candidates?.[0];
      const textPart = candidate?.content?.parts?.[0]?.text;

      if (textPart && textPart.trim().length > 0) {
        return textPart.trim();
      }
    } catch (error: any) {
      console.warn(`Error connecting to Gemini model ${model}:`, error.message);
      lastError = error;
    }
  }

  throw lastError || new Error('All Gemini models were unavailable');
}
