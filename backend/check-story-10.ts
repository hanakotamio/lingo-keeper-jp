#!/usr/bin/env tsx
/**
 * Story 10 確認スクリプト
 *
 * Story 10が正しくデータベースに追加されたかを確認します
 */

import { PrismaClient } from '@prisma/client';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Story 10の確認を開始します...\n');

  try {
    // Story 10を取得
    const story10 = await prisma.story.findUnique({
      where: { story_id: '10' },
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

    if (!story10) {
      console.log('❌ Story 10が見つかりません');
      console.log('\n次のステップ:');
      console.log('1. seed.tsにStory 10が追加されているか確認');
      console.log('2. npx prisma db push --force-reset && npx prisma db seed を実行');
      process.exit(1);
    }

    // 基本情報を表示
    console.log('✅ Story 10が見つかりました\n');
    console.log('📖 基本情報:');
    console.log(`   ID: ${story10.story_id}`);
    console.log(`   タイトル: ${story10.title}`);
    console.log(`   英語タイトル: ${story10.title_en}`);
    console.log(`   JLPTレベル: ${story10.level_jlpt} / ${story10.level_cefr}`);
    console.log(`   カテゴリ: ${story10.category}`);
    console.log(`   推定時間: ${story10.estimated_time}分\n`);

    // チャプター情報
    console.log(`📚 チャプター数: ${story10.chapters.length}\n`);
    console.log('   チャプター一覧:');
    story10.chapters.forEach((chapter) => {
      console.log(`   - Chapter ${chapter.chapter_number}: ${chapter.chapter_id}`);
      if (chapter.parent_chapter_id) {
        console.log(`     └─ Parent: ${chapter.parent_chapter_id}`);
      }
    });

    // クイズ情報
    console.log(`\n❓ クイズ数: ${story10.quizzes.length}\n`);
    console.log('   クイズ一覧:');
    story10.quizzes.forEach((quiz) => {
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
          story_id: '10',
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
    console.log(`   ✅ Story 10: ${story10.title}`);
    console.log(`   ✅ チャプター: ${story10.chapters.length}個`);
    console.log(`   ✅ クイズ: ${story10.quizzes.length}個`);
    console.log(`   ✅ 選択肢: ${choices.length}個`);
    console.log(`   ${brokenLinks === 0 ? '✅' : '⚠️ '} リンク整合性: ${brokenLinks === 0 ? '正常' : `${brokenLinks}個のエラー`}`);

    console.log('\n🎉 Story 10の確認が完了しました！');

    // 全ストーリー数も確認
    const totalStories = await prisma.story.count();
    console.log(`\n📚 全ストーリー数: ${totalStories}個`);

    if (totalStories === 10) {
      console.log('✅ 期待通り10ストーリーになりました！');
      console.log('\nPhase 1の進捗: 1/3完了（残り: Story 11, Story 12）');
    }

  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
