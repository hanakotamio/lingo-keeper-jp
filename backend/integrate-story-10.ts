#!/usr/bin/env tsx
/**
 * Story 10 自動統合スクリプト
 *
 * このスクリプトは：
 * 1. seed.tsを読み込む
 * 2. Story 10のストーリーコードを挿入
 * 3. Story 10のクイズデータを挿入
 * 4. seed.tsを更新
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SEED_FILE = path.join(__dirname, 'prisma', 'seed.ts');
const STORY_CODE_FILE = path.join(__dirname, 'story-10-seed-code.ts');
const QUIZ_DATA_FILE = path.join(__dirname, 'story-10-quiz-data.ts');

async function main() {
  console.log('🚀 Story 10 自動統合開始...\n');

  // 1. ファイルを読み込む
  console.log('📖 ファイルを読み込んでいます...');
  let seedContent = fs.readFileSync(SEED_FILE, 'utf-8');
  const story10Code = fs.readFileSync(STORY_CODE_FILE, 'utf-8');
  const story10QuizData = fs.readFileSync(QUIZ_DATA_FILE, 'utf-8');

  // 2. Story 10のストーリーコードを挿入
  console.log('📝 Story 10のストーリーコードを挿入しています...');

  // Story 9の完了ログの後に挿入
  const story9CompletionLog = "console.log('Created Story 9 (ビジネス交渉) with 5 chapters and branching structure');";

  if (!seedContent.includes(story9CompletionLog)) {
    console.error('❌ Story 9の完了ログが見つかりません');
    process.exit(1);
  }

  // Story 10が既に存在するかチェック
  if (seedContent.includes("Story 10: 初めての挨拶")) {
    console.log('⚠️  Story 10は既に存在します。スキップします。');
  } else {
    seedContent = seedContent.replace(
      story9CompletionLog,
      story9CompletionLog + '\n\n  ' + story10Code
    );
    console.log('✅ Story 10のストーリーコードを挿入しました');
  }

  // 3. Story 10のクイズデータを挿入
  console.log('📝 Story 10のクイズデータを挿入しています...');

  // quizData配列の最後のStory 9クイズを探す
  const story9QuizPattern = /quiz_id: 'quiz-9-3',[\s\S]*?\],\s*\},/;
  const match = seedContent.match(story9QuizPattern);

  if (!match) {
    console.error('❌ Story 9のクイズが見つかりません');
    process.exit(1);
  }

  const story9QuizEnd = match[0];

  // Story 10クイズが既に存在するかチェック
  if (seedContent.includes("quiz_id: 'quiz-10-1'")) {
    console.log('⚠️  Story 10のクイズは既に存在します。スキップします。');
  } else {
    seedContent = seedContent.replace(
      story9QuizEnd,
      story9QuizEnd + '\n    ' + story10QuizData
    );
    console.log('✅ Story 10のクイズデータを挿入しました');
  }

  // 4. コンソールログを更新
  console.log('📝 コンソールログを更新しています...');
  seedContent = seedContent.replace(
    "console.log('Created 27 quizzes (3 per story) with choices');",
    "console.log('Created 30 quizzes (3 per story x 10 stories) with choices');"
  );
  console.log('✅ コンソールログを更新しました');

  // 5. seed.tsを保存
  console.log('💾 seed.tsを保存しています...');

  // バックアップを作成
  const backupFile = SEED_FILE + '.backup-' + Date.now();
  fs.copyFileSync(SEED_FILE, backupFile);
  console.log(`📦 バックアップ作成: ${path.basename(backupFile)}`);

  // 新しいseed.tsを保存
  fs.writeFileSync(SEED_FILE, seedContent, 'utf-8');
  console.log('✅ seed.tsを保存しました');

  console.log('\n🎉 Story 10の統合が完了しました！\n');
  console.log('次のステップ:');
  console.log('1. データベースをリセットしてseedを実行:');
  console.log('   cd backend && npx prisma db push --force-reset && npx prisma db seed');
  console.log('2. Story 10を確認:');
  console.log('   npx tsx check-story-10.ts');
  console.log('3. データ整合性チェック:');
  console.log('   npx tsx check-data-integrity.ts');
}

main().catch((error) => {
  console.error('❌ エラーが発生しました:', error);
  process.exit(1);
});
