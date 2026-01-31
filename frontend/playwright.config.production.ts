import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for production environment testing
 *
 * Key differences from development config:
 * - Points to production URL (Vercel)
 * - Sequential execution (workers: 1) to minimize server load
 * - Higher timeouts for network latency
 * - More detailed logging (trace: 'on', screenshot: 'on')
 * - No webServer (production is already running)
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false, // Sequential execution for production
  forbidOnly: true,
  retries: 3, // Higher retries for network instability
  workers: 1, // Minimize load on production server
  timeout: 60000, // 60 seconds timeout
  reporter: [
    ['html', { outputFolder: 'playwright-report-production' }],
    ['json', { outputFile: 'test-results-production.json' }],
    ['list']
  ],
  use: {
    baseURL: 'https://frontend-seven-beta-72.vercel.app',
    trace: 'on', // Always record trace in production
    screenshot: 'on', // Always take screenshots
    video: 'retain-on-failure',
    navigationTimeout: 30000,
    actionTimeout: 15000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  // No webServer - production is already running
});
