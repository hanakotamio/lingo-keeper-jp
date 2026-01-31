import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function deleteInvalidStories() {
  try {
    console.log('=== 無効なストーリーを削除 ===\n');

    // Find all stories with NULL values
    const invalidStories: any[] = await prisma.$queryRaw`
      SELECT story_id, title
      FROM stories
      WHERE level_jlpt IS NULL OR level_cefr IS NULL OR root_chapter_id IS NULL
    `;

    console.log(`無効なストーリー数: ${invalidStories.length}`);
    invalidStories.forEach(s => {
      console.log(`- ${s.story_id}: ${s.title}`);
    });

    if (invalidStories.length === 0) {
      console.log('\n削除するストーリーはありません');
      return;
    }

    console.log(`\n${invalidStories.length}件のストーリーを削除中...`);

    // Delete関連データから順番に削除
    // 1. quiz_choices を削除
    await prisma.$executeRaw`
      DELETE FROM quiz_choices
      WHERE quiz_id IN (
        SELECT quiz_id FROM quizzes
        WHERE story_id IN (
          SELECT story_id FROM stories
          WHERE level_jlpt IS NULL OR level_cefr IS NULL OR root_chapter_id IS NULL
        )
      )
    `;
    console.log('  ✓ quiz_choicesを削除');

    // 2. quizzes を削除
    await prisma.$executeRaw`
      DELETE FROM quizzes
      WHERE story_id IN (
        SELECT story_id FROM stories
        WHERE level_jlpt IS NULL OR level_cefr IS NULL OR root_chapter_id IS NULL
      )
    `;
    console.log('  ✓ quizzesを削除');

    // 3. choices を削除
    await prisma.$executeRaw`
      DELETE FROM choices
      WHERE chapter_id IN (
        SELECT chapter_id FROM chapters
        WHERE story_id IN (
          SELECT story_id FROM stories
          WHERE level_jlpt IS NULL OR level_cefr IS NULL OR root_chapter_id IS NULL
        )
      )
    `;
    console.log('  ✓ choicesを削除');

    // 4. chapters を削除
    await prisma.$executeRaw`
      DELETE FROM chapters
      WHERE story_id IN (
        SELECT story_id FROM stories
        WHERE level_jlpt IS NULL OR level_cefr IS NULL OR root_chapter_id IS NULL
      )
    `;
    console.log('  ✓ chaptersを削除');

    // 5. stories を削除
    const result = await prisma.$executeRaw`
      DELETE FROM stories
      WHERE level_jlpt IS NULL OR level_cefr IS NULL OR root_chapter_id IS NULL
    `;

    console.log(`✅ ${result}件のストーリーを削除しました`);

  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

deleteInvalidStories()
  .then(() => {
    console.log('\n=== 削除完了 ===');
    process.exit(0);
  })
  .catch((error) => {
    console.error('削除に失敗しました:', error);
    process.exit(1);
  });
