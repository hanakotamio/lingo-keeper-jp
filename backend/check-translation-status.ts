import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkTranslationStatus() {
  console.log('=== Translation Status Check ===\n');

  const totalChapters = await prisma.chapter.count();
  const withEnglish = await prisma.chapter.count({
    where: { content_en: { not: null } }
  });
  const needingTranslation = totalChapters - withEnglish;

  console.log(`Total chapters: ${totalChapters}`);
  console.log(`Chapters with English translation: ${withEnglish}`);
  console.log(`Chapters needing translation: ${needingTranslation}`);

  // Get sample chapters
  const sampleChapters = await prisma.chapter.findMany({
    take: 3,
    include: {
      story: {
        select: { title: true, level_jlpt: true }
      }
    }
  });

  console.log('\n=== Sample Chapters ===');
  for (const chapter of sampleChapters) {
    console.log(`\nStory: ${chapter.story.title} (${chapter.story.level_jlpt})`);
    console.log(`Chapter ${chapter.chapter_number}: ${chapter.title}`);
    console.log(`Japanese content (first 100 chars): ${chapter.content.substring(0, 100)}...`);
    console.log(`English translation: ${chapter.content_en ? 'EXISTS' : 'NULL'}`);
    if (chapter.content_en) {
      console.log(`English content (first 100 chars): ${chapter.content_en.substring(0, 100)}...`);
    }
  }

  await prisma.$disconnect();
}

checkTranslationStatus().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
