import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkStructure() {
  try {
    // Check a specific story
    const story = await prisma.story.findFirst({
      where: { title: 'コンビニで買い物' },
    });

    if (story) {
      console.log('Story:', story);

      const chapters = await prisma.chapter.findMany({
        where: { story_id: story.story_id },
        orderBy: { chapter_number: 'asc' },
      });

      console.log('\nChapters:', chapters.length);
      chapters.forEach(ch => {
        console.log(`  - ID: ${ch.chapter_id}, Number: ${ch.chapter_number}, Title: ${ch.title}`);
      });
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkStructure();
