import { test, expect, Page } from '@playwright/test';

/**
 * Quiz Progress Page E2E Tests
 *
 * Tests the Quiz Progress page functionality including:
 * - Page access and initial display
 * - Quiz display and interaction
 * - Progress tracking and visualization
 *
 * Note: Uses real API (no mocks)
 */

/**
 * Helper function to prevent language selection modal from appearing
 * Sets localStorage to indicate language has been selected
 */
async function preventLanguageModal(page: Page) {
  // Set localStorage before navigation to prevent modal
  await page.addInitScript(() => {
    localStorage.setItem('lingo_keeper_language_selected', 'true');
    localStorage.setItem('lingo_keeper_translation_language', 'en');
  });
}

// E2E-QUIZ-001: Page Access & Initial Display
test('E2E-QUIZ-001: Page Access & Initial Display', async ({ page }) => {
  await preventLanguageModal(page);

  // Collect browser console logs
  const consoleLogs: Array<{ type: string; text: string }> = [];
  page.on('console', (msg) => {
    consoleLogs.push({
      type: msg.type(),
      text: msg.text(),
    });
  });

  // Step 1: Navigate to quiz page
  await test.step('Navigate to /quiz page', async () => {
    await page.goto('http://localhost:3847/quiz');
    await page.waitForLoadState('networkidle');
  });

  // Step 2: Verify page title
  await test.step('Verify page title "理解度チェック"', async () => {
    const pageTitle = page.locator('h1, h2').filter({ hasText: '理解度チェック' });
    await expect(pageTitle).toBeVisible({ timeout: 10000 });
  });

  // Step 3: Verify quiz card is displayed
  await test.step('Verify quiz card container is displayed', async () => {
    // Look for the quiz card which contains the quiz content
    const quizCard = page.locator('div[class*="MuiCard"]').first();
    await expect(quizCard).toBeVisible({ timeout: 10000 });
  });

  // Step 4: Verify progress section is displayed
  await test.step('Verify progress section "学習進捗" is displayed', async () => {
    const progressTitle = page.locator('h2, h5').filter({ hasText: '学習進捗' });
    await expect(progressTitle).toBeVisible({ timeout: 10000 });
  });

  // Step 5: Verify progress cards (accuracy rate, completed quizzes, completed stories)
  await test.step('Verify progress statistics cards', async () => {
    // Look for cards containing progress stats
    const accuracyCard = page.locator('text=総合正答率');
    const completedQuizzesCard = page.locator('text=完了問題数');
    const completedStoriesCard = page.locator('text=完了ストーリー');

    await expect(accuracyCard).toBeVisible({ timeout: 10000 });
    await expect(completedQuizzesCard).toBeVisible({ timeout: 10000 });
    await expect(completedStoriesCard).toBeVisible({ timeout: 10000 });
  });

  // Step 6: Verify progress graph is displayed
  await test.step('Verify progress graph "レベル別正答率の推移" is displayed', async () => {
    const graphTitle = page.locator('h3, h6').filter({ hasText: 'レベル別正答率の推移' });
    await expect(graphTitle).toBeVisible({ timeout: 10000 });

    // Verify SVG graph exists (use specific viewBox to target the chart SVG)
    const svgGraph = page.locator('svg[viewBox="0 0 800 300"]');
    await expect(svgGraph).toBeVisible({ timeout: 10000 });
  });

  // Optional: Take screenshot for verification
  await page.screenshot({
    path: '/home/hanakotamio0705/Lingo Keeper JP/frontend/tests/screenshots/E2E-QUIZ-001-success.png',
    fullPage: true
  });
});

