import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function listAllStories() {
  const stories = await prisma.story.findMany({
    orderBy: { story_id: 'asc' },
    select: {
      story_id: true,
      title: true,
      level_jlpt: true,
      _count: {
        select: {
          chapters: true,
          quizzes: true
        }
      }
    }
  });

  console.log('=== All Stories in Database ===\n');
  console.log(`Total stories: ${stories.length}\n`);

  stories.forEach((story, index) => {
    console.log(`${index + 1}. Story ID: ${story.story_id}`);
    console.log(`   Title: ${story.title}`);
    console.log(`   Level: ${story.level_jlpt}`);
    console.log(`   Chapters: ${story._count.chapters}`);
    console.log(`   Quizzes: ${story._count.quizzes}`);
    console.log('');
  });

  await prisma.$disconnect();
}

listAllStories().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
