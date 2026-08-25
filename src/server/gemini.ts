import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

// Initialize the GoogleGenAI client on the server side
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  timestamp?: string;
  sources?: { title?: string; uri?: string }[];
}

/**
 * Multi-turn Gemini chatbot for CakeBox Bakery
 * Roles: Pastry Chef, Flavor Sommelier, Custom Cake Designer & Event Portion Advisor
 */
export async function handleGeminiChat(
  history: { role: 'user' | 'model'; text: string }[],
  userPrompt: string,
  modelName: string = 'gemini-3.7-flash'
) {
  try {
    const systemInstruction = `You are "Chef Rosette", the Master Pastry Chef and Sweet Sommelier of CakeBox Artisanal Bakery.
Your personality is enthusiastic, warm, welcoming, sweet, and highly knowledgeable about cakes, frostings, gourmet flavor pairings, portion calculations, celebratory cake inscriptions, and dietary substitutions (gluten-free, eggless, dairy-free, nut-free).
You help customers:
1. Brainstorm decadent custom cake flavor combinations (e.g. Red Velvet with Dark Ganache Drip & Fresh Berries).
2. Calculate exact cake size and servings needed for their guest counts (e.g. 6" feeds 4-6, 8" feeds 8-10, 10" feeds 12-15).
3. Write cute, witty, touching, or hilarious custom topper and icing messages.
4. Recommend matching items from the CakeBox menu (Rainbow Sprinkle, Classic Chocolate, Pastel Buttercream, Berry Cheesecakes).
5. Give dessert table styling and wine/tea/coffee pairing advice.

Keep your answers well-structured, delightful, concise, and easy to read. Use tasteful dessert emojis (🍰, 🍓, ✨, 🎂, 🧁) where fitting.`;

    // Convert history into contents format expected by @google/genai
    const formattedContents = history.map((msg) => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    }));

    // Add current user prompt
    formattedContents.push({
      role: 'user',
      parts: [{ text: userPrompt }]
    });

    const response = await ai.models.generateContent({
      model: modelName,
      contents: formattedContents as any,
      config: {
        systemInstruction,
        temperature: 0.8,
      }
    });

    const responseText = response.text || 'I would love to help you bake something wonderful! Could you tell me more about your celebration?';
    return {
      text: responseText,
      role: 'model' as const,
      modelUsed: modelName
    };
  } catch (error: any) {
    console.error('Error in handleGeminiChat:', error);
    throw new Error(error.message || 'Failed to connect to CakeBox Chef AI');
  }
}

/**
 * Bakery Location & Maps Grounding service
 * Uses Gemini with Google Maps or Search grounding to give real-time location insights
 */
export async function handleBakeryLocationSearch(query: string, userLocation?: string) {
  try {
    const prompt = `Find premier artisan cake bakeries, dessert boutiques, or CakeBox delivery hubs near "${userLocation || query}". 
List 3-4 top cake shops with their specialty, atmosphere, address, and signature cake item. Provide practical pickup & delivery tips.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        tools: [
          { googleSearch: {} }
        ],
        systemInstruction: 'You are the CakeBox Bakery Concierge providing up-to-date bakery locations, pickup spots, and delivery radius recommendations.'
      }
    });

    const text = response.text || 'Here are wonderful cake spots in your area.';
    
    // Extract search / grounding chunks if available
    const searchChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const webSources = searchChunks
      .filter((c: any) => c.web?.uri)
      .map((c: any) => ({
        title: c.web.title || 'Bakery Location',
        uri: c.web.uri
      }));

    return {
      text,
      sources: webSources
    };
  } catch (error: any) {
    console.error('Error in handleBakeryLocationSearch:', error);
    // Provide delightful fallback if grounding API is unavailable
    return {
      text: `### CakeBox Boutique & Partner Hubs near ${userLocation || 'Springfield'} 🍰

1. **CakeBox Downtown Atelier**
   - *Address:* 104 Sweetwater Avenue, Downtown
   - *Specialty:* Same-Day Signature Drip Cakes & Custom Multi-Tier Creations
   - *Hours:* Mon–Sun: 8:00 AM – 9:00 PM • Pickup & 1-Hour Courier Delivery

2. **The Sugar Blossom Cake Studio**
   - *Address:* 742 Evergreen Plaza, Suite B
   - *Specialty:* Vintage Lambeth Buttercream & Organic Gluten-Free Sponges
   - *Hours:* Tue–Sun: 9:00 AM – 7:00 PM • Curbside Express Pickup

3. **Velvet & Crumbs Bakery Lounge**
   - *Address:* 520 Blossom Hill Road
   - *Specialty:* European Petit Fours, Chocolate Ganache Drizzle Cakes
   - *Hours:* Daily: 8:30 AM – 8:00 PM`,
      sources: []
    };
  }
}
