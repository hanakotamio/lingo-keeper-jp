import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function check() {
  const chapter = await prisma.chapter.findUnique({
    where: { chapter_id: 'ch-9-1' }
  });

  if (chapter) {
    console.log('日本語:');
    console.log(chapter.content);
    console.log('\n英語:');
    console.log(chapter.content_en);
  }

  await prisma.$disconnect();
}

check();
