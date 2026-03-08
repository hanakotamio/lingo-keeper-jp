import { test } from '@playwright/test';

test('Check production deployment', async ({ page }) => {
  console.log('=== PRODUCTION DEPLOYMENT CHECK ===');

  await page.goto('https://lingo-keeper-jp.vercel.app/login');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(3000);

  // Check what's actually rendered
  const bodyText = await page.textContent('body');
  console.log('\n1. TEXT CONTENT CHECK:');
  console.log('   - Contains "Login" (English):', bodyText?.includes('Login'));
  console.log('   - Contains "ログイン" (Japanese):', bodyText?.includes('ログイン'));
  console.log('   - Contains "Email" (English):', bodyText?.includes('Email'));
  console.log('   - Contains "メールアドレス" (Japanese):', bodyText?.includes('メールアドレス'));

  // Check document language
  const htmlLang = await page.evaluate(() => document.documentElement.lang);
  console.log('\n2. HTML LANG ATTRIBUTE:', htmlLang);

  // Check localStorage
  const storageCheck = await page.evaluate(() => {
    return {
      ui_language: localStorage.getItem('lingo_keeper_ui_language'),
      all_keys: Object.keys(localStorage)
    };
  });
  console.log('\n3. LOCALSTORAGE CHECK:', JSON.stringify(storageCheck, null, 2));

  // Check console errors
  const consoleMessages: string[] = [];
  page.on('console', msg => {
    consoleMessages.push(`${msg.type()}: ${msg.text()}`);
  });

  await page.reload();
  await page.waitForLoadState('networkidle');

  console.log('\n4. CONSOLE MESSAGES:');
  consoleMessages.forEach(msg => console.log('   ', msg));

  // Take a screenshot
  await page.screenshot({ path: 'production-check-screenshot.png', fullPage: true });
  console.log('\n5. Screenshot saved: production-check-screenshot.png');

  console.log('\n=== END CHECK ===\n');
});
