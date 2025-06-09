
export interface TrillionPathState {
  isRunning: boolean;
  startTime: string;
  lastUpdate: string;
  totalRuntime: number;
  autoRestart: boolean;
}

export class TrillionPathPersistence {
  private static readonly STORAGE_KEY = 'trillion_path_state';
  private static readonly HEARTBEAT_KEY = 'trillion_path_heartbeat';
  private static readonly HEARTBEAT_INTERVAL = 5000; // 5 seconds

  static saveState(state: TrillionPathState): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify({
        ...state,
        lastUpdate: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Failed to save Trillion Path state:', error);
    }
  }

  static loadState(): TrillionPathState | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return null;
      
      const state = JSON.parse(stored);
      
      // Check if the state is recent (within last 10 minutes)
      const lastUpdate = new Date(state.lastUpdate);
      const now = new Date();
      const timeDiff = now.getTime() - lastUpdate.getTime();
      
      if (timeDiff > 10 * 60 * 1000) { // 10 minutes
        console.log('Trillion Path state expired, resetting...');
        return null;
      }
      
      return state;
    } catch (error) {
      console.error('Failed to load Trillion Path state:', error);
      return null;
    }
  }

  static startHeartbeat(): void {
    const heartbeat = () => {
      const timestamp = new Date().toISOString();
      localStorage.setItem(this.HEARTBEAT_KEY, timestamp);
    };

    // Initial heartbeat
    heartbeat();
    
    // Setup interval
    const intervalId = setInterval(heartbeat, this.HEARTBEAT_INTERVAL);
    
    // Store interval ID for cleanup
    (window as any).trillionPathHeartbeat = intervalId;
  }

  static stopHeartbeat(): void {
    const intervalId = (window as any).trillionPathHeartbeat;
    if (intervalId) {
      clearInterval(intervalId);
      delete (window as any).trillionPathHeartbeat;
    }
    localStorage.removeItem(this.HEARTBEAT_KEY);
  }

  static getLastHeartbeat(): Date | null {
    try {
      const timestamp = localStorage.getItem(this.HEARTBEAT_KEY);
      return timestamp ? new Date(timestamp) : null;
    } catch (error) {
      return null;
    }
  }

  static isSystemAlive(): boolean {
    const lastHeartbeat = this.getLastHeartbeat();
    if (!lastHeartbeat) return false;
    
    const now = new Date();
    const timeDiff = now.getTime() - lastHeartbeat.getTime();
    
    // Consider system alive if heartbeat is within last 30 seconds
    return timeDiff < 30000;
  }

  static enableAutoRestart(): void {
    localStorage.setItem('trillion_path_auto_restart', 'true');
  }

  static disableAutoRestart(): void {
    localStorage.setItem('trillion_path_auto_restart', 'false');
  }

  static shouldAutoRestart(): boolean {
    return localStorage.getItem('trillion_path_auto_restart') === 'true';
  }

  static getRuntime(): number {
    const state = this.loadState();
    if (!state || !state.startTime) return 0;
    
    const startTime = new Date(state.startTime);
    const now = new Date();
    return now.getTime() - startTime.getTime();
  }

  static formatRuntime(milliseconds: number): string {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ${hours % 24}h ${minutes % 60}m`;
    if (hours > 0) return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  }
}
