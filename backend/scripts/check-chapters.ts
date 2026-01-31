import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkChapters() {
  console.log('Checking chapters for problematic stories...\n');

  const storiesToCheck = ['2', '4', '11', '12', '13', '14', '15'];

  for (const storyId of storiesToCheck) {
    const story = await prisma.story.findUnique({
      where: { story_id: storyId },
      select: { story_id: true, title: true, root_chapter_id: true },
    });

    if (!story) {
      console.log(`Story ${storyId}: NOT FOUND\n`);
      continue;
    }

    console.log(`Story ${storyId}: ${story.title}`);
    console.log(`  Root Chapter ID: ${story.root_chapter_id}`);

    // Check if chapters exist
    const chapters = await prisma.chapter.findMany({
      where: { story_id: storyId },
      select: {
        chapter_id: true,
        chapter_number: true,
        parent_chapter_id: true,
      },
    });

    console.log(`  Total Chapters: ${chapters.length}`);

    if (chapters.length === 0) {
      console.log(`  ❌ NO CHAPTERS FOUND - This is the problem!`);
    } else {
      // Check if root chapter exists
      const rootExists = chapters.some(ch => ch.chapter_id === story.root_chapter_id);
      console.log(`  Root Chapter Exists: ${rootExists ? '✓' : '❌'}`);

      // Count choices
      const choices = await prisma.choice.findMany({
        where: {
          chapter_id: { in: chapters.map(ch => ch.chapter_id) },
        },
      });

      console.log(`  Total Choices: ${choices.length}`);

      if (choices.length === 0) {
        console.log(`  ❌ NO CHOICES FOUND - Story cannot progress!`);
      }
    }

    console.log('');
  }
}

checkChapters()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
