#!/usr/bin/env tsx
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SEED_FILE = path.join(__dirname, 'prisma', 'seed.ts');

async function main() {
  console.log('🚀 Story 16-18 一括統合開始...\n');

  let seedContent = fs.readFileSync(SEED_FILE, 'utf-8');

  // Story 15の後に挿入
  const story15CompletionLog = "console.log('Created Story 15: 週末の計画 (N4/A2) with 9 chapters');";

  if (!seedContent.includes(story15CompletionLog)) {
    console.error('❌ Story 15の完了ログが見つかりません');
    process.exit(1);
  }

  // Story 16の統合
  console.log('📦 Story 16を統合中...');
  const story16Code = fs.readFileSync(path.join(__dirname, 'story-16-seed-code.ts'), 'utf-8');
  const story16QuizData = fs.readFileSync(path.join(__dirname, 'story-16-quiz-data.ts'), 'utf-8');

  if (!seedContent.includes("Story 16:")) {
    seedContent = seedContent.replace(
      story15CompletionLog,
      story15CompletionLog + '\n\n  ' + story16Code
    );
    console.log('✅ Story 16のストーリーコードを挿入しました');
  } else {
    console.log('⚠️  Story 16は既に挿入されています');
  }

  // Story 17の統合
  console.log('📦 Story 17を統合中...');
  const story17Code = fs.readFileSync(path.join(__dirname, 'story-17-seed-code.ts'), 'utf-8');
  const story17QuizData = fs.readFileSync(path.join(__dirname, 'story-17-quiz-data.ts'), 'utf-8');

  const story16CompletionLog = "console.log('Created Story 16: アパートの契約 (N3/B1) with 9 chapters');";

  if (!seedContent.includes("Story 17:")) {
    seedContent = seedContent.replace(
      story16CompletionLog,
      story16CompletionLog + '\n\n  ' + story17Code
    );
    console.log('✅ Story 17のストーリーコードを挿入しました');
  } else {
    console.log('⚠️  Story 17は既に挿入されています');
  }

  // Story 18の統合
  console.log('📦 Story 18を統合中...');
  const story18Code = fs.readFileSync(path.join(__dirname, 'story-18-seed-code.ts'), 'utf-8');
  const story18QuizData = fs.readFileSync(path.join(__dirname, 'story-18-quiz-data.ts'), 'utf-8');

  const story17CompletionLog = "console.log('Created Story 17: 電車の乗り換え (N3/B1) with 9 chapters');";

  if (!seedContent.includes("Story 18:")) {
    seedContent = seedContent.replace(
      story17CompletionLog,
      story17CompletionLog + '\n\n  ' + story18Code
    );
    console.log('✅ Story 18のストーリーコードを挿入しました');
  } else {
    console.log('⚠️  Story 18は既に挿入されています');
  }

  // クイズ挿入
  console.log('\n📝 クイズデータを統合中...');
  const story15QuizPattern = /quiz_id: 'quiz-15-3',[\s\S]*?\],\s*\},/;
  const match = seedContent.match(story15QuizPattern);

  if (match && !seedContent.includes("quiz_id: 'quiz-16-1'")) {
    let quizInsert = '\n    ' + story16QuizData + '\n    ' + story17QuizData + '\n    ' + story18QuizData;
    seedContent = seedContent.replace(
      match[0],
      match[0] + quizInsert
    );
    console.log('✅ Story 16-18のクイズデータを挿入しました');
  } else if (seedContent.includes("quiz_id: 'quiz-16-1'")) {
    console.log('⚠️  Story 16-18のクイズは既に挿入されています');
  }

  // ログ更新
  seedContent = seedContent.replace(
    "console.log('Created 45 quizzes (3 per story x 15 stories) with choices');",
    "console.log('Created 54 quizzes (3 per story x 18 stories) with choices');"
  );

  // バックアップ & 保存
  const backupFile = SEED_FILE + '.backup-' + Date.now();
  fs.copyFileSync(SEED_FILE, backupFile);
  fs.writeFileSync(SEED_FILE, seedContent, 'utf-8');

  console.log(`\n✅ バックアップ: ${path.basename(backupFile)}`);
  console.log('✅ Story 16-18の統合が完了しました！\n');
  console.log('📊 Phase 3完了: 18ストーリー達成！');
  console.log('   - Story 16: アパートの契約 (N3/B1)');
  console.log('   - Story 17: 電車の乗り換え (N3/B1)');
  console.log('   - Story 18: 郵便局で (N3/B1)');
}

main().catch((error) => {
  console.error('❌ エラー:', error);
  process.exit(1);
});
