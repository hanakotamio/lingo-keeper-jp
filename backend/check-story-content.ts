import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkStoryContent() {
  try {
    console.log('Fetching stories with chapters...\n');

    // Get first 3 stories with their chapters
    const stories = await prisma.story.findMany({
      take: 3,
      orderBy: { story_id: 'asc' },
      include: {
        chapters: {
          take: 2,
          orderBy: { chapter_number: 'asc' }
        }
      }
    });

    stories.forEach((story, index) => {
      console.log(`\n${'='.repeat(80)}`);
      console.log(`STORY ${index + 1}: ${story.title}`);
      console.log(`Story ID: ${story.story_id}`);
      console.log(`Description: ${story.description}`);
      console.log(`Level: JLPT ${story.level_jlpt} / CEFR ${story.level_cefr}`);
      console.log(`${'='.repeat(80)}\n`);

      story.chapters.forEach((chapter, chapterIndex) => {
        console.log(`  CHAPTER ${chapterIndex + 1}:`);
        console.log(`  Chapter ID: ${chapter.chapter_id}`);
        console.log(`  Chapter Number: ${chapter.chapter_number}`);
        console.log(`  Content:\n`);
        console.log(`  ${chapter.content}\n`);
        console.log(`  ${'-'.repeat(70)}\n`);
      });
    });

  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

checkStoryContent()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
