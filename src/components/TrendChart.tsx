'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface DataPoint {
  time: string;
  temperature: number;
  humidity: number;
}

interface TrendChartProps {
  data: DataPoint[];
  sensorId: string;
  metric: 'temperature' | 'humidity';
}

const COLOURS = {
  temperature: '#ef4444',
  humidity: '#3b82f6',
};

export default function TrendChart({ data, sensorId, metric }: TrendChartProps) {
  const chartData = data.map(d => ({
    time: d.time,
    value: metric === 'temperature' ? d.temperature : d.humidity,
  }));

  const unit = metric === 'temperature' ? '°C' : '%';
  const label = metric === 'temperature' ? 'Temperature' : 'Humidity';

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200">
      <h4 className="font-medium text-gray-700 mb-4">
        {sensorId} - {label}
      </h4>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 10 }}
              stroke="#9ca3af"
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 12 }}
              stroke="#9ca3af"
              domain={['auto', 'auto']}
              unit={unit}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '12px',
              }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={COLOURS[metric]}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}