export type HealthStatus = {
  service: string;
  status: 'ok';
  timestamp: string;
  version: string;
};

export function getHealthStatus(): HealthStatus {
  return {
    service: 'api',
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version ?? '0.1.0',
  };
}

