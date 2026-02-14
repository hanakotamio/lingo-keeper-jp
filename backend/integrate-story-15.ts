#!/usr/bin/env tsx
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SEED_FILE = path.join(__dirname, 'prisma', 'seed.ts');
const STORY_CODE_FILE = path.join(__dirname, 'story-15-seed-code.ts');
const QUIZ_DATA_FILE = path.join(__dirname, 'story-15-quiz-data.ts');

async function main() {
  console.log('🚀 Story 15 自動統合開始...\n');

  let seedContent = fs.readFileSync(SEED_FILE, 'utf-8');
  const story15Code = fs.readFileSync(STORY_CODE_FILE, 'utf-8');
  const story15QuizData = fs.readFileSync(QUIZ_DATA_FILE, 'utf-8');

  // Story 14の後に挿入
  const story14CompletionLog = "console.log('Created Story 14: 友達との約束 (N4/A2) with 9 chapters');";

  if (!seedContent.includes(story14CompletionLog)) {
    console.error('❌ Story 14の完了ログが見つかりません');
    process.exit(1);
  }

  if (!seedContent.includes("Story 15:")) {
    seedContent = seedContent.replace(
      story14CompletionLog,
      story14CompletionLog + '\n\n  ' + story15Code
    );
    console.log('✅ Story 15のストーリーコードを挿入しました');
  } else {
    console.log('⚠️  Story 15は既に挿入されています');
  }

  // クイズ挿入
  const story14QuizPattern = /quiz_id: 'quiz-14-3',[\s\S]*?\],\s*\},/;
  const match = seedContent.match(story14QuizPattern);

  if (match && !seedContent.includes("quiz_id: 'quiz-15-1'")) {
    seedContent = seedContent.replace(
      match[0],
      match[0] + '\n    ' + story15QuizData
    );
    console.log('✅ Story 15のクイズデータを挿入しました');
  } else if (seedContent.includes("quiz_id: 'quiz-15-1'")) {
    console.log('⚠️  Story 15のクイズは既に挿入されています');
  }

  // ログ更新
  seedContent = seedContent.replace(
    "console.log('Created 42 quizzes (3 per story x 14 stories) with choices');",
    "console.log('Created 45 quizzes (3 per story x 15 stories) with choices');"
  );

  // 保存
  const backupFile = SEED_FILE + '.backup-' + Date.now();
  fs.copyFileSync(SEED_FILE, backupFile);
  fs.writeFileSync(SEED_FILE, seedContent, 'utf-8');

  console.log(`✅ バックアップ: ${path.basename(backupFile)}`);
  console.log('✅ Story 15の統合が完了しました！\n');
  console.log('📊 Phase 2完了: 15ストーリー達成！');
}

main().catch((error) => {
  console.error('❌ エラー:', error);
  process.exit(1);
});