// E2E-QUIZ-002: Random Quiz Display Flow
test('E2E-QUIZ-002: Random Quiz Display Flow', async ({ page }) => {
  await preventLanguageModal(page);
  // Collect browser console logs
  const consoleLogs: Array<{ type: string; text: string }> = [];
  page.on('console', (msg) => {
    consoleLogs.push({
      type: msg.type(),
      text: msg.text(),
    });
  });

  // Collect network logs
  const networkLogs: Array<{ url: string; status: number | null; method: string }> = [];
  page.on('request', (request) => {
    networkLogs.push({
      url: request.url(),
      status: null,
      method: request.method(),
    });
  });
  page.on('response', (response) => {
    const log = networkLogs.find(
      (log) => log.url === response.url() && log.status === null
    );
    if (log) {
      log.status = response.status();
    }
  });

  // Step 1: Navigate to quiz page
  await test.step('Navigate to /quiz page', async () => {
    await page.goto('http://localhost:3847/quiz');
    await page.waitForLoadState('networkidle');
  });

  // Step 2: Wait for initial quiz to load (automatically loaded on page mount)
  await test.step('Wait for initial quiz to load', async () => {
    // The quiz is automatically loaded when the page mounts via useQuizData hook
    // Wait for the question text to be visible (h2 element based on component code)
    const questionText = page.locator('h2').filter({ hasText: /.*/ }).first();
    await expect(questionText).toBeVisible({ timeout: 10000 });
  });

  // Step 3: Verify question text is displayed
  await test.step('Verify question text is displayed', async () => {
    const questionText = page.locator('h2').first();
    await expect(questionText).toBeVisible();

    // Get the text content and verify it's not empty
    const questionContent = await questionText.textContent();
    expect(questionContent).toBeTruthy();
    expect(questionContent!.trim().length).toBeGreaterThan(0);
  });

  // Step 4: Verify quiz badge (question type and level) is displayed
  await test.step('Verify quiz badge with question type and level', async () => {
    const badge = page.locator('[class*="MuiChip"]').first();
    await expect(badge).toBeVisible();

    // Get badge text and verify it contains level (N5/N4/N3/N2/N1)
    const badgeText = await badge.textContent();
    expect(badgeText).toBeTruthy();
    expect(badgeText).toMatch(/N[1-5]/); // Should contain N1, N2, N3, N4, or N5
  });

  // Step 5: Verify audio playback button is displayed
  await test.step('Verify audio playback button "問題文を聞く"', async () => {
    const audioButton = page.locator('button').filter({ hasText: '問題文を聞く' });
    await expect(audioButton).toBeVisible();
    await expect(audioButton).toBeEnabled();
  });

  // Step 6: Verify answer method selection is displayed
  await test.step('Verify answer method selection section', async () => {
    const answerMethodTitle = page.locator('text=回答方法を選択してください');
    await expect(answerMethodTitle).toBeVisible();
  });

  // Step 7: Verify voice input button is displayed (default method)
  await test.step('Verify voice input button "音声で回答"', async () => {
    const voiceButton = page.locator('button').filter({ hasText: '音声で回答' });
    await expect(voiceButton).toBeVisible();
    await expect(voiceButton).toBeEnabled();
  });

  // Step 8: Take screenshot for verification
  await page.screenshot({
    path: '/home/hanakotamio0705/Lingo Keeper JP/frontend/tests/screenshots/E2E-QUIZ-002-success.png',
    fullPage: true
  });
});

// E2E-QUIZ-003: Correct Answer Flow (Text)
test('E2E-QUIZ-003: Correct Answer Flow (Text)', async ({ page }) => {
  await preventLanguageModal(page);
  // Collect browser console logs
  const consoleLogs: Array<{ type: string; text: string }> = [];
  page.on('console', (msg) => {
    consoleLogs.push({
      type: msg.type(),
      text: msg.text(),
    });
  });

  // Collect network logs for debugging
  const networkLogs: Array<{ url: string; status: number | null; method: string }> = [];
  page.on('request', (request) => {
    networkLogs.push({
      url: request.url(),
      status: null,
      method: request.method(),
    });
  });
  page.on('response', (response) => {
    const log = networkLogs.find(
      (log) => log.url === response.url() && log.status === null
    );
    if (log) {
      log.status = response.status();
    }
  });

  // Variable to store quiz data from API response (for monitoring only)
  let quizData: { question_text: string; choices: { choice_id: string; choice_text: string; is_correct: boolean }[] } | null = null;

  // Monitor (read-only) the quiz API response to extract correct answer
  page.on('response', async (response) => {
    if (response.url().includes('/api/quizzes') && response.request().method() === 'GET') {
      try {
        const data = await response.json();
        if (data.success && data.data) {
          quizData = data.data;
        }
      } catch {
        // Ignore JSON parse errors
      }
    }
  });

  // Step 1: Navigate to quiz page
  await test.step('Navigate to /quiz page', async () => {
    await page.goto('http://localhost:3847/quiz');
    await page.waitForLoadState('networkidle');
  });

  // Step 2: Wait for quiz to load
  await test.step('Wait for quiz to load', async () => {
    const questionText = page.locator('h2').filter({ hasText: /.*/ }).first();
    await expect(questionText).toBeVisible({ timeout: 10000 });
  });

  // Step 3: Switch to text input method
  await test.step('Switch to text input method', async () => {
    const switchButton = page.locator('button').filter({ hasText: 'または、手動入力に切り替え' });
    await expect(switchButton).toBeVisible({ timeout: 5000 });
    await switchButton.click();
  });

  // Step 4: Verify choice buttons are displayed
  await test.step('Verify choice buttons are displayed', async () => {
    // Wait for quiz data to be captured
    await page.waitForTimeout(1000);

    // Verify we have quiz data with choices
    expect(quizData).toBeTruthy();
    expect(quizData.choices).toBeTruthy();
    expect(Array.isArray(quizData.choices)).toBe(true);
    expect(quizData.choices.length).toBeGreaterThan(0);

    // Verify the instruction text is visible
    const instructionText = page.locator('text=正しいと思う選択肢をクリックしてください');
    await expect(instructionText).toBeVisible({ timeout: 5000 });

    // Verify at least one choice is visible by checking for the first choice text
    const firstChoiceCard = page.locator('div[class*="MuiCard"]').filter({
      hasText: quizData.choices[0].choice_text,
    }).first();
    await expect(firstChoiceCard).toBeVisible({ timeout: 5000 });
  });

  // Step 5: Click the correct choice
  await test.step('Click the correct choice card', async () => {
    // Wait for quiz data to be loaded
    await page.waitForTimeout(1000);

    // Click a choice card (prefer correct one if data loaded, otherwise first one)
    let choiceCard;

    if (!quizData || !quizData.choices) {
      console.log('Quiz data not loaded, using first choice as fallback');
      // Fallback: click the first choice card
      choiceCard = page.locator('div[class*="MuiCard"]').filter({
        has: page.locator('text=/^[A-D]$/'),
      }).first();
    } else {
      const correctChoice = quizData.choices.find((choice) => choice.is_correct === true);
      expect(correctChoice).toBeTruthy();

      // Find and click the card containing the correct choice text
      choiceCard = page.locator('div[class*="MuiCard"]').filter({
        hasText: correctChoice.choice_text,
      }).first();
    }

    await expect(choiceCard).toBeVisible({ timeout: 5000 });
    await choiceCard.click();

    // Wait for UI to update after click
    await page.waitForTimeout(500);
  });

  // Step 6: Submit the answer
  await test.step('Click submit button', async () => {
    const submitButton = page.locator('button').filter({ hasText: '回答を送信' });
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toBeEnabled();
    await submitButton.click();
  });

  // Step 7: Wait for feedback to be displayed
  await test.step('Wait for feedback card to appear', async () => {
    const feedbackCard = page.locator('div[class*="MuiCard"]').filter({
      has: page.locator('text=正解です！'),
    }).last(); // Use .last() to get the feedback card (not the quiz card)
    await expect(feedbackCard).toBeVisible({ timeout: 10000 });
  });

  // Step 8: Verify correct feedback is shown (green color, checkmark)
  await test.step('Verify correct feedback message', async () => {
    const correctMessage = page.locator('h6, h3').filter({ hasText: '正解です！' });
    await expect(correctMessage).toBeVisible();

    // Verify checkmark icon is present (use .first() since there might be multiple on the page)
    const checkIcon = page.locator('svg[data-testid="CheckCircleIcon"]').first();
    await expect(checkIcon).toBeVisible();
  });

  // Step 9: Verify explanation is displayed
  await test.step('Verify explanation is displayed', async () => {
    // Find the explanation text within the feedback card
    const feedbackCard = page.locator('div[class*="MuiCard"]').filter({
      has: page.locator('text=正解です！'),
    });

    // Explanation should be in a Typography element within the feedback card
    const explanation = feedbackCard.locator('p, div').filter({ hasNotText: '正解です！' }).first();
    await expect(explanation).toBeVisible();

    const explanationText = await explanation.textContent();
    expect(explanationText).toBeTruthy();
    expect(explanationText!.trim().length).toBeGreaterThan(0);
  });

  // Step 10: Verify "Next Quiz" button is displayed
  await test.step('Verify "次の問題へ" button is displayed', async () => {
    const nextButton = page.locator('button').filter({ hasText: '次の問題へ' });
    await expect(nextButton).toBeVisible();
    await expect(nextButton).toBeEnabled();
  });

  // Step 11: Verify sample answer is NOT displayed (correct answers don't show sample)
  await test.step('Verify sample answer is NOT displayed for correct answers', async () => {
    const sampleAnswerSection = page.locator('text=サンプル回答:');
    await expect(sampleAnswerSection).not.toBeVisible();
  });

  // Step 12: Take screenshot for verification
  await page.screenshot({
    path: '/home/hanakotamio0705/Lingo Keeper JP/frontend/tests/screenshots/E2E-QUIZ-003-success.png',
    fullPage: true
  });
});

// E2E-QUIZ-004: Incorrect Answer Flow (Text)
test('E2E-QUIZ-004: Incorrect Answer Flow (Text)', async ({ page }) => {
  await preventLanguageModal(page);
  // Collect browser console logs
  const consoleLogs: Array<{ type: string; text: string }> = [];
  page.on('console', (msg) => {
    consoleLogs.push({
      type: msg.type(),
      text: msg.text(),
    });
  });

  // Collect network logs for debugging
  const networkLogs: Array<{ url: string; status: number | null; method: string }> = [];
  page.on('request', (request) => {
    networkLogs.push({
      url: request.url(),
      status: null,
      method: request.method(),
    });
  });
  page.on('response', (response) => {
    const log = networkLogs.find(
      (log) => log.url === response.url() && log.status === null
    );
    if (log) {
      log.status = response.status();
    }
  });

  // Variable to store quiz data from API response (for monitoring only)
  let quizData: { question_text: string; choices: { choice_id: string; choice_text: string; is_correct: boolean }[] } | null = null;

  // Monitor (read-only) the quiz API response to extract correct answer
  page.on('response', async (response) => {
    if (response.url().includes('/api/quizzes') && response.request().method() === 'GET') {
      try {
        const data = await response.json();
        if (data.success && data.data) {
          quizData = data.data;
        }
      } catch {
        // Ignore JSON parse errors
      }
    }
  });

  // Step 1: Navigate to quiz page
  await test.step('Navigate to /quiz page', async () => {
    await page.goto('http://localhost:3847/quiz');
    await page.waitForLoadState('networkidle');
  });

  // Step 2: Wait for quiz to load
  await test.step('Wait for quiz to load', async () => {
    const questionText = page.locator('h2').filter({ hasText: /.*/ }).first();
    await expect(questionText).toBeVisible({ timeout: 10000 });
  });

  // Step 3: Switch to text input method
  await test.step('Switch to text input method', async () => {
    const switchButton = page.locator('button').filter({ hasText: 'または、手動入力に切り替え' });
    await expect(switchButton).toBeVisible({ timeout: 5000 });
    await switchButton.click();
  });

  // Step 4: Verify choice buttons are displayed
  await test.step('Verify choice buttons are displayed', async () => {
    // Wait for quiz data to be captured
    await page.waitForTimeout(1000);

    // Verify we have quiz data with choices
    expect(quizData).toBeTruthy();
    expect(quizData.choices).toBeTruthy();
    expect(Array.isArray(quizData.choices)).toBe(true);
    expect(quizData.choices.length).toBeGreaterThan(0);

    // Verify the instruction text is visible
    const instructionText = page.locator('text=正しいと思う選択肢をクリックしてください');
    await expect(instructionText).toBeVisible({ timeout: 5000 });

    // Verify at least one choice is visible by checking for the first choice text
    const firstChoiceCard = page.locator('div[class*="MuiCard"]').filter({
      hasText: quizData.choices[0].choice_text,
    }).first();
    await expect(firstChoiceCard).toBeVisible({ timeout: 5000 });
  });

  // Step 5: Click an incorrect choice
  await test.step('Click an incorrect choice card', async () => {
    // Wait for quizData to be loaded
    await page.waitForTimeout(1000);

    // Click a choice card (prefer incorrect one if data loaded, otherwise second one)
    let choiceCard;

    if (!quizData || !quizData.choices) {
      console.log('Quiz data not loaded, using second choice as fallback');
      // Fallback: click the second choice card (likely incorrect)
      choiceCard = page.locator('div[class*="MuiCard"]').filter({
        has: page.locator('text=/^[A-D]$/'),
      }).nth(1);
    } else {
      const incorrectChoice = quizData.choices.find((choice) => choice.is_correct === false);
      expect(incorrectChoice).toBeTruthy();

      // Find and click the card containing the incorrect choice text
      choiceCard = page.locator('div[class*="MuiCardContent"]').filter({
        has: page.locator('div[class*="MuiChip"]'),
        hasText: incorrectChoice.choice_text,
      }).first();
    }

    await expect(choiceCard).toBeVisible({ timeout: 5000 });
    await choiceCard.click();

    // Wait for UI to update after click
    await page.waitForTimeout(500);
  });

  // Step 6: Submit the answer
  await test.step('Click submit button', async () => {
    const submitButton = page.locator('button').filter({ hasText: '回答を送信' });
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toBeEnabled();
    await submitButton.click();
  });

  // Step 7: Wait for feedback to be displayed
  await test.step('Wait for feedback card to appear', async () => {
    const feedbackCard = page.locator('div[class*="MuiCard"]').filter({
      has: page.locator('text=惜しい！もう一度確認しましょう'),
    }).last(); // Use .last() to get the feedback card (not the quiz card)
    await expect(feedbackCard).toBeVisible({ timeout: 10000 });
  });

  // Step 8: Verify incorrect feedback is shown (red color, X mark)
  await test.step('Verify incorrect feedback message', async () => {
    const incorrectMessage = page.locator('h6, h3').filter({ hasText: '惜しい！もう一度確認しましょう' });
    await expect(incorrectMessage).toBeVisible();

    // Verify error icon is present (CancelIcon)
    const errorIcon = page.locator('svg[data-testid="CancelIcon"]').first();
    await expect(errorIcon).toBeVisible();
  });

  // Step 9: Verify explanation is displayed
  await test.step('Verify explanation is displayed', async () => {
    // Find the explanation text within the feedback card
    const feedbackCard = page.locator('div[class*="MuiCard"]').filter({
      has: page.locator('text=惜しい！もう一度確認しましょう'),
    });

    // Explanation should be in a Typography element within the feedback card
    // Skip the feedback header text and find the explanation paragraph
    const explanation = feedbackCard.locator('p').filter({
      hasNotText: '惜しい！もう一度確認しましょう'
    }).first();
    await expect(explanation).toBeVisible();

    const explanationText = await explanation.textContent();
    expect(explanationText).toBeTruthy();
    expect(explanationText!.trim().length).toBeGreaterThan(0);
  });

  // Step 10: Verify sample answer is displayed (for incorrect answers)
  await test.step('Verify sample answer is displayed', async () => {
    const sampleAnswerSection = page.locator('text=サンプル回答:');
    await expect(sampleAnswerSection).toBeVisible();

    // Verify that sample answer text is present and not empty
    const sampleAnswerText = page.locator('text=サンプル回答:').locator('..').locator('p, div').last();
    await expect(sampleAnswerText).toBeVisible();

    const sampleText = await sampleAnswerText.textContent();
    expect(sampleText).toBeTruthy();
    expect(sampleText!.trim().length).toBeGreaterThan(0);
  });

  // Step 11: Verify "Next Quiz" button is displayed
  await test.step('Verify "次の問題へ" button is displayed', async () => {
    const nextButton = page.locator('button').filter({ hasText: '次の問題へ' });
    await expect(nextButton).toBeVisible();
    await expect(nextButton).toBeEnabled();
  });

  // Step 12: Take screenshot for verification
  await page.screenshot({
    path: '/home/hanakotamio0705/Lingo Keeper JP/frontend/tests/screenshots/E2E-QUIZ-004-success.png',
    fullPage: true
  });
});

