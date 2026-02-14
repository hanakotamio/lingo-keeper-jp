import { chromium } from 'playwright';

async function checkProduction() {
  const browser = await chromium.launch();
  const context = await browser.createContext();

  // コンソールメッセージをキャプチャ
  const consoleLogs: Array<{ type: string; message: string }> = [];
  const networkRequests: Array<{ method: string; url: string; status?: number; error?: string }> = [];
  const pageErrors: string[] = [];

  const page = await context.newPage();

  // コンソールイベントをリッスン
  page.on('console', msg => {
    consoleLogs.push({
      type: msg.type(),
      message: msg.text()
    });
  });

  // ネットワークリクエストをリッスン
  page.on('request', request => {
    networkRequests.push({
      method: request.method(),
      url: request.url()
    });
  });

  // ネットワークレスポンスをリッスン
  page.on('response', response => {
    const url = response.url();
    const status = response.status();
    const existing = networkRequests.find(r => r.url === url);
    if (existing) {
      existing.status = status;
    }
  });

  // ページエラーをリッスン
  page.on('pageerror', error => {
    pageErrors.push(error.toString());
  });

  try {
    console.log('Opening https://lingo-keeper-jp.vercel.app...');
    const response = await page.goto('https://lingo-keeper-jp.vercel.app', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    console.log('Response status:', response?.status());

    // ページの内容をスクリーンショット前に待機
    await page.waitForTimeout(3000);

    // ページの内容を確認
    const pageContent = await page.content();
    console.log('Page loaded successfully');

    // console.error や console.warn をフィルタリング
    const errors = consoleLogs.filter(log => log.type === 'error' || log.type === 'warning');
    const apiRequests = networkRequests.filter(r => r.url.includes('/api/'));

    console.log('\n=== CONSOLE LOGS (Errors/Warnings) ===');
    if (errors.length === 0) {
      console.log('No console errors or warnings');
    } else {
      errors.forEach(err => {
        const typeUpper = err.type.toUpperCase();
        console.log(`[${typeUpper}] ${err.message}`);
      });
    }

    console.log('\n=== API REQUESTS ===');
    if (apiRequests.length === 0) {
      console.log('No API requests made');
    } else {
      apiRequests.forEach(req => {
        console.log(`${req.method} ${req.url}`);
        console.log(`  Status: ${req.status || 'No response'}`);
      });
    }

    console.log('\n=== PAGE ERRORS ===');
    if (pageErrors.length === 0) {
      console.log('No page errors');
    } else {
      pageErrors.forEach(err => {
        console.log(err);
      });
    }

    // ストーリーカードの確認
    console.log('\n=== STORY CARDS CHECK ===');
    const storyCards = await page.$$('.story-card, [data-testid*="story"], article');
    console.log(`Found ${storyCards.length} potential story card elements`);

    // より詳細な確認
    const hasText = await page.locator('text=/Story|story/i').count();
    console.log(`Text containing "Story": ${hasText} elements`);

    // ページのHTMLを抽出して確認
    const bodyText = await page.locator('body').innerText();
    const hasStoryContent = bodyText.includes('Story') || bodyText.includes('story');
    console.log(`Has story content in body: ${hasStoryContent}`);

    // フロントエンドコード実行結果をチェック
    const reactRoot = await page.locator('#root').innerHTML();
    console.log(`React root is empty: ${reactRoot.length === 0}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    // 最終状態をダンプ
    console.log('\n=== NETWORK REQUESTS (All) ===');
    networkRequests.forEach(req => {
      console.log(`${req.method} ${req.url} - Status: ${req.status || 'pending'}`);
    });

    await browser.close();
  }
}

checkProduction().catch(console.error);
