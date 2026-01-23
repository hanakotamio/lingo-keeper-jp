// Quiz Accuracy計算のテスト

// テストデータ: Story 1で3問中2問正解
const testResults = [
  {
    result_id: 'test-1',
    quiz_id: 'quiz-1-1',
    user_answer: 'choice-1',
    is_correct: true,
    answered_at: new Date().toISOString(),
    response_method: 'テキスト'
  },
  {
    result_id: 'test-2',
    quiz_id: 'quiz-1-2',
    user_answer: 'choice-2',
    is_correct: false,
    answered_at: new Date().toISOString(),
    response_method: 'テキスト'
  },
  {
    result_id: 'test-3',
    quiz_id: 'quiz-1-3',
    user_answer: 'choice-3',
    is_correct: true,
    answered_at: new Date().toISOString(),
    response_method: 'テキスト'
  }
];

// 計算ロジック（storage.tsから）
function getStoryQuizResults(storyId, allResults) {
  return allResults.filter(r => r.quiz_id.startsWith(`quiz-${storyId}-`));
}

function calculateStoryQuizAccuracy(storyId, allResults) {
  const results = getStoryQuizResults(storyId, allResults);
  if (results.length === 0) return 0;

  const correctCount = results.filter(r => r.is_correct).length;
  return Math.round((correctCount / results.length) * 100);
}

// テスト実行
console.log('=== Quiz Accuracy Calculation Test ===\n');

console.log('Test Results for Story 1:');
const story1Results = getStoryQuizResults('1', testResults);
console.log(`  Total results: ${story1Results.length}`);
console.log(`  Correct: ${story1Results.filter(r => r.is_correct).length}`);
console.log(`  Incorrect: ${story1Results.filter(r => !r.is_correct).length}`);
const accuracy = calculateStoryQuizAccuracy('1', testResults);
console.log(`  Calculated Accuracy: ${accuracy}%`);
console.log(`  Expected: 67% (2 correct out of 3)`);
console.log(`  ✓ Test ${accuracy === 67 ? 'PASSED' : 'FAILED'}\n`);

// 他のストーリーで結果がないことを確認
console.log('Test for Story 2 (no results):');
const story2Accuracy = calculateStoryQuizAccuracy('2', testResults);
console.log(`  Calculated Accuracy: ${story2Accuracy}%`);
console.log(`  Expected: 0%`);
console.log(`  ✓ Test ${story2Accuracy === 0 ? 'PASSED' : 'FAILED'}\n`);

// Story 10のテスト（5問中4問正解）
const story10TestResults = [
  { quiz_id: 'quiz-10-1', is_correct: true },
  { quiz_id: 'quiz-10-2', is_correct: true },
  { quiz_id: 'quiz-10-3', is_correct: false },
  { quiz_id: 'quiz-10-4', is_correct: true },
  { quiz_id: 'quiz-10-5', is_correct: true }
];
console.log('Test for Story 10 (5 quizzes, 4 correct):');
const story10Accuracy = calculateStoryQuizAccuracy('10', story10TestResults);
console.log(`  Calculated Accuracy: ${story10Accuracy}%`);
console.log(`  Expected: 80% (4 correct out of 5)`);
console.log(`  ✓ Test ${story10Accuracy === 80 ? 'PASSED' : 'FAILED'}\n`);

console.log('=== All Tests Completed ===');
