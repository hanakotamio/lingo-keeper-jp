import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyEnglishTranslations() {
  console.log('=== English Translation Verification ===\n');

  // Check stories from different levels
  const storiesToCheck = [
    { id: '1', level: 'N3', expectedTitle: 'A New Life in Tokyo' },
    { id: '5', level: 'N5', expectedTitle: 'Favorite Foods' },
    { id: '10', level: 'N4', expectedTitle: 'Weekend Plans' },
    { id: '15', level: 'N3', expectedTitle: 'Meeting at the Company' },
    { id: '20', level: 'N2', expectedTitle: 'About Environmental Issues' },
    { id: '25', level: 'N1', expectedTitle: 'Succession of Traditional Culture' }
  ];

  for (const storyInfo of storiesToCheck) {
    const story = await prisma.story.findFirst({
      where: { story_id: storyInfo.id },
      include: {
        chapters: {
          orderBy: { chapter_number: 'asc' },
          take: 2 // Check first 2 chapters
        }
      }
    });

    if (!story) {
      console.log(`❌ Story ${storyInfo.id} not found`);
      continue;
    }

    console.log(`\n📚 Story ${storyInfo.id}: ${story.title} (${storyInfo.level})`);
    console.log(`   Level: ${story.level_jlpt}`);

    for (const chapter of story.chapters) {
      console.log(`\n   Chapter ${chapter.chapter_number}:`);
      console.log(`   Japanese (first 80 chars):`);
      console.log(`   ${chapter.content.substring(0, 80)}...`);

      if (chapter.content_en) {
        console.log(`   English (first 80 chars):`);
        console.log(`   ${chapter.content_en.substring(0, 80)}...`);
        console.log(`   ✅ Translation exists (${chapter.content_en.length} characters)`);
      } else {
        console.log(`   ❌ No English translation`);
      }
    }
  }

  // Summary statistics
  console.log('\n\n=== Summary Statistics ===');

  const totalChapters = await prisma.chapter.count();
  const withEnglish = await prisma.chapter.count({
    where: { content_en: { not: null } }
  });

  const avgEnglishLength = await prisma.chapter.aggregate({
    where: { content_en: { not: null } },
    _avg: { content_en: true }
  });

  console.log(`Total chapters: ${totalChapters}`);
  console.log(`Chapters with English: ${withEnglish}`);
  console.log(`Coverage: ${((withEnglish / totalChapters) * 100).toFixed(1)}%`);

  // Check by JLPT level
  const levels = ['N5', 'N4', 'N3', 'N2', 'N1'];

  console.log('\n=== Coverage by JLPT Level ===');
  for (const level of levels) {
    const totalForLevel = await prisma.chapter.count({
      where: {
        story: { level_jlpt: level }
      }
    });

    const withEnglishForLevel = await prisma.chapter.count({
      where: {
        story: { level_jlpt: level },
        content_en: { not: null }
      }
    });

    console.log(`${level}: ${withEnglishForLevel}/${totalForLevel} (${((withEnglishForLevel / totalForLevel) * 100).toFixed(1)}%)`);
  }

  await prisma.$disconnect();
}

verifyEnglishTranslations().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
