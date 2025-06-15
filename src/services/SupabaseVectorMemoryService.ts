
// SupabaseVectorMemoryService: Vector memory, migrated from localStorage to Supabase
import { supabase } from "@/integrations/supabase/client";

export interface SupabaseVectorMemory {
  id: string;
  agent_id: string;
  content: string;
  embedding: number[];
  source?: string;
  importance?: number;
  tags?: string[];
  created_at?: string;
}

export class SupabaseVectorMemoryService {
  // Store a new vector memory
  static async storeMemory(agentId: string, content: string, source: string, importance: number = 0.5, tags: string[] = [], embedding: number[] = []) {
    const { error } = await supabase.from("vector_memories").insert({
      agent_id: agentId,
      content,
      embedding,
      source,
      importance,
      tags,
    });
    if (error) throw new Error("Supabase vector memory insert error: " + error.message);
  }

  // Simple mimic embedding generator for now (move logic from VectorMemoryService)
  static generateEmbedding(text: string): number[] {
    const words = text.toLowerCase().split(/\s+/);
    const embedding = new Array(384).fill(0);
    words.forEach((word, idx) => {
      for (let i = 0; i < word.length && i < embedding.length; i++) {
        embedding[i] += word.charCodeAt(i % word.length) * (idx + 1);
      }
    });
    const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
    return embedding.map(val => val / (magnitude || 1));
  }

  // Retrieve memories by similarity (top N); simple implementation
  static async retrieveMemories(agentId: string, query: string, limit: number = 10): Promise<SupabaseVectorMemory[]> {
    // Fetch all for this agent and do cosine similarity in-memory (can optimize)
    const { data, error } = await supabase
      .from("vector_memories")
      .select("*")
      .eq("agent_id", agentId)
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) return [];
    const queryEmbedding = this.generateEmbedding(query);
    const withScores = (data || []).map(mem => ({
      ...mem,
      score: this.cosineSimilarity(queryEmbedding, mem.embedding || [])
    }));
    return withScores
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }

  static cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magnitudeA * magnitudeB || 1);
  }

  // Migrate from old localStorage keys
  static async migrateLocalStorageToSupabase(agentId: string) {
    const key = "agi_vector_memories";
    const memoriesRaw = localStorage.getItem(key);
    if (!memoriesRaw) return false;
    let migrated = 0;
    try {
      const memories = JSON.parse(memoriesRaw)[agentId]?.longTerm || [];
      for (const m of memories) {
        await this.storeMemory(
          agentId,
          m.content,
          m.metadata?.source || "legacy",
          m.metadata?.importance || 0.5,
          m.metadata?.tags || [],
          m.embedding || []
        );
        migrated++;
      }
      localStorage.removeItem(key);
    } catch (e) {
      // migration failed, ignore
    }
    return migrated > 0;
  }

  // Memory stats (counts) for UI
  static async getMemoryStats(agentId: string): Promise<{ total: number }> {
    const { count } = await supabase
      .from("vector_memories")
      .select("id", { count: "exact", head: true })
      .eq("agent_id", agentId);
    return { total: count || 0 };
  }
}
