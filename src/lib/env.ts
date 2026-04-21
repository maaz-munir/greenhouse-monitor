export function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export function requirePublicEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required public environment variable: ${key}`);
  }
  return value;
}