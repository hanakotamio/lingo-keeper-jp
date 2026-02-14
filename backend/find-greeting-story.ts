import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function findStory() {
  const stories = await prisma.story.findMany({
    orderBy: { story_id: 'asc' }
  });

  console.log('全ストーリー一覧：\n');
  for (const story of stories) {
    console.log(`ID: ${story.story_id} | タイトル: ${story.title} | レベル: ${story.level_jlpt}`);
  }

  await prisma.$disconnect();
}

findStory().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