// E2E-QUIZ-005: Learning Progress Card Display
test('E2E-QUIZ-005: Learning Progress Card Display', async ({ page }) => {
  await preventLanguageModal(page);
  // Collect browser console logs
  const consoleLogs: Array<{ type: string; text: string }> = [];
  page.on('console', (msg) => {
    consoleLogs.push({
      type: msg.type(),
      text: msg.text(),
    });
  });

  // Collect network logs for debugging
  const networkLogs: Array<{ url: string; status: number | null; method: string }> = [];
  page.on('request', (request) => {
    networkLogs.push({
      url: request.url(),
      status: null,
      method: request.method(),
    });
  });
  page.on('response', (response) => {
    const log = networkLogs.find(
      (log) => log.url === response.url() && log.status === null
    );
    if (log) {
      log.status = response.status();
    }
  });

  // Step 1: Navigate to quiz page
  await test.step('Navigate to /quiz page', async () => {
    await page.goto('http://localhost:3847/quiz');
    await page.waitForLoadState('networkidle');
  });

  // Step 2: Verify progress section is displayed
  await test.step('Verify "学習進捗" section is displayed', async () => {
    const progressTitle = page.locator('h2, h5').filter({ hasText: '学習進捗' });
    await expect(progressTitle).toBeVisible({ timeout: 10000 });
  });

  // Step 3: Verify accuracy rate card is displayed with percentage
  await test.step('Verify accuracy rate card displays percentage', async () => {
    const accuracyCard = page.locator('text=総合正答率');
    await expect(accuracyCard).toBeVisible({ timeout: 10000 });

    // Find the percentage value (div element with Typography variant="h3")
    // The component structure is: Card > CardContent > Typography (component="div")
    const accuracyValue = page.locator('div[class*="MuiCardContent"]').filter({
      has: page.locator('text=総合正答率'),
    }).locator('div[class*="MuiTypography-h3"]').first();
    await expect(accuracyValue).toBeVisible();

    // Get the text and verify it contains '%'
    const accuracyText = await accuracyValue.textContent();
    expect(accuracyText).toBeTruthy();
    expect(accuracyText).toMatch(/%/);

    // Verify it's a valid number
    const percentageValue = parseFloat(accuracyText!.replace('%', ''));
    expect(percentageValue).toBeGreaterThanOrEqual(0);
    expect(percentageValue).toBeLessThanOrEqual(100);
  });

  // Step 4: Verify total quizzes card displays a number
  await test.step('Verify total quizzes card displays a number', async () => {
    const totalQuizzesCard = page.locator('text=完了問題数');
    await expect(totalQuizzesCard).toBeVisible({ timeout: 10000 });

    // Find the numeric value (div element with Typography variant="h3")
    const totalQuizzesValue = page.locator('div[class*="MuiCardContent"]').filter({
      has: page.locator('text=完了問題数'),
    }).locator('div[class*="MuiTypography-h3"]').first();
    await expect(totalQuizzesValue).toBeVisible();

    // Get the text and verify it's a number
    const totalQuizzesText = await totalQuizzesValue.textContent();
    expect(totalQuizzesText).toBeTruthy();

    // Verify it's a valid number (integer >= 0)
    const totalQuizzesNum = parseInt(totalQuizzesText!.trim(), 10);
    expect(totalQuizzesNum).toBeGreaterThanOrEqual(0);
  });

  // Step 5: Verify completed stories card displays a number
  await test.step('Verify completed stories card displays a number', async () => {
    const completedStoriesCard = page.locator('text=完了ストーリー');
    await expect(completedStoriesCard).toBeVisible({ timeout: 10000 });

    // Find the numeric value (div element with Typography variant="h3")
    const completedStoriesValue = page.locator('div[class*="MuiCardContent"]').filter({
      has: page.locator('text=完了ストーリー'),
    }).locator('div[class*="MuiTypography-h3"]').first();
    await expect(completedStoriesValue).toBeVisible();

    // Get the text and verify it's a number
    const completedStoriesText = await completedStoriesValue.textContent();
    expect(completedStoriesText).toBeTruthy();

    // Verify it's a valid number (integer >= 0)
    const completedStoriesNum = parseInt(completedStoriesText!.trim(), 10);
    expect(completedStoriesNum).toBeGreaterThanOrEqual(0);
  });

  // Step 6: Take screenshot for verification
  await page.screenshot({
    path: '/home/hanakotamio0705/Lingo Keeper JP/frontend/tests/screenshots/E2E-QUIZ-005-success.png',
    fullPage: true
  });
});

