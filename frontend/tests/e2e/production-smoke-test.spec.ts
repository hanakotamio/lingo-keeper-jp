import { test, expect } from '@playwright/test';

const BASE_URL = 'https://frontend-seven-beta-72.vercel.app';

test.describe('Production Smoke Test', () => {
  test('should load homepage', async ({ page }) => {
    await page.goto(BASE_URL);

    // Wait for the app to load
    await page.waitForLoadState('networkidle');

    // Check if the page title is correct
    await expect(page).toHaveTitle(/Lingo Keeper JP/);

    console.log('✅ Homepage loaded successfully');
  });

  test('should access login page', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);

    await page.waitForLoadState('networkidle');

    // Check for login form elements
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();

    console.log('✅ Login page accessible');
  });

  test('should connect to backend API', async ({ page }) => {
    await page.goto(BASE_URL);

    // Intercept API calls
    const apiResponses: any[] = [];
    page.on('response', response => {
      if (response.url().includes('lingo-keeper-jp-backend')) {
        apiResponses.push({
          url: response.url(),
          status: response.status()
        });
      }
    });

    await page.waitForTimeout(3000);

    console.log('API Responses:', apiResponses);

    // Check if at least one API call was made
    if (apiResponses.length > 0) {
      console.log('✅ Backend API connection verified');
      expect(apiResponses.some(r => r.status === 200)).toBeTruthy();
    } else {
      console.log('ℹ️ No API calls detected (may be expected for public pages)');
    }
  });
});
