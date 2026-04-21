import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from('sensor_readings')
      .select('device_id, temperature, humidity, recorded_at')
      .gte('recorded_at', new Date(Date.now() - 60 * 60 * 1000).toISOString());

    if (error) {
      console.error('Stats query error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ stats: {} });
    }

    const statsByDevice: Record<string, {
      temperature: { min: number; max: number; avg: number };
      humidity: { min: number; max: number; avg: number };
    }> = {};

    const grouped = data.reduce((acc, row) => {
      if (!acc[row.device_id]) {
        acc[row.device_id] = { temps: [], humidities: [] };
      }
      acc[row.device_id].temps.push(row.temperature);
      acc[row.device_id].humidities.push(row.humidity);
      return acc;
    }, {} as Record<string, { temps: number[]; humidities: number[] }>);

    for (const [device_id, values] of Object.entries(grouped)) {
      const temps = values.temps;
      const humidities = values.humidities;

      statsByDevice[device_id] = {
        temperature: {
          min: Math.min(...temps),
          max: Math.max(...temps),
          avg: Math.round((temps.reduce((a, b) => a + b, 0) / temps.length) * 10) / 10,
        },
        humidity: {
          min: Math.round(Math.min(...humidities) * 10) / 10,
          max: Math.round(Math.max(...humidities) * 10) / 10,
          avg: Math.round((humidities.reduce((a, b) => a + b, 0) / humidities.length) * 10) / 10,
        },
      };
    }

    return NextResponse.json({ stats: statsByDevice });
  } catch (error) {
    console.error('Request error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}