import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase/server';

interface IngestPayload {
  deviceId: string;
  location: string;
  temperature: number;
  humidity: number;
  timestamp: string;
}

export async function POST(request: Request) {
  try {
    const text = await request.text();
    if (!text) {
      return NextResponse.json({ error: 'Empty request body' }, { status: 400 });
    }

    let body: IngestPayload;
    try {
      body = JSON.parse(text);
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    if (!body.deviceId || !body.location || body.temperature === undefined || body.humidity === undefined || !body.timestamp) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();

    const { error } = await supabase.from('sensor_readings').insert({
      device_id: body.deviceId,
      location: body.location,
      temperature: body.temperature,
      humidity: body.humidity,
      recorded_at: body.timestamp,
    });

    if (error) {
      console.error('Insert error:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      });
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Request error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
