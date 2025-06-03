
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

export interface AgentMemory {
  shortTerm: MemoryVector[];
  longTerm: MemoryVector[];
  episodic: MemoryVector[];
}

class VectorMemoryService {
  private memories: Map<string, AgentMemory> = new Map();
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    // Load memories from localStorage
    const saved = localStorage.getItem('agi_vector_memories');
    if (saved) {
      const data = JSON.parse(saved);
      this.memories = new Map(Object.entries(data));
    }
    
    this.isInitialized = true;
    console.log('🧠 VECTOR MEMORY SERVICE → INITIALIZED');
  }

  async storeMemory(agentId: string, content: string, source: string, importance: number = 0.5): Promise<void> {
    await this.initialize();
    
    if (!this.memories.has(agentId)) {
      this.memories.set(agentId, {
        shortTerm: [],
        longTerm: [],
        episodic: []
      });
    }

    const memory = this.memories.get(agentId)!;
    const vector: MemoryVector = {
      id: crypto.randomUUID(),
      content,
      embedding: this.generateEmbedding(content),
      metadata: {
        timestamp: new Date(),
        source,
        importance,
        tags: this.extractTags(content)
      }
    };

    // Store in appropriate memory type based on importance
    if (importance > 0.8) {
      memory.longTerm.unshift(vector);
      memory.longTerm = memory.longTerm.slice(0, 100); // Keep latest 100
    } else if (importance > 0.5) {
      memory.episodic.unshift(vector);
      memory.episodic = memory.episodic.slice(0, 200); // Keep latest 200
    } else {
      memory.shortTerm.unshift(vector);
      memory.shortTerm = memory.shortTerm.slice(0, 50); // Keep latest 50
    }

    this.persistMemories();
    console.log(`🧠 MEMORY STORED: ${agentId} → ${content.substring(0, 50)}...`);
  }

  async retrieveMemories(agentId: string, query: string, limit: number = 10): Promise<MemoryVector[]> {
    await this.initialize();
    
    const memory = this.memories.get(agentId);
    if (!memory) return [];

    const queryEmbedding = this.generateEmbedding(query);
    const allMemories = [...memory.longTerm, ...memory.episodic, ...memory.shortTerm];
    
    // Calculate similarity scores
    const scoredMemories = allMemories.map(mem => ({
      memory: mem,
      score: this.cosineSimilarity(queryEmbedding, mem.embedding)
    }));

    // Sort by relevance and return top results
    return scoredMemories
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.memory);
  }

  private generateEmbedding(text: string): number[] {
    // Simple embedding simulation - in production, use OpenAI embeddings
    const words = text.toLowerCase().split(/\s+/);
    const embedding = new Array(384).fill(0);
    
    words.forEach((word, idx) => {
      for (let i = 0; i < word.length && i < embedding.length; i++) {
        embedding[i] += word.charCodeAt(i % word.length) * (idx + 1);
      }
    });
    
    // Normalize
    const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
    return embedding.map(val => val / (magnitude || 1));
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magnitudeA * magnitudeB || 1);
  }

  private extractTags(content: string): string[] {
    const keywords = ['opportunity', 'revenue', 'optimization', 'automation', 'strategy', 'deployment'];
    return keywords.filter(keyword => 
      content.toLowerCase().includes(keyword)
    );
  }

  private persistMemories(): void {
    const data = Object.fromEntries(this.memories.entries());
    localStorage.setItem('agi_vector_memories', JSON.stringify(data));
  }

  getMemoryStats(agentId: string): { shortTerm: number; longTerm: number; episodic: number } {
    const memory = this.memories.get(agentId);
    if (!memory) return { shortTerm: 0, longTerm: 0, episodic: 0 };
    
    return {
      shortTerm: memory.shortTerm.length,
      longTerm: memory.longTerm.length,
      episodic: memory.episodic.length
    };
  }
}

export const vectorMemoryService = new VectorMemoryService();
