import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkStoryIds() {
  console.log('Checking all story IDs...\n');

  try {
    const stories = await prisma.story.findMany({
      select: {
        story_id: true,
        title: true,
      },
      orderBy: {
        story_id: 'asc',
      },
    });

    console.log('All stories:');
    stories.forEach((s, i) => {
      console.log(`${i + 1}. ID: "${s.story_id}" | Title: ${s.title}`);
    });

    console.log('\n--- Testing specific story ---');
    const story4 = await prisma.story.findUnique({
      where: { story_id: '4' },
    });
    console.log('Story with ID "4":', story4 ? story4.title : 'NOT FOUND');

  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

checkStoryIds()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
