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

  static async retrieveMemories(agentId: string, query: string, limit: number = 10): Promise<SupabaseVectorMemory[]> {
    const { data, error } = await supabase
      .from("vector_memories")
      .select("*")
      .eq("agent_id", agentId)
      .order("created_at", { ascending: false })
      .limit(200);

    if (error || !Array.isArray(data)) return [];
    const queryEmbedding = this.generateEmbedding(query);

    const withScores: SupabaseVectorMemory[] = [];
    (data as any[]).forEach(raw => {
      if (
        !raw ||
        typeof raw !== "object" ||
        !("embedding" in raw) ||
        raw === null
      )
        return;
      let embedding: number[] = [];
      if (Array.isArray((raw as any).embedding)) {
        embedding = (raw as any).embedding as number[];
      } else if (typeof (raw as any).embedding === "string") {
        try {
          embedding = JSON.parse((raw as any).embedding);
        } catch {
          embedding = [];
        }
      }
      const score = this.cosineSimilarity(queryEmbedding, embedding);
      if (
        typeof (raw as any).id === "string" &&
        typeof (raw as any).content === "string"
      ) {
        withScores.push({
          ...(raw as object),
          embedding,
          score,
        } as any); // safe to spread, since we know raw is object
      }
    });

    withScores.sort((a, b) => (b as any).score - (a as any).score);
    return withScores.slice(0, limit);
  }

  static cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length || a.length === 0) return 0;
    const dotProduct = a.reduce((sum, val, i) => sum + val * (b[i] ?? 0), 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / ((magnitudeA * magnitudeB) || 1);
  }

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
      // ignore
    }
    return migrated > 0;
  }

  static async getMemoryStats(agentId: string): Promise<{ total: number }> {
    const { count } = await supabase
      .from("vector_memories")
      .select("id", { count: "exact", head: true })
      .eq("agent_id", agentId);
    return { total: count || 0 };
  }
}
