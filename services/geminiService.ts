import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY not found in environment variables. Mocking Gemini response.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const getDestinationInsight = async (destination: string): Promise<string> => {
  const ai = getClient();
  if (!ai) {
    return `Enjoy your stay in ${destination}! It is a wonderful place with great sights and food.`;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Provide a helpful, catchy 2-sentence travel tip or insight for a tourist visiting ${destination}. Do not include hashtags.`,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return `Discover the hidden gems of ${destination} during your luxurious stay.`;
  }
};
