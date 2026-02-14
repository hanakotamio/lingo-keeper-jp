#!/usr/bin/env tsx
/**
 * Story 12 確認スクリプト
 *
 * Story 12が正しくデータベースに追加されたかを確認します
 */

import { PrismaClient } from '@prisma/client';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Story 12の確認を開始します...\n');

  try {
    // Story 12を取得
    const story12 = await prisma.story.findUnique({
      where: { story_id: '12' },
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

    if (!story12) {
      console.log('❌ Story 12が見つかりません');
      console.log('\n次のステップ:');
      console.log('1. seed.tsにStory 12が追加されているか確認');
      console.log('2. npx prisma db push --force-reset && npx prisma db seed を実行');
      process.exit(1);
    }

    // 基本情報を表示
    console.log('✅ Story 12が見つかりました\n');
    console.log('📖 基本情報:');
    console.log(`   ID: ${story12.story_id}`);
    console.log(`   タイトル: ${story12.title}`);
    console.log(`   英語タイトル: ${story12.title_en}`);
    console.log(`   JLPTレベル: ${story12.level_jlpt} / ${story12.level_cefr}`);
    console.log(`   カテゴリ: ${story12.category}`);
    console.log(`   推定時間: ${story12.estimated_time}分\n`);

    // チャプター情報
    console.log(`📚 チャプター数: ${story12.chapters.length}\n`);
    console.log('   チャプター一覧:');
    story12.chapters.forEach((chapter) => {
      console.log(`   - Chapter ${chapter.chapter_number}: ${chapter.chapter_id}`);
      if (chapter.parent_chapter_id) {
        console.log(`     └─ Parent: ${chapter.parent_chapter_id}`);
      }
    });

    // クイズ情報
    console.log(`\n❓ クイズ数: ${story12.quizzes.length}\n`);
    console.log('   クイズ一覧:');
    story12.quizzes.forEach((quiz) => {
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
          story_id: '12',
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
      console.log(`   ⚠️  ${brokenLinks}個のリンク切れがあります\n`);
    }

    // サマリー
    console.log('📊 サマリー:');
    console.log(`   ✅ Story 12: ${story12.title}`);
    console.log(`   ✅ チャプター: ${story12.chapters.length}個`);
    console.log(`   ✅ クイズ: ${story12.quizzes.length}個`);
    console.log(`   ✅ 選択肢: ${choices.length}個`);
    console.log(`   ${brokenLinks === 0 ? '✅' : '⚠️ '} リンク整合性: ${brokenLinks === 0 ? '正常' : `${brokenLinks}個のエラー`}`);

    console.log('\n🎉 Story 12の確認が完了しました！');

    // 全ストーリー数も確認
    const totalStories = await prisma.story.count();
    console.log(`\n📚 全ストーリー数: ${totalStories}個`);

    if (totalStories === 12) {
      console.log('✅ 期待通り12ストーリーになりました！');
      console.log('\n🎊 Phase 1完了: N5ストーリーが4個（Story 3, 10, 11, 12）');

      // N5ストーリー数を確認
      const n5Stories = await prisma.story.findMany({
        where: { level_jlpt: 'N5' },
        select: { story_id: true, title: true },
      });
      console.log(`\nN5ストーリー（${n5Stories.length}個）:`);
      n5Stories.forEach((story) => {
        console.log(`   - Story ${story.story_id}: ${story.title}`);
      });
    }

  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
