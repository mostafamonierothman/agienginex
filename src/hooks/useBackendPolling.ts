
import { useState, useEffect, useCallback } from 'react';
import { fastAPIService } from '@/services/FastAPIService';

export interface BackendData {
  nextMove: string;
  opportunity: string;
  loopInterval: number;
  lastUpdate: Date;
}

export const useBackendPolling = (isActive: boolean, pollInterval: number = 2000) => {
  const [backendData, setBackendData] = useState<BackendData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isPolling, setIsPolling] = useState(false);

  const fetchBackendData = useCallback(async () => {
    if (!isActive) return;

    try {
      setIsPolling(true);
      const [nextMove, opportunity, loopInterval] = await Promise.all([
        fastAPIService.getNextMove(),
        fastAPIService.getOpportunity(),
        fastAPIService.getLoopInterval()
      ]);

      setBackendData({
        nextMove,
        opportunity,
        loopInterval,
        lastUpdate: new Date()
      });
      setIsConnected(true);
    } catch (error) {
      console.log('Backend polling failed, using local simulation');
      setIsConnected(false);
    } finally {
      setIsPolling(false);
    }
  }, [isActive]);

  useEffect(() => {
    if (!isActive) return;

    // Initial fetch
    fetchBackendData();

    // Set up polling
    const interval = setInterval(fetchBackendData, pollInterval);
    return () => clearInterval(interval);
  }, [isActive, pollInterval, fetchBackendData]);

  return {
    backendData,
    isConnected,
    isPolling,
    refreshData: fetchBackendData
  };
};
