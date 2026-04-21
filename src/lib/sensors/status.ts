export type MetricStatus = 'normal' | 'warning' | 'critical';

const THRESHOLDS = {
  temperature: {
    minOk: 18,
    maxOk: 26,
    minWarn: 15,
    maxWarn: 28,
  },
  humidity: {
    minOk: 40,
    maxOk: 70,
    minWarn: 30,
    maxWarn: 80,
  },
};

export function getTempStatus(temp: number): MetricStatus {
  const { temperature: t } = THRESHOLDS;

  if (temp >= t.minOk && temp <= t.maxOk) return 'normal';
  if (temp >= t.minWarn && temp < t.minOk) return 'warning';
  if (temp > t.maxOk && temp <= t.maxWarn) return 'warning';
  return 'critical';
}

export function getHumidityStatus(humidity: number): MetricStatus {
  const { humidity: h } = THRESHOLDS;

  if (humidity >= h.minOk && humidity <= h.maxOk) return 'normal';
  if (humidity >= h.minWarn && humidity < h.minOk) return 'warning';
  if (humidity > h.maxOk && humidity <= h.maxWarn) return 'warning';
  return 'critical';
}

export function getMetricColor(status: MetricStatus, type: 'bg' | 'text'): string {
  if (type === 'bg') {
    switch (status) {
      case 'normal':
        return 'bg-green-100';
      case 'warning':
        return 'bg-yellow-100';
      case 'critical':
        return 'bg-red-100';
    }
  }
  switch (status) {
    case 'normal':
      return 'text-green-700';
    case 'warning':
      return 'text-yellow-700';
    case 'critical':
      return 'text-red-700';
  }
}

export function getCardBorderColor(temp: number, humidity: number): string {
  const tempStatus = getTempStatus(temp);
  const humidityStatus = getHumidityStatus(humidity);

  if (tempStatus === 'critical' || humidityStatus === 'critical') return 'border-l-red-500';
  if (tempStatus === 'warning' || humidityStatus === 'warning') return 'border-l-yellow-500';
  return 'border-l-green-500';
}

export function getStatusText(status: MetricStatus): string {
  switch (status) {
    case 'normal':
      return '✓ Normal';
    case 'warning':
      return '⚠ Warning';
    case 'critical':
      return '✕ Critical';
  }
}