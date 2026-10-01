import { useState, useEffect, useCallback } from 'react';
import { fetchLiveRiverStations, LiveStationData, BasinOverview } from '../services/liveRiverService';

export function useLiveRiverData() {
  const [stations, setStations] = useState<LiveStationData[]>([]);
  const [basin, setBasin] = useState<BasinOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await fetchLiveRiverStations();
      setStations(data.stations);
      setBasin(data.basin);
      setError(null);
      setLastRefreshed(new Date());
    } catch (err) {
      setError('Failed to fetch real-time river data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
    // Auto-refresh live data every 2 minutes
    const interval = setInterval(loadData, 120000);
    return () => clearInterval(interval);
  }, [loadData]);

  return { stations, basin, isLoading, error, lastRefreshed, refresh: loadData };
}