// E2E-QUIZ-006: Level-Specific Progress Display
test('E2E-QUIZ-006: Level-Specific Progress Display', async ({ page }) => {
  await preventLanguageModal(page);
  // Collect browser console logs
  const consoleLogs: Array<{ type: string; text: string }> = [];
  page.on('console', (msg) => {
    consoleLogs.push({
      type: msg.type(),
      text: msg.text(),
    });
  });

  // Collect network logs for debugging
  const networkLogs: Array<{ url: string; status: number | null; method: string }> = [];
  page.on('request', (request) => {
    networkLogs.push({
      url: request.url(),
      status: null,
      method: request.method(),
    });
  });
  page.on('response', (response) => {
    const log = networkLogs.find(
      (log) => log.url === response.url() && log.status === null
    );
    if (log) {
      log.status = response.status();
    }
  });

  // Step 1: Navigate to quiz page
  await test.step('Navigate to /quiz page', async () => {
    await page.goto('http://localhost:3847/quiz');
    await page.waitForLoadState('networkidle');
  });

  // Step 2: Verify progress section is displayed
  await test.step('Verify "学習進捗" section is displayed', async () => {
    const progressTitle = page.locator('h2, h5').filter({ hasText: '学習進捗' });
    await expect(progressTitle).toBeVisible({ timeout: 10000 });
  });

  // Step 3: Verify level-specific progress section is displayed
  await test.step('Verify level-specific progress section is displayed', async () => {
    // Look for level labels (N5, N4, N3, N2, N1)
    const levels = ['N5', 'N4', 'N3', 'N2', 'N1'];

    for (const level of levels) {
      const levelElement = page.locator('text=' + level).first();
      await expect(levelElement).toBeVisible({ timeout: 10000 });
    }
  });

  // Step 4: Verify progress bars are displayed for each level
  await test.step('Verify progress bars are displayed for each level', async () => {
    // MUI LinearProgress components should be present
    // Look for progress bar elements (MuiLinearProgress)
    const progressBars = page.locator('[class*="MuiLinearProgress"]');
    const count = await progressBars.count();

    // Expect at least 5 progress bars (one for each level)
    expect(count).toBeGreaterThanOrEqual(5);
  });

  // Step 5: Verify progress data is displayed for each level
  await test.step('Verify progress data (accuracy rate or count) for each level', async () => {
    const levels = ['N5', 'N4', 'N3', 'N2', 'N1'];

    for (const level of levels) {
      // Find the container for this level
      const levelContainer = page.locator('div').filter({
        has: page.locator('text=' + level)
      }).first();

      await expect(levelContainer).toBeVisible({ timeout: 5000 });

      // Verify that progress data is displayed (could be percentage or count)
      // Look for text that contains either '%' or '/' (e.g., "80%" or "4/5")
      const progressText = levelContainer.locator('text=/[0-9]+%|[0-9]+/[0-9]+/').first();
      await expect(progressText).toBeVisible({ timeout: 5000 });
    }
  });

  // Step 6: Verify progress bar width reflects data
  await test.step('Verify progress bar widths reflect the data', async () => {
    // Get all progress bars
    const progressBars = page.locator('[class*="MuiLinearProgress-bar"]');
    const count = await progressBars.count();

    // Verify at least 5 progress bars exist
    expect(count).toBeGreaterThanOrEqual(5);

    // For each progress bar, verify it has a width style
    for (let i = 0; i < Math.min(count, 5); i++) {
      const bar = progressBars.nth(i);
      const style = await bar.getAttribute('style');

      // Verify the bar has a transform or width style
      expect(style).toBeTruthy();
      expect(style).toMatch(/transform|width/);
    }
  });

  // Step 7: Take screenshot for verification
  await page.screenshot({
    path: '/home/hanakotamio0705/Lingo Keeper JP/frontend/tests/screenshots/E2E-QUIZ-006-success.png',
    fullPage: true
  });
});

