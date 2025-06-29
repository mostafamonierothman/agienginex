
// Updated VectorMemoryService: will use SupabaseVectorMemoryService as backend
import { SupabaseVectorMemoryService } from "./SupabaseVectorMemoryService";

export interface MemoryVector {
  id: string;
  content: string;
  embedding: number[];
  metadata: {
    timestamp: Date;
    source: string;
    importance: number;
    tags: string[];
  };
}

class VectorMemoryService {
  // Store using Supabase only
  async storeMemory(agentId: string, content: string, source: string, importance: number = 0.5): Promise<void> {
    await SupabaseVectorMemoryService.storeMemory(agentId, source, content, importance);
  }

  async retrieveMemories(agentId: string, query: string, limit: number = 10): Promise<any[]> {
    return await SupabaseVectorMemoryService.retrieveMemories(agentId, query, limit);
  }

  async getMemoryStats(agentId: string) {
    return await SupabaseVectorMemoryService.getMemoryStats(agentId);
  }
}

export const vectorMemoryService = new VectorMemoryService();
