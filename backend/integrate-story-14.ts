#!/usr/bin/env tsx
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SEED_FILE = path.join(__dirname, 'prisma', 'seed.ts');
const STORY_CODE_FILE = path.join(__dirname, 'story-14-seed-code.ts');
const QUIZ_DATA_FILE = path.join(__dirname, 'story-14-quiz-data.ts');

async function main() {
  console.log('🚀 Story 14 自動統合開始...\n');

  let seedContent = fs.readFileSync(SEED_FILE, 'utf-8');
  const story14Code = fs.readFileSync(STORY_CODE_FILE, 'utf-8');
  const story14QuizData = fs.readFileSync(QUIZ_DATA_FILE, 'utf-8');

  // Story 13の後に挿入
  const story13CompletionLog = "console.log('Created Story 13: レストランでの注文 (N4/A2) with 9 chapters');";

  if (!seedContent.includes(story13CompletionLog)) {
    console.error('❌ Story 13の完了ログが見つかりません');
    process.exit(1);
  }

  if (!seedContent.includes("Story 14:")) {
    seedContent = seedContent.replace(
      story13CompletionLog,
      story13CompletionLog + '\n\n  ' + story14Code
    );
    console.log('✅ Story 14のストーリーコードを挿入しました');
  }

  // クイズ挿入
  const story13QuizPattern = /quiz_id: 'quiz-13-3',[\s\S]*?\],\s*\},/;
  const match = seedContent.match(story13QuizPattern);

  if (match && !seedContent.includes("quiz_id: 'quiz-14-1'")) {
    seedContent = seedContent.replace(
      match[0],
      match[0] + '\n    ' + story14QuizData
    );
    console.log('✅ Story 14のクイズデータを挿入しました');
  }

  // ログ更新
  seedContent = seedContent.replace(
    "console.log('Created 39 quizzes (3 per story x 13 stories) with choices');",
    "console.log('Created 42 quizzes (3 per story x 14 stories) with choices');"
  );

  // 保存
  const backupFile = SEED_FILE + '.backup-' + Date.now();
  fs.copyFileSync(SEED_FILE, backupFile);
  fs.writeFileSync(SEED_FILE, seedContent, 'utf-8');

  console.log('✅ Story 14の統合が完了しました！\n');
}

main().catch((error) => {
  console.error('❌ エラー:', error);
  process.exit(1);
});
