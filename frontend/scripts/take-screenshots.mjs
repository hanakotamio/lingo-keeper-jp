import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'http://localhost:3847';
const SCREENSHOT_DIR = path.join(__dirname, '../tests/screenshots');

const TEST_USERS = {
  demo: {
    email: 'demo@example.com',
    password: 'demo123'
  },
  admin: {
    email: 'admin@example.com',
    password: 'admin123'
  }
};

async function takeScreenshots() {
  console.log('Starting screenshot capture...');

  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });

  const page = await context.newPage();

  try {
    // 1. Login Page Screenshot
    console.log('Capturing login page...');
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle' });
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'login-page-full.png'),
      fullPage: true
    });

    // Login form only
    const loginForm = await page.locator('form');
    await loginForm.screenshot({
      path: path.join(SCREENSHOT_DIR, 'login-form-centered.png')
    });
    console.log('✓ Login page screenshots captured');

    // 2. Login and capture Dashboard
    console.log('Logging in as demo user...');
    await page.fill('input[type="email"]', TEST_USERS.demo.email);
    await page.fill('input[type="password"]', TEST_USERS.demo.password);
    await page.click('button[type="submit"]');
    await page.waitForURL(`${BASE_URL}/`, { timeout: 10000 });
    await page.waitForLoadState('networkidle');

    // Wait a bit for the auth state to fully settle
    await page.waitForTimeout(1000);

    console.log('Capturing dashboard page...');
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'dashboard-page-full.png'),
      fullPage: true
    });

    // Sidebar screenshot
    const sidebar = page.locator('nav[aria-label="サイドバー"]');
    if (await sidebar.isVisible()) {
      await sidebar.screenshot({
        path: path.join(SCREENSHOT_DIR, 'dashboard-sidebar.png')
      });
    }
    console.log('✓ Dashboard screenshots captured');

    // 3. Stories Page
    console.log('Capturing stories page...');
    await page.click('text=ストーリー');
    await page.waitForURL(`${BASE_URL}/stories`, { timeout: 5000 });
    await page.waitForLoadState('networkidle');
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'stories-page-full.png'),
      fullPage: true
    });
    console.log('✓ Stories page screenshot captured');

    // 4. Quiz Page
    console.log('Capturing quiz page...');
    await page.click('text=クイズ');
    await page.waitForURL(`${BASE_URL}/quiz`, { timeout: 5000 });
    await page.waitForLoadState('networkidle');
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'quiz-page-full.png'),
      fullPage: true
    });
    console.log('✓ Quiz page screenshot captured');

    // 5. Profile Page
    console.log('Capturing profile page...');
    await page.click('text=プロフィール');
    await page.waitForURL(`${BASE_URL}/profile`, { timeout: 5000 });
    await page.waitForLoadState('networkidle');
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'profile-page-full.png'),
      fullPage: true
    });
    console.log('✓ Profile page screenshot captured');

    console.log('\n✅ All screenshots captured successfully!');
    console.log(`Screenshots saved to: ${SCREENSHOT_DIR}`);

  } catch (error) {
    console.error('❌ Error taking screenshots:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

// Run the script
takeScreenshots().catch((error) => {
  console.error('Failed to take screenshots:', error);
  process.exit(1);
});