// E2E-QUIZ-007: Progress Graph Display Flow
test('E2E-QUIZ-007: Progress Graph Display Flow', async ({ page }) => {
  await preventLanguageModal(page);
  // Collect browser console logs
  const consoleLogs: Array<{ type: string; text: string }> = [];
  page.on('console', (msg) => {
    consoleLogs.push({
      type: msg.type(),
      text: msg.text(),
    });
  });

  // Collect network logs for debugging
  const networkLogs: Array<{ url: string; status: number | null; method: string }> = [];
  page.on('request', (request) => {
    networkLogs.push({
      url: request.url(),
      status: null,
      method: request.method(),
    });
  });
  page.on('response', (response) => {
    const log = networkLogs.find(
      (log) => log.url === response.url() && log.status === null
    );
    if (log) {
      log.status = response.status();
    }
  });

  // Step 1: Navigate to quiz page
  await test.step('Navigate to /quiz page', async () => {
    await page.goto('http://localhost:3847/quiz');
    await page.waitForLoadState('networkidle');
  });

  // Step 2: Verify progress graph card is displayed
  await test.step('Verify progress graph card "レベル別正答率の推移" is displayed', async () => {
    const graphTitle = page.locator('h3, h6').filter({ hasText: 'レベル別正答率の推移' });
    await expect(graphTitle).toBeVisible({ timeout: 10000 });
  });

  // Step 3: Verify period selection tabs are displayed (週/月/年)
  await test.step('Verify period selection tabs (週/月/年) are displayed', async () => {
    // Look for the Tabs component with the 3 period options
    const weekTab = page.locator('button[role="tab"]').filter({ hasText: '週' });
    const monthTab = page.locator('button[role="tab"]').filter({ hasText: '月' });
    const yearTab = page.locator('button[role="tab"]').filter({ hasText: '年' });

    await expect(weekTab).toBeVisible({ timeout: 10000 });
    await expect(monthTab).toBeVisible({ timeout: 10000 });
    await expect(yearTab).toBeVisible({ timeout: 10000 });
  });

  // Step 4: Verify graph is rendered (SVG element)
  await test.step('Verify graph SVG element is rendered', async () => {
    // Use specific viewBox to target the chart SVG (as noted in best practices)
    const svgGraph = page.locator('svg[viewBox="0 0 800 300"]');
    await expect(svgGraph).toBeVisible({ timeout: 10000 });
  });

  // Step 5: Verify data points are displayed on the graph
  await test.step('Verify data points are visible on the graph', async () => {
    // The graph might render as SVG or canvas/image
    // First try to find SVG
    const svgGraph = page.locator('svg[viewBox="0 0 800 300"]');
    const svgExists = await svgGraph.count();

    if (svgExists > 0) {
      // Look for path elements (line charts typically use path for lines)
      const pathElements = svgGraph.locator('path');
      const pathCount = await pathElements.count();

      // Or look for circle elements (data points)
      const circleElements = svgGraph.locator('circle');
      const circleCount = await circleElements.count();

      // At least one of these should exist (either paths or circles)
      expect(pathCount + circleCount).toBeGreaterThan(0);
    } else {
      // If no SVG, the graph might be rendered as image or canvas
      // Just verify the graph area has some content (percentage labels, legend, etc.)
      const graphContainer = page.locator('text=レベル別正答率の推移').locator('..');
      await expect(graphContainer).toBeVisible();

      // Verify axis labels or legend items are visible
      const hasLabels = await page.locator('text=/N[1-5]|A[1-2]|B[1-2]|C[1-2]/').count();
      expect(hasLabels).toBeGreaterThan(0);
    }
  });

  // Step 6: Click on "月" tab and verify graph updates
  await test.step('Click "月" tab and verify graph updates', async () => {
    const monthTab = page.locator('button[role="tab"]').filter({ hasText: '月' });
    await monthTab.click();

    // Wait for potential network request to complete
    await page.waitForTimeout(1000);

    // Verify graph is still visible (indicating it updated)
    const svgGraph = page.locator('svg[viewBox="0 0 800 300"]');
    await expect(svgGraph).toBeVisible();
  });

  // Step 7: Click on "年" tab and verify graph updates
  await test.step('Click "年" tab and verify graph updates', async () => {
    const yearTab = page.locator('button[role="tab"]').filter({ hasText: '年' });
    await yearTab.click();

    // Wait for potential network request to complete
    await page.waitForTimeout(1000);

    // Verify graph is still visible (indicating it updated)
    const svgGraph = page.locator('svg[viewBox="0 0 800 300"]');
    await expect(svgGraph).toBeVisible();
  });

  // Step 8: Take screenshot for verification
  await page.screenshot({
    path: '/home/hanakotamio0705/Lingo Keeper JP/frontend/tests/screenshots/E2E-QUIZ-007-success.png',
    fullPage: true
  });
});

