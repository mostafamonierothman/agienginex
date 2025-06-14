import { supabase } from '@/integrations/supabase/client';

export interface PersistenceBackend {
  saveState(key: string, state: any): Promise<void>;
  loadState(key: string): Promise<any>;
  deleteState(key: string): Promise<void>;
}

export class LocalStorageBackend implements PersistenceBackend {
  async saveState(key: string, state: any): Promise<void> {
    localStorage.setItem(key, JSON.stringify(state));
  }

  async loadState(key: string): Promise<any> {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  }

  async deleteState(key: string): Promise<void> {
    localStorage.removeItem(key);
  }
}

export class SupabaseBackend implements PersistenceBackend {
  private baseUrl: string;

  constructor(projectUrl: string) {
    this.baseUrl = projectUrl;
  }

  async saveState(key: string, state: any): Promise<void> {
    const response = await fetch(`${this.baseUrl}/rest/v1/agi_state`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates',
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhudWRpbmZlam93b3hseWJpZnFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg3OTgzNTYsImV4cCI6MjA1NDM3NDM1Nn0.QP0Qt8WrTmnwEdn2-OaXiIo56PtdGTczBzUTPCS1DxU'
      },
      body: JSON.stringify({ 
        key, 
        state: state,
        updated_at: new Date().toISOString()
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to save state: ${response.statusText}`);
    }
  }

  async loadState(key: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/rest/v1/agi_state?key=eq.${key}`, {
      headers: {
        'Content-Type': 'application/json',
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhudWRpbmZlam93b3hseWJpZnFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg3OTgzNTYsImV4cCI6MjA1NDM3NDM1Nn0.QP0Qt8WrTmnwEdn2-OaXiIo56PtdGTczBzUTPCS1DxU'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to load state: ${response.statusText}`);
    }

    const data = await response.json();
    return data.length > 0 ? data[0].state : null;
  }

  async deleteState(key: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/rest/v1/agi_state?key=eq.${key}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhudWRpbmZlam93b3hseWJpZnFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg3OTgzNTYsImV4cCI6MjA1NDM3NDM1Nn0.QP0Qt8WrTmnwEdn2-OaXiIo56PtdGTczBzUTPCS1DxU'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to delete state: ${response.statusText}`);
    }
  }
}

export class PersistenceService {
  private backend: PersistenceBackend;
  private cache: Map<string, any> = new Map();

  constructor(backend: PersistenceBackend) {
    this.backend = backend;
  }

  async saveState(key: string, state: any): Promise<void> {
    try {
      this.cache.set(key, state);
      await this.backend.saveState(key, state);
      console.log(`[Persistence] Saved state: ${key}`);
    } catch (error) {
      console.error(`[Persistence] Failed to save ${key}:`, error);
      throw error;
    }
  }

  async loadState(key: string): Promise<any> {
    try {
      // Check cache first
      if (this.cache.has(key)) {
        return this.cache.get(key);
      }

      // Load from backend
      const state = await this.backend.loadState(key);
      if (state) {
        this.cache.set(key, state);
      }
      
      console.log(`[Persistence] Loaded state: ${key}`);
      return state;
    } catch (error) {
      console.error(`[Persistence] Failed to load ${key}:`, error);
      return null;
    }
  }

  async deleteState(key: string): Promise<void> {
    try {
      this.cache.delete(key);
      await this.backend.deleteState(key);
      console.log(`[Persistence] Deleted state: ${key}`);
    } catch (error) {
      console.error(`[Persistence] Failed to delete ${key}:`, error);
      throw error;
    }
  }

  // Auto-save functionality
  autoSave(key: string, getValue: () => any, intervalMs: number = 30000): () => void {
    const interval = setInterval(async () => {
      try {
        const currentValue = getValue();
        await this.saveState(key, currentValue);
      } catch (error) {
        console.error(`[Persistence] Auto-save failed for ${key}:`, error);
      }
    }, intervalMs);

    return () => clearInterval(interval);
  }
}

// Factory function to create persistence service
export const createPersistenceService = (type: 'local' | 'supabase', config?: any): PersistenceService => {
  let backend: PersistenceBackend;

  switch (type) {
    case 'supabase':
      backend = new SupabaseBackend(config?.projectUrl || 'https://hnudinfejowoxlybifqq.supabase.co');
      break;
    case 'local':
    default:
      backend = new LocalStorageBackend();
      break;
  }

  return new PersistenceService(backend);
};
