
import { GoogleGenAI } from "@google/genai";

// FIX: Per coding guidelines, the API key is assumed to be available in process.env.
// The client should be initialized directly with it.
// Removed unnecessary constant and availability checks.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const generateFoodDescription = async (title: string): Promise<string> => {
  // FIX: Removed redundant API key check inside the function, as its availability is a precondition.
  try {
    const prompt = `Create a short, appealing, and friendly description for a food donation listing. The title of the item is "${title}". The description should be under 200 characters. Mention it's a great opportunity for a delicious meal and highlight the spirit of community sharing. Do not use hashtags or emojis.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
       config: {
         thinkingConfig: { thinkingBudget: 0 }
       }
    });

    if (response.text) {
      return response.text.trim();
    }
    throw new Error("Failed to get a valid response from the AI.");

  } catch (error) {
    console.error("Error generating food description:", error);
    return "We couldn't generate a description at this time. Please write one manually.";
  }
};
