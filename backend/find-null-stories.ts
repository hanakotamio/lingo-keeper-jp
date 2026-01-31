import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function findNullStories() {
  try {
    // Use raw query to find stories with null values
    const stories = await prisma.$queryRaw`
      SELECT story_id, title, level_jlpt, level_cefr, root_chapter_id
      FROM stories
      WHERE level_jlpt IS NULL OR level_cefr IS NULL OR root_chapter_id IS NULL
      LIMIT 10
    `;

    console.log('NULL値を持つストーリー:');
    console.log(JSON.stringify(stories, null, 2));
  } catch (error) {
    console.error('エラー:', error);
  } finally {
    await prisma.$disconnect();
  }
}

findNullStories();
