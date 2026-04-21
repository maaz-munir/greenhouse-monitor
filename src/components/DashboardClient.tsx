'use client';

import { useState } from 'react';
import type { SensorData } from '@/lib/sensors/types';
import SensorGrid from '@/components/SensorGrid';
import TrendsView from '@/components/TrendsView';

interface DashboardClientProps {
  initialData: SensorData[];
}

type Tab = 'dashboard' | 'trends';

function getInitialTimestamp(data: SensorData[]): string {
  return data?.[0]?.recorded_at 
    ? new Date(data[0].recorded_at).toLocaleString() 
    : 'No data';
}

export default function DashboardClient({ initialData }: DashboardClientProps) {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [lastUpdated, setLastUpdated] = useState(() => getInitialTimestamp(initialData));

  const handleUpdate = (latestTimestamp: string) => {
    setLastUpdated(new Date(latestTimestamp).toLocaleString());
  };

  return (
    <main className="min-h-screen bg-green-50">
      <header className="bg-green-700 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">Greenhouse Monitor</h1>
            <nav className="flex gap-1">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 rounded-md font-medium text-sm transition-colors cursor-pointer ${
                  activeTab === 'dashboard'
                    ? 'bg-green-800'
                    : 'hover:bg-green-600'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('trends')}
                className={`px-4 py-2 rounded-md font-medium text-sm transition-colors cursor-pointer ${
                  activeTab === 'trends'
                    ? 'bg-green-800'
                    : 'hover:bg-green-600'
                }`}
              >
                Trends
              </button>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {activeTab === 'dashboard' && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold text-green-900">Current Readings</h2>
              <span className="text-sm text-green-700">
                Last updated: {lastUpdated}
              </span>
            </div>
            <SensorGrid initialData={initialData} onUpdate={handleUpdate} />
          </>
        )}

        {activeTab === 'trends' && <TrendsView />}
      </div>
    </main>
  );
}