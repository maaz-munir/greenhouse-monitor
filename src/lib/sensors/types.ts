export interface SensorData {
  id: number;
  device_id: string;
  location: string;
  temperature: number;
  humidity: number;
  recorded_at: string;
}

export interface TrendStats {
  temperature: { min: number; max: number; avg: number };
  humidity: { min: number; max: number; avg: number };
}

export interface TrendDataPoint {
  time: string;
  temperature: number;
  humidity: number;
}
