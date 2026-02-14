#!/usr/bin/env tsx
/**
 * Story 12 自動統合スクリプト
 *
 * このスクリプトは：
 * 1. seed.tsを読み込む
 * 2. Story 12のストーリーコードを挿入
 * 3. Story 12のクイズデータを挿入
 * 4. seed.tsを更新
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SEED_FILE = path.join(__dirname, 'prisma', 'seed.ts');
const STORY_CODE_FILE = path.join(__dirname, 'story-12-seed-code.ts');
const QUIZ_DATA_FILE = path.join(__dirname, 'story-12-quiz-data.ts');

async function main() {
  console.log('🚀 Story 12 自動統合開始...\n');

  // 1. ファイルを読み込む
  console.log('📖 ファイルを読み込んでいます...');
  let seedContent = fs.readFileSync(SEED_FILE, 'utf-8');
  const story12Code = fs.readFileSync(STORY_CODE_FILE, 'utf-8');
  const story12QuizData = fs.readFileSync(QUIZ_DATA_FILE, 'utf-8');

  // 2. Story 12のストーリーコードを挿入
  console.log('📝 Story 12のストーリーコードを挿入しています...');

  // Story 11の完了ログの後に挿入
  const story11CompletionLog = "console.log('Created Story 11: 家族の紹介 (N5/A1) with 9 chapters');";

  if (!seedContent.includes(story11CompletionLog)) {
    console.error('❌ Story 11の完了ログが見つかりません');
    process.exit(1);
  }

  // Story 12が既に存在するかチェック
  if (seedContent.includes("Story 12: 好きな食べ物")) {
    console.log('⚠️  Story 12は既に存在します。スキップします。');
  } else {
    seedContent = seedContent.replace(
      story11CompletionLog,
      story11CompletionLog + '\n\n  ' + story12Code
    );
    console.log('✅ Story 12のストーリーコードを挿入しました');
  }

  // 3. Story 12のクイズデータを挿入
  console.log('📝 Story 12のクイズデータを挿入しています...');

  // quizData配列の最後のStory 11クイズを探す
  const story11QuizPattern = /quiz_id: 'quiz-11-3',[\s\S]*?\],\s*\},/;
  const match = seedContent.match(story11QuizPattern);

  if (!match) {
    console.error('❌ Story 11のクイズが見つかりません');
    process.exit(1);
  }

  const story11QuizEnd = match[0];

  // Story 12クイズが既に存在するかチェック
  if (seedContent.includes("quiz_id: 'quiz-12-1'")) {
    console.log('⚠️  Story 12のクイズは既に存在します。スキップします。');
  } else {
    seedContent = seedContent.replace(
      story11QuizEnd,
      story11QuizEnd + '\n    ' + story12QuizData
    );
    console.log('✅ Story 12のクイズデータを挿入しました');
  }

  // 4. コンソールログを更新
  console.log('📝 コンソールログを更新しています...');
  seedContent = seedContent.replace(
    "console.log('Created 33 quizzes (3 per story x 11 stories) with choices');",
    "console.log('Created 36 quizzes (3 per story x 12 stories) with choices');"
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

  console.log('\n🎉 Story 12の統合が完了しました！\n');
  console.log('次のステップ:');
  console.log('1. データベースをリセットしてseedを実行:');
  console.log('   cd backend && npx prisma db push --force-reset && npx prisma db seed');
  console.log('2. Story 12を確認:');
  console.log('   npx tsx check-story-12.ts');
  console.log('3. Phase 1完了確認:');
  console.log('   - N5ストーリーが4個（Story 3, 10, 11, 12）になっているか確認');
}

main().catch((error) => {
  console.error('❌ エラーが発生しました:', error);
  process.exit(1);
});
