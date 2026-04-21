'use client';

import {
  getTempStatus,
  getHumidityStatus,
  getMetricColor,
  getCardBorderColor,
  getStatusText,
} from '@/lib/sensors/status';

interface SensorData {
  id: number;
  device_id: string;
  location: string;
  temperature: number;
  humidity: number;
  recorded_at: string;
}

interface SensorCardProps {
  sensor: SensorData;
}

export default function SensorCard({ sensor }: SensorCardProps) {
  const tempStatus = getTempStatus(sensor.temperature);
  const humidityStatus = getHumidityStatus(sensor.humidity);
  const borderColor = getCardBorderColor(sensor.temperature, sensor.humidity);

  return (
    <div className={`bg-white rounded-xl shadow-md border-l-4 ${borderColor} p-6`}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{sensor.device_id}</h3>
          <p className="text-sm text-gray-500 capitalize">
            {sensor.location.replace('-', ' ')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className={`${getMetricColor(tempStatus, 'bg')} rounded-lg p-4`}>
          <p className="text-xs uppercase font-medium text-gray-500 mb-1 flex items-center gap-1">
            <span>🌡️</span> Temperature
          </p>
          <p className={`text-2xl font-bold ${getMetricColor(tempStatus, 'text')}`}>
            {sensor.temperature}°C
          </p>
          <p className={`text-xs mt-1 ${getMetricColor(tempStatus, 'text')}`}>
            {getStatusText(tempStatus)}
          </p>
        </div>

        <div className={`${getMetricColor(humidityStatus, 'bg')} rounded-lg p-4`}>
          <p className="text-xs uppercase font-medium text-gray-500 mb-1 flex items-center gap-1">
            <span>💧</span> Humidity
          </p>
          <p className={`text-2xl font-bold ${getMetricColor(humidityStatus, 'text')}`}>
            {sensor.humidity}%
          </p>
          <p className={`text-xs mt-1 ${getMetricColor(humidityStatus, 'text')}`}>
            {getStatusText(humidityStatus)}
          </p>
        </div>
      </div>
    </div>
  );
}