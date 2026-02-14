import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkChapter() {
  const chapter = await prisma.chapter.findUnique({
    where: { chapter_id: 'ch-17-2' },
    include: { story: true }
  });

  if (chapter) {
    console.log('Story:', chapter.story.title);
    console.log('Chapter:', chapter.chapter_number);
    console.log('\n日本語:');
    console.log(chapter.content);
    console.log('\n英語:');
    console.log(chapter.content_en);
  }

  await prisma.$disconnect();
}

checkChapter();
