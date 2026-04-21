import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { TRENDS_TIME_RANGE_MS, TRENDS_MAX_DATA_POINTS } from '@/lib/config';

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();

    const oneHourAgo = new Date(Date.now() - TRENDS_TIME_RANGE_MS).toISOString();

    const { data, error } = await supabase
      .from('sensor_readings')
      .select('device_id, temperature, humidity, recorded_at')
      .gte('recorded_at', oneHourAgo)
      .order('recorded_at', { ascending: true });

    if (error) {
      console.error('History query error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ history: {} });
    }

    const historyByDevice: Record<string, Array<{ time: string; temperature: number; humidity: number }>> = {};

    const deviceIds = [...new Set(data.map(d => d.device_id))];
    
    for (const device_id of deviceIds) {
      const deviceData = data.filter(d => d.device_id === device_id);
      
      const downsample = (arr: any[], targetSize: number) => {
        if (arr.length <= targetSize) return arr;
        const step = Math.ceil(arr.length / targetSize);
        return arr.filter((_: any, i: number) => i % step === 0);
      };

      const sampled = downsample(deviceData, TRENDS_MAX_DATA_POINTS);
      
      historyByDevice[device_id] = sampled.map(row => ({
        time: new Date(row.recorded_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        temperature: row.temperature,
        humidity: Math.round(row.humidity * 10) / 10,
      }));
    }

    return NextResponse.json({ history: historyByDevice });
  } catch (error) {
    console.error('Request error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}