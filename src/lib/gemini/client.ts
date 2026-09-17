import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY || "";

export const genAI = new GoogleGenerativeAI(apiKey);

export const GEMINI_CHAT_MODEL = process.env.GEMINI_MODEL || "gemini-1.5-flash";
export const GEMINI_EMBED_MODEL = process.env.GEMINI_EMBEDDING_MODEL || "text-embedding-004";

/**
 * Get configured Gemini Generative Model instance
 */
export function getGeminiModel(modelName: string = GEMINI_CHAT_MODEL, systemInstruction?: string) {
  return genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: systemInstruction || "You are the StudyAbroad Vista AI Counsellor, an authoritative, warm, and guiding study abroad advisor for Indian students and families.",
    generationConfig: {
      temperature: 0.3,
      maxOutputTokens: 1000,
    },
  });
}

/**
 * Generate 768-dimensional vector embedding for text
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  const model = genAI.getGenerativeModel({ model: GEMINI_EMBED_MODEL });
  const result = await model.embedContent(text);
  return result.embedding.values;
}
