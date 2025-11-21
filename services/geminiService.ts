import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY;
// Initialize safely only if API key exists to prevent runtime crashes if env is missing
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const generateProductDescription = async (name: string, tags: string = ''): Promise<string> => {
  if (!ai) {
    console.warn("Gemini API Key is missing.");
    return "Description generation unavailable (Missing API Key).";
  }

  try {
    const model = 'gemini-2.5-flash';
    const prompt = `Write a short, persuasive sales description (max 2 sentences) for a product named "${name}". ${tags ? `Keywords: ${tags}.` : ''} Keep it professional and suitable for an inventory sales app.`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "No description generated.";
  } catch (error) {
    console.error("Error generating description:", error);
    return "Failed to generate description.";
  }
};

export const analyzeStockAction = async (productName: string, currentStock: number, salesTrend: string): Promise<string> => {
    if (!ai) return "AI analysis unavailable.";
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `I have a product "${productName}" with ${currentStock} units in stock. Recent sales trend is ${salesTrend}. Give me a 10-word recommendation on restocking.`
        });
        return response.text || "No recommendation.";
    } catch (e) {
        return "Could not analyze.";
    }
}
