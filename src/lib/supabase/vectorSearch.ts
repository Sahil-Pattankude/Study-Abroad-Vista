import { supabaseAdmin } from "@/lib/supabase/server";
import { generateEmbedding } from "@/lib/gemini/client";

export interface MatchedDocument {
  id: string;
  title: string;
  content: string;
  comment?: string | null;
  similarity: number;
}

/**
 * Computes cosine similarity between two float vectors
 */
function computeCosineSimilarity(a: number[], b: number[]): number {
  if (!a || !b || a.length !== b.length) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Perform semantic vector similarity search against Supabase `ai_counsellor_kb`
 *
 * @param queryText - The user's query or question string
 * @param matchThreshold - Minimum cosine similarity score (0.0 to 1.0, default 0.45)
 * @param matchCount - Maximum number of top matching documents to return (default 5)
 */
export async function searchSimilarDocuments(
  queryText: string,
  matchThreshold: number = 0.45,
  matchCount: number = 5,
): Promise<MatchedDocument[]> {
  try {
    if (!queryText || !queryText.trim()) return [];

    // 1. Convert user query text into a vector embedding using Gemini
    const queryEmbedding = await generateEmbedding(queryText.trim());

    // 2. Try Supabase pgvector RPC function `match_ai_counsellor_kb` or `match_knowledge_base`
    const rpcAttempts = ["match_ai_counsellor_kb", "match_knowledge_base"];
    for (const rpcName of rpcAttempts) {
      const { data, error } = await supabaseAdmin.rpc(rpcName, {
        query_embedding: queryEmbedding,
        match_threshold: matchThreshold,
        match_count: matchCount,
      });

      if (!error && Array.isArray(data) && data.length > 0) {
        return data as MatchedDocument[];
      }
    }

    // 3. Fallback: Fetch vectorized rows directly from `ai_counsellor_kb` and compute Cosine Similarity in TS
    const { data: rows, error: fetchErr } = await supabaseAdmin
      .from("ai_counsellor_kb")
      .select("id, title, content, comment, embedding")
      .not("embedding", "is", null)
      .limit(100);

    if (fetchErr || !rows) {
      console.warn(
        "Could not fetch ai_counsellor_kb rows for vector search:",
        fetchErr,
      );
      return [];
    }

    const scored: MatchedDocument[] = rows
      .map((row) => {
        let vec: number[] = [];
        if (Array.isArray(row.embedding)) {
          vec = row.embedding;
        } else if (typeof row.embedding === "string") {
          try {
            vec = JSON.parse(row.embedding);
          } catch {
            vec = row.embedding
              .replace(/[\[\]]/g, "")
              .split(",")
              .map(Number);
          }
        }

        return {
          id: String(row.id),
          title: row.title || "",
          content: row.content || "",
          comment: row.comment || null,
          similarity: computeCosineSimilarity(queryEmbedding, vec),
        };
      })
      .filter((item) => item.similarity >= matchThreshold)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, matchCount);

    return scored;
  } catch (err) {
    console.error("Failed to perform vector search:", err);
    return [];
  }
}
