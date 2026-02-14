import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkStory() {
  const chapters = await prisma.chapter.findMany({
    where: { story_id: '8' },
    orderBy: { chapter_number: 'asc' }
  });

  for (const chapter of chapters) {
    console.log('\n' + '='.repeat(80));
    console.log(`Chapter ${chapter.chapter_number}`);
    console.log('\n日本語 (first 200 chars):');
    console.log(chapter.content.substring(0, 200));
    console.log('\n英語 (first 200 chars):');
    console.log(chapter.content_en?.substring(0, 200));
  }

  await prisma.$disconnect();
}

checkStory();
