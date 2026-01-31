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

    if (invalidStories.length === 0) {
      console.log('\n削除するストーリーはありません');
      return;
    }

    for (const story of invalidStories) {
      console.log(`\n削除中: ${story.story_id} - ${story.title}`);

      // 1. quiz_choices を削除
      await prisma.quizChoice.deleteMany({
        where: {
          quiz: {
            story_id: story.story_id
          }
        }
      });
      console.log('  ✓ quiz_choices削除');

      // 2. quizzes を削除
      await prisma.quiz.deleteMany({
        where: {
          story_id: story.story_id
        }
      });
      console.log('  ✓ quizzes削除');

      // 3. choices を削除
      await prisma.choice.deleteMany({
        where: {
          chapter: {
            story_id: story.story_id
          }
        }
      });
      console.log('  ✓ choices削除');

      // 4. chapters を削除
      await prisma.chapter.deleteMany({
        where: {
          story_id: story.story_id
        }
      });
      console.log('  ✓ chapters削除');

      // 5. story を削除
      await prisma.story.delete({
        where: {
          story_id: story.story_id
        }
      });
      console.log(`  ✅ ストーリー削除完了`);
    }

    console.log(`\n✅ 合計${invalidStories.length}件のストーリーを削除しました`);

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