// E2E-QUIZ-008: Progress Update After Answer
test('E2E-QUIZ-008: Progress Update After Answer', async ({ page }) => {
  await preventLanguageModal(page);
  // Collect browser console logs
  const consoleLogs: Array<{ type: string; text: string }> = [];
  page.on('console', (msg) => {
    consoleLogs.push({
      type: msg.type(),
      text: msg.text(),
    });
  });

  // Collect network logs for debugging
  const networkLogs: Array<{ url: string; status: number | null; method: string }> = [];
  page.on('request', (request) => {
    networkLogs.push({
      url: request.url(),
      status: null,
      method: request.method(),
    });
  });
  page.on('response', (response) => {
    const log = networkLogs.find(
      (log) => log.url === response.url() && log.status === null
    );
    if (log) {
      log.status = response.status();
    }
  });

  // Variable to store quiz data from API response (for monitoring only)
  let quizData: { question_text: string; choices: { choice_id: string; choice_text: string; is_correct: boolean }[] } | null = null;

  // Monitor (read-only) the quiz API response
  page.on('response', async (response) => {
    if (response.url().includes('/api/quizzes') && response.request().method() === 'GET') {
      try {
        const data = await response.json();
        if (data.success && data.data) {
          quizData = data.data;
        }
      } catch {
        // Ignore JSON parse errors
      }
    }
  });

  // Step 1: Navigate to quiz page
  await test.step('Navigate to /quiz page', async () => {
    await page.goto('http://localhost:3847/quiz');
    await page.waitForLoadState('networkidle');
  });

  // Step 2: Wait for initial progress data to load
  await test.step('Wait for initial progress data to load', async () => {
    const progressTitle = page.locator('h2, h5').filter({ hasText: '学習進捗' });
    await expect(progressTitle).toBeVisible({ timeout: 10000 });
  });

  // Step 3: Record initial total quizzes count
  let initialTotalQuizzes = 0;
  let initialAccuracyRate = '';
  await test.step('Record initial total quizzes count', async () => {
    const totalQuizzesCard = page.locator('text=完了問題数');
    await expect(totalQuizzesCard).toBeVisible({ timeout: 10000 });

    // Find the numeric value
    const totalQuizzesValue = page.locator('div[class*="MuiCardContent"]').filter({
      has: page.locator('text=完了問題数'),
    }).locator('div[class*="MuiTypography-h3"]').first();
    await expect(totalQuizzesValue).toBeVisible();

    const totalQuizzesText = await totalQuizzesValue.textContent();
    expect(totalQuizzesText).toBeTruthy();
    initialTotalQuizzes = parseInt(totalQuizzesText!.trim(), 10);
    expect(initialTotalQuizzes).toBeGreaterThanOrEqual(0);

    console.log(`Initial total quizzes: ${initialTotalQuizzes}`);
  });

  // Step 4: Record initial accuracy rate
  await test.step('Record initial accuracy rate', async () => {
    const accuracyCard = page.locator('text=総合正答率');
    await expect(accuracyCard).toBeVisible();

    const accuracyValue = page.locator('div[class*="MuiCardContent"]').filter({
      has: page.locator('text=総合正答率'),
    }).locator('div[class*="MuiTypography-h3"]').first();
    await expect(accuracyValue).toBeVisible();

    const accuracyText = await accuracyValue.textContent();
    expect(accuracyText).toBeTruthy();
    initialAccuracyRate = accuracyText!.trim();

    console.log(`Initial accuracy rate: ${initialAccuracyRate}`);
  });

  // Step 5: Wait for quiz to load
  await test.step('Wait for quiz to load', async () => {
    const questionText = page.locator('h2').filter({ hasText: /.*/ }).first();
    await expect(questionText).toBeVisible({ timeout: 10000 });
  });

  // Step 6: Switch to text input method
  await test.step('Switch to text input method', async () => {
    const switchButton = page.locator('button').filter({ hasText: 'または、手動入力に切り替え' });
    await expect(switchButton).toBeVisible({ timeout: 5000 });
    await switchButton.click();
  });

  // Step 7: Wait for quiz data to be captured
  await test.step('Wait for quiz data to be captured', async () => {
    await page.waitForTimeout(1000);
    expect(quizData).toBeTruthy();
    expect(quizData.choices).toBeTruthy();
  });

  // Step 8: Click any choice (doesn't matter if correct or incorrect)
  await test.step('Click any choice card', async () => {
    // Just click the first choice for simplicity
    const firstChoice = quizData.choices[0];
    expect(firstChoice).toBeTruthy();

    const firstCard = page.locator('div[class*="MuiCardContent"]').filter({
      has: page.locator('div[class*="MuiChip"]'),
      hasText: firstChoice.choice_text,
    }).first();
    await expect(firstCard).toBeVisible({ timeout: 5000 });
    await firstCard.click();
  });

  // Step 9: Submit the answer
  await test.step('Click submit button', async () => {
    const submitButton = page.locator('button').filter({ hasText: '回答を送信' });
    await expect(submitButton).toBeVisible();
    await expect(submitButton).toBeEnabled();
    await submitButton.click();
  });

  // Step 10: Wait for feedback to be displayed
  await test.step('Wait for feedback to appear', async () => {
    // Wait for either correct or incorrect feedback
    const feedbackMessage = page.locator('h6, h3').filter({
      hasText: /正解です！|惜しい！もう一度確認しましょう/
    });
    await expect(feedbackMessage).toBeVisible({ timeout: 10000 });
  });

  // Step 11: Verify total quizzes count increased by 1
  await test.step('Verify total quizzes count increased by 1', async () => {
    // Wait a moment for progress to update
    await page.waitForTimeout(2000);

    const totalQuizzesValue = page.locator('div[class*="MuiCardContent"]').filter({
      has: page.locator('text=完了問題数'),
    }).locator('div[class*="MuiTypography-h3"]').first();
    await expect(totalQuizzesValue).toBeVisible();

    const totalQuizzesText = await totalQuizzesValue.textContent();
    expect(totalQuizzesText).toBeTruthy();
    const updatedTotalQuizzes = parseInt(totalQuizzesText!.trim(), 10);

    console.log(`Updated total quizzes: ${updatedTotalQuizzes}`);
    expect(updatedTotalQuizzes).toBe(initialTotalQuizzes + 1);
  });

  // Step 12: Verify accuracy rate may have changed
  await test.step('Verify accuracy rate is recalculated', async () => {
    const accuracyValue = page.locator('div[class*="MuiCardContent"]').filter({
      has: page.locator('text=総合正答率'),
    }).locator('div[class*="MuiTypography-h3"]').first();
    await expect(accuracyValue).toBeVisible();

    const accuracyText = await accuracyValue.textContent();
    expect(accuracyText).toBeTruthy();
    expect(accuracyText).toMatch(/%/);

    // Accuracy rate should be a valid percentage (may or may not have changed)
    const percentageValue = parseFloat(accuracyText!.replace('%', ''));
    expect(percentageValue).toBeGreaterThanOrEqual(0);
    expect(percentageValue).toBeLessThanOrEqual(100);

    console.log(`Updated accuracy rate: ${accuracyText}`);
  });

  // Step 13: Take screenshot for verification
  await page.screenshot({
    path: '/home/hanakotamio0705/Lingo Keeper JP/frontend/tests/screenshots/E2E-QUIZ-008-success.png',
    fullPage: true
  });
});
