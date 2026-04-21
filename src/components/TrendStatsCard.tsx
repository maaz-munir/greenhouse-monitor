'use client';

import type { TrendStats } from '@/lib/sensors/types';

interface TrendStatsCardProps {
  deviceId: string;
  stats: TrendStats;
}

export default function TrendStatsCard({ deviceId, stats }: TrendStatsCardProps) {
  return (
    <div className="border-2 border-green-500 bg-green-50 rounded-lg p-4">
      <h3 className="font-semibold text-lg text-gray-800 mb-4">{deviceId}</h3>
      
      <div className="mb-4">
        <p className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-1">
          <span>🌡️</span> Temperature
        </p>
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="bg-white rounded p-2 text-center">
            <p className="text-gray-500 text-xs">Min</p>
            <p className="font-medium">{stats.temperature.min}°C</p>
          </div>
          <div className="bg-white rounded p-2 text-center">
            <p className="text-gray-500 text-xs">Max</p>
            <p className="font-medium">{stats.temperature.max}°C</p>
          </div>
          <div className="bg-white rounded p-2 text-center">
            <p className="text-gray-500 text-xs">Avg</p>
            <p className="font-medium">{stats.temperature.avg}°C</p>
          </div>
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-1">
          <span>💧</span> Humidity
        </p>
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="bg-white rounded p-2 text-center">
            <p className="text-gray-500 text-xs">Min</p>
            <p className="font-medium">{stats.humidity.min}%</p>
          </div>
          <div className="bg-white rounded p-2 text-center">
            <p className="text-gray-500 text-xs">Max</p>
            <p className="font-medium">{stats.humidity.max}%</p>
          </div>
          <div className="bg-white rounded p-2 text-center">
            <p className="text-gray-500 text-xs">Avg</p>
            <p className="font-medium">{stats.humidity.avg}%</p>
          </div>
        </div>
      </div>
    </div>
  );
}