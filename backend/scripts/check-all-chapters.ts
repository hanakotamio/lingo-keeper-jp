import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkAllChapters() {
  console.log('Checking chapters for ALL stories 1-15...\n');

  for (let storyId = 1; storyId <= 15; storyId++) {
    const story = await prisma.story.findUnique({
      where: { story_id: String(storyId) },
      select: { story_id: true, title: true },
    });

    if (!story) {
      console.log(`Story ${storyId}: NOT FOUND\n`);
      continue;
    }

    const chapters = await prisma.chapter.findMany({
      where: { story_id: String(storyId) },
    });

    const choices = await prisma.choice.findMany({
      where: {
        chapter_id: { in: chapters.map(ch => ch.chapter_id) },
      },
    });

    const status = chapters.length === 0 ? '❌ NO CHAPTERS' : '✓';
    console.log(`Story ${storyId}: ${story.title}`);
    console.log(`  Chapters: ${chapters.length} ${status}`);
    console.log(`  Choices: ${choices.length}`);
    console.log('');
  }
}

checkAllChapters()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
