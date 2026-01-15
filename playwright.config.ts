import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './frontend/tests/e2e',
  outputDir: './tests/temp',
  timeout: 60000,
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 1,
  reporter: [
    ['html', { outputFolder: './playwright-report', open: 'never' }],
    ['list']
  ],
  use: {
    baseURL: 'http://localhost:3847',
    headless: true, // 🚨 ヘッドレスモード強制
    trace: 'retain-on-failure',
    screenshot: {
      mode: 'only-on-failure',
      fullPage: true,
    },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
