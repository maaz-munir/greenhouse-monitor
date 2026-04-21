'use client';

import { useState, useEffect } from 'react';
import TrendStatsCard from './TrendStatsCard';
import TrendChart from './TrendChart';

interface TrendStats {
  temperature: { min: number; max: number; avg: number };
  humidity: { min: number; max: number; avg: number };
}

interface DataPoint {
  time: string;
  temperature: number;
  humidity: number;
}

export default function TrendsView() {
  const [stats, setStats] = useState<Record<string, TrendStats>>({});
  const [history, setHistory] = useState<Record<string, DataPoint[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, historyRes] = await Promise.all([
          fetch('/api/trends/stats'),
          fetch('/api/trends/history'),
        ]);

        if (!statsRes.ok || !historyRes.ok) {
          throw new Error('Failed to fetch trend data');
        }

        const statsData = await statsRes.json();
        const historyData = await historyRes.json();

        setStats(statsData.stats || {});
        setHistory(historyData.history || {});
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-green-700">Loading trends...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  const sensorIds = Object.keys(stats).sort();

  if (sensorIds.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No trend data available for the last hour</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-green-900 mb-4">Last 1 Hour Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sensorIds.map(id => (
            <TrendStatsCard key={id} deviceId={id} stats={stats[id]} />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-green-900 mb-4">Temperature Trends</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sensorIds.map(id => (
            <TrendChart
              key={`${id}-temp`}
              sensorId={id}
              data={history[id] || []}
              metric="temperature"
            />
          ))}
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold text-green-900 mb-4">Humidity Trends</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {sensorIds.map(id => (
            <TrendChart
              key={`${id}-humidity`}
              sensorId={id}
              data={history[id] || []}
              metric="humidity"
            />
          ))}
        </div>
      </div>
    </div>
  );
}