import { createSupabaseServerClient } from '@/lib/supabase/server';
import DashboardClient from '@/components/DashboardClient';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const supabase = await createSupabaseServerClient();

  const { data: sensorReadings } = await supabase
    .from('sensor_readings')
    .select('*')
    .order('recorded_at', { ascending: false })
    .limit(3);

  return <DashboardClient initialData={sensorReadings || []} />;
}