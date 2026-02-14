#!/usr/bin/env tsx
/**
 * Story 15 確認スクリプト
 *
 * Story 15が正しくデータベースに追加されたかを確認します
 * Phase 2完了 (15ストーリー) の確認も行います
 */

import { PrismaClient } from '@prisma/client';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Story 15の確認を開始します...\n');

  try {
    // Story 15を取得
    const story15 = await prisma.story.findUnique({
      where: { story_id: '15' },
      include: {
        chapters: {
          orderBy: { chapter_number: 'asc' },
        },
        quizzes: {
          include: {
            choices: true,
          },
        },
      },
    });

    if (!story15) {
      console.log('❌ Story 15が見つかりません');
      console.log('\n次のステップ:');
      console.log('1. seed.tsにStory 15が追加されているか確認');
      console.log('2. npx prisma db push --force-reset && npx prisma db seed を実行');
      process.exit(1);
    }

    // 基本情報を表示
    console.log('✅ Story 15が見つかりました\n');
    console.log('📖 基本情報:');
    console.log(`   ID: ${story15.story_id}`);
    console.log(`   タイトル: ${story15.title}`);
    console.log(`   英語タイトル: ${story15.title_en}`);
    console.log(`   JLPTレベル: ${story15.level_jlpt} / ${story15.level_cefr}`);
    console.log(`   カテゴリ: ${story15.category}`);
    console.log(`   推定時間: ${story15.estimated_time}分\n`);

    // チャプター情報
    console.log(`📚 チャプター数: ${story15.chapters.length}\n`);

    if (story15.chapters.length !== 9) {
      console.log(`⚠️  警告: チャプター数が9個ではありません (実際: ${story15.chapters.length}個)`);
    } else {
      console.log('✅ チャプター数は正しいです (9個)');
    }

    console.log('\n   チャプター一覧:');
    story15.chapters.forEach((chapter) => {
      console.log(`   - Chapter ${chapter.chapter_number}: ${chapter.chapter_id}`);
      if (chapter.parent_chapter_id) {
        console.log(`     └─ Parent: ${chapter.parent_chapter_id}`);
      }
    });

    // クイズ情報
    console.log(`\n❓ クイズ数: ${story15.quizzes.length}\n`);

    if (story15.quizzes.length !== 3) {
      console.log(`⚠️  警告: クイズ数が3問ではありません (実際: ${story15.quizzes.length}問)`);
    } else {
      console.log('✅ クイズ数は正しいです (3問)');
    }

    console.log('\n   クイズ一覧:');
    story15.quizzes.forEach((quiz) => {
      console.log(`   - ${quiz.quiz_id}: ${quiz.question_text}`);
      console.log(`     タイプ: ${quiz.question_type}, 難易度: ${quiz.difficulty_level}`);
      console.log(`     選択肢: ${quiz.choices.length}個`);

      const correctChoice = quiz.choices.find(c => c.is_correct);
      if (correctChoice) {
        console.log(`     正解: ${correctChoice.choice_text}`);
      }
      console.log('');
    });

    // 選択肢の確認
    console.log('🔗 選択肢リンクの確認:');
    const choices = await prisma.choice.findMany({
      where: {
        chapter: {
          story_id: '15',
        },
      },
    });
    console.log(`   選択肢数: ${choices.length}`);

    // リンク切れチェック
    let brokenLinks = 0;
    for (const choice of choices) {
      if (choice.next_chapter_id) {
        const targetChapter = await prisma.chapter.findUnique({
          where: { chapter_id: choice.next_chapter_id },
        });
        if (!targetChapter) {
          console.log(`   ❌ リンク切れ: ${choice.choice_id} -> ${choice.next_chapter_id}`);
          brokenLinks++;
        }
      }
    }

    if (brokenLinks === 0) {
      console.log('   ✅ すべての選択肢リンクが正常です\n');
    } else {
      console.log(`   ❌ ${brokenLinks}個のリンク切れが見つかりました\n`);
    }

    // 翻訳確認
    console.log('🌐 翻訳の確認:');
    let missingTranslations = 0;

    if (!story15.title_en || !story15.description_en) {
      console.log('   ❌ ストーリーの翻訳が不足しています');
      missingTranslations++;
    }

    for (const chapter of story15.chapters) {
      if (!chapter.content_en) {
        console.log(`   ❌ ${chapter.chapter_id}: 翻訳なし`);
        missingTranslations++;
      }
    }

    if (missingTranslations === 0) {
      console.log('   ✅ すべての翻訳が完了しています\n');
    } else {
      console.log(`   ❌ ${missingTranslations}箇所で翻訳が不足しています\n`);
    }

    // サマリー
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 Story 15 サマリー:');
    console.log(`   ✅ ストーリー: ${story15.title}`);
    console.log(`   ✅ チャプター: ${story15.chapters.length}個 ${story15.chapters.length === 9 ? '✓' : '✗'}`);
    console.log(`   ✅ クイズ: ${story15.quizzes.length}個 ${story15.quizzes.length === 3 ? '✓' : '✗'}`);
    console.log(`   ✅ 選択肢: ${choices.length}個`);
    console.log(`   ✅ リンク切れ: ${brokenLinks}個 ${brokenLinks === 0 ? '✓' : '✗'}`);
    console.log(`   ✅ 翻訳完了: ${missingTranslations === 0 ? '✓' : '✗'}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // 全ストーリー数確認
    const totalStories = await prisma.story.count();
    console.log('🎯 Phase 2完了確認:');
    console.log(`   全ストーリー数: ${totalStories}個`);

    if (totalStories === 15) {
      console.log('   🎉 Phase 2完了: 15ストーリー達成！');

      // レベル別確認
      const n5Stories = await prisma.story.count({ where: { level_jlpt: 'N5' } });
      const n4Stories = await prisma.story.count({ where: { level_jlpt: 'N4' } });
      const n3Stories = await prisma.story.count({ where: { level_jlpt: 'N3' } });
      const n2Stories = await prisma.story.count({ where: { level_jlpt: 'N2' } });
      const n1Stories = await prisma.story.count({ where: { level_jlpt: 'N1' } });

      console.log('\n   レベル別内訳:');
      console.log(`   - N5: ${n5Stories}個`);
      console.log(`   - N4: ${n4Stories}個 ${n4Stories === 5 ? '✓ (Phase 2目標達成)' : ''}`);
      console.log(`   - N3: ${n3Stories}個`);
      console.log(`   - N2: ${n2Stories}個`);
      console.log(`   - N1: ${n1Stories}個`);
    } else {
      console.log(`   ⚠️  ストーリー数が15個ではありません (実際: ${totalStories}個)`);
    }

    console.log('\n✅ Story 15の確認が完了しました！');

  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
