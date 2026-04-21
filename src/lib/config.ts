export const POLLING_INTERVAL_MS = 6000;

export const TRENDS_TIME_RANGE_MS = 60 * 60 * 1000;

export const TRENDS_MAX_DATA_POINTS = 50;

export const DASHBOARD_SENSOR_LIMIT = 3;

export const THRESHOLDS = {
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
} as const;
