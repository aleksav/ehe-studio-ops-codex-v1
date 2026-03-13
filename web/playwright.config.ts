import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'retain-on-failure',
    video: 'on',
  },
  webServer: [
    {
      command: 'npm run dev --workspace @ehe-studio-ops/api',
      cwd: '..',
      port: 4000,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
    {
      command: 'npm run dev --workspace @ehe-studio-ops/web -- --host 127.0.0.1 --port 4173',
      cwd: '..',
      port: 4173,
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
    },
  ],
});
