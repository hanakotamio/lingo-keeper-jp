#!/usr/bin/env tsx
/**
 * Phase 3完了確認スクリプト
 *
 * Story 16-18が正しく追加され、Phase 3が完了したかを確認します
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Phase 3完了確認を開始します...\n');

  try {
    // 全ストーリー数確認
    const totalStories = await prisma.story.count();
    console.log('📊 全体統計:');
    console.log(`   総ストーリー数: ${totalStories}個`);

    if (totalStories !== 18) {
      console.log(`   ⚠️  期待値: 18個、実際: ${totalStories}個`);
    } else {
      console.log('   ✅ 目標達成: 18ストーリー');
    }

    // レベル別確認
    console.log('\n📈 レベル別内訳:');
    const n5Stories = await prisma.story.count({ where: { level_jlpt: 'N5' } });
    const n4Stories = await prisma.story.count({ where: { level_jlpt: 'N4' } });
    const n3Stories = await prisma.story.count({ where: { level_jlpt: 'N3' } });
    const n2Stories = await prisma.story.count({ where: { level_jlpt: 'N2' } });
    const n1Stories = await prisma.story.count({ where: { level_jlpt: 'N1' } });

    console.log(`   - N5: ${n5Stories}個 (Phase 1完了)`);
    console.log(`   - N4: ${n4Stories}個 (Phase 2完了)`);
    console.log(`   - N3: ${n3Stories}個 ${n3Stories === 5 ? '✅ (Phase 3目標達成)' : '⚠️'}`);
    console.log(`   - N2: ${n2Stories}個`);
    console.log(`   - N1: ${n1Stories}個`);

    // Story 16-18の詳細確認
    console.log('\n🆕 Phase 3新規ストーリー:');

    for (let i = 16; i <= 18; i++) {
      const story = await prisma.story.findUnique({
        where: { story_id: String(i) },
        include: {
          chapters: true,
          quizzes: {
            include: { choices: true }
          }
        }
      });

      if (story) {
        console.log(`\n   Story ${i}: ${story.title} ✅`);
        console.log(`      英語タイトル: ${story.title_en}`);
        console.log(`      レベル: ${story.level_jlpt} / ${story.level_cefr}`);
        console.log(`      カテゴリ: ${story.category}`);
        console.log(`      チャプター: ${story.chapters.length}個`);
        console.log(`      クイズ: ${story.quizzes.length}個`);

        // 翻訳確認
        let missingTranslations = 0;
        if (!story.title_en || !story.description_en) missingTranslations++;
        story.chapters.forEach(ch => {
          if (!ch.content_en) missingTranslations++;
        });

        if (missingTranslations === 0) {
          console.log(`      翻訳: ✅ 完全`);
        } else {
          console.log(`      翻訳: ⚠️ ${missingTranslations}箇所不足`);
        }

        // 選択肢リンク確認
        const choices = await prisma.choice.findMany({
          where: { chapter: { story_id: String(i) } }
        });

        let brokenLinks = 0;
        for (const choice of choices) {
          if (choice.next_chapter_id) {
            const target = await prisma.chapter.findUnique({
              where: { chapter_id: choice.next_chapter_id }
            });
            if (!target) brokenLinks++;
          }
        }

        console.log(`      選択肢: ${choices.length}個`);
        console.log(`      リンク: ${brokenLinks === 0 ? '✅ 正常' : `⚠️ ${brokenLinks}箇所切れ`}`);
      } else {
        console.log(`\n   Story ${i}: ❌ 見つかりません`);
      }
    }

    // クイズ総数確認
    const totalQuizzes = await prisma.quiz.count();
    console.log('\n❓ クイズ統計:');
    console.log(`   総クイズ数: ${totalQuizzes}個`);
    console.log(`   期待値: 54個 (18 x 3)`);
    if (totalQuizzes === 54) {
      console.log('   ✅ 正常');
    } else {
      console.log(`   ⚠️ ${totalQuizzes - 54}個の差異`);
    }

    // Phase 3完了判定
    console.log('\n' + '━'.repeat(60));
    console.log('🎯 Phase 3完了判定:');
    console.log('━'.repeat(60));

    const phase3Complete = totalStories === 18 && n3Stories === 5 && totalQuizzes === 54;

    if (phase3Complete) {
      console.log('✅ Phase 3完了: すべての目標を達成しました！');
      console.log('\n📊 最終結果:');
      console.log('   - 総ストーリー数: 18個 ✓');
      console.log('   - N3ストーリー: 5個 ✓');
      console.log('   - 総クイズ数: 54個 ✓');
      console.log('\n🎉 おめでとうございます！Phase 3が完了しました！');
    } else {
      console.log('⚠️ Phase 3未完了: 以下を確認してください');
      if (totalStories !== 18) console.log(`   - 総ストーリー数: ${totalStories}/18`);
      if (n3Stories !== 5) console.log(`   - N3ストーリー数: ${n3Stories}/5`);
      if (totalQuizzes !== 54) console.log(`   - 総クイズ数: ${totalQuizzes}/54`);
    }

  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
