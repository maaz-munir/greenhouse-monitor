import { createSupabaseServerClient } from '@/lib/supabase/server';
import { DASHBOARD_SENSOR_LIMIT } from '@/lib/config';
import DashboardClient from '@/components/DashboardClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: "Greenhouse Monitor",
};


export default async function Home() {
  const supabase = await createSupabaseServerClient();

  const { data: sensorReadings } = await supabase
    .from('sensor_readings')
    .select('*')
    .order('recorded_at', { ascending: false })
    .limit(DASHBOARD_SENSOR_LIMIT);

  return <DashboardClient initialData={sensorReadings || []} />;
}