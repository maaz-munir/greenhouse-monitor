'use client';

import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase/client';
import { getTempStatus, getHumidityStatus } from '@/lib/sensors/status';
import SensorCard from './SensorCard';

interface SensorData {
  id: number;
  device_id: string;
  location: string;
  temperature: number;
  humidity: number;
  recorded_at: string;
}

interface SensorGridProps {
  initialData: SensorData[];
}

function sortByDeviceId(data: SensorData[]): SensorData[] {
  return [...data].sort((a, b) => a.device_id.localeCompare(b.device_id));
}

function computeStats(sensors: SensorData[]) {
  if (sensors.length === 0) {
    return { activeCount: 0, avgTemp: 0, avgHumidity: 0, criticalCount: 0 };
  }

  const activeCount = sensors.length;
  const avgTemp = sensors.reduce((sum, s) => sum + s.temperature, 0) / activeCount;
  const avgHumidity = sensors.reduce((sum, s) => sum + s.humidity, 0) / activeCount;
  const criticalCount = sensors.filter(
    s =>
      getTempStatus(s.temperature) === 'critical' ||
      getHumidityStatus(s.humidity) === 'critical'
  ).length;

  return {
    activeCount,
    avgTemp: Math.round(avgTemp * 10) / 10,
    avgHumidity: Math.round(avgHumidity * 10) / 10,
    criticalCount,
  };
}

export default function SensorGrid({ initialData }: SensorGridProps) {
  const [sensors, setSensors] = useState<SensorData[]>(sortByDeviceId(initialData));
  const stats = useMemo(() => computeStats(sensors), [sensors]);

  useEffect(() => {
    const fetchLatestReadings = async () => {
      const { data, error } = await supabase
        .from('sensor_readings')
        .select('*')
        .order('recorded_at', { ascending: false })
        .limit(3);

      if (!error && data) {
        setSensors(sortByDeviceId(data));
      }
    };

    fetchLatestReadings();

    const interval = setInterval(fetchLatestReadings, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-2 px-4 py-2 bg-green-100 rounded-lg">
          <span>📡</span>
          <span className="font-medium text-green-800">
            {stats.activeCount} active
          </span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
          <span className="text-gray-600">🌡️</span>
          <span className="font-medium text-gray-800">
            {stats.avgTemp}°C avg
          </span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
          <span className="text-gray-600">💧</span>
          <span className="font-medium text-gray-800">
            {stats.avgHumidity}% avg
          </span>
        </div>
        {stats.criticalCount > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 bg-red-100 rounded-lg">
            <span>⚠️</span>
            <span className="font-medium text-red-800">
              {stats.criticalCount} critical
            </span>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {sensors.map((sensor) => (
          <SensorCard key={sensor.id} sensor={sensor} />
        ))}
      </div>
    </div>
  );
}
