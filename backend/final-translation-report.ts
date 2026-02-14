import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function generateFinalReport() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('     ENGLISH TRANSLATION PROJECT - FINAL REPORT');
  console.log('═══════════════════════════════════════════════════════════════\n');

  // Overall statistics
  const totalChapters = await prisma.chapter.count();
  const withEnglish = await prisma.chapter.count({
    where: { content_en: { not: null } }
  });

  console.log('📊 OVERALL STATISTICS');
  console.log('─────────────────────────────────────────────────────────────');
  console.log(`Total Chapters:              ${totalChapters}`);
  console.log(`With English Translation:    ${withEnglish}`);
  console.log(`Missing Translation:         ${totalChapters - withEnglish}`);
  console.log(`Coverage:                    ${((withEnglish / totalChapters) * 100).toFixed(1)}%`);
  console.log('');

  // Statistics by JLPT level
  const levels = ['N5', 'N4', 'N3', 'N2', 'N1'];

  console.log('📚 BREAKDOWN BY JLPT LEVEL');
  console.log('─────────────────────────────────────────────────────────────');

  for (const level of levels) {
    const storiesForLevel = await prisma.story.count({
      where: { level_jlpt: level }
    });

    const chaptersForLevel = await prisma.chapter.count({
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

    const coverage = chaptersForLevel > 0 ? ((withEnglishForLevel / chaptersForLevel) * 100).toFixed(1) : '0.0';

    console.log(`${level}: ${storiesForLevel} stories, ${withEnglishForLevel}/${chaptersForLevel} chapters (${coverage}%)`);
  }

  console.log('');

  // Sample translations from each level
  console.log('📖 SAMPLE TRANSLATIONS (First 150 characters)');
  console.log('─────────────────────────────────────────────────────────────');

  for (const level of levels) {
    const sampleChapter = await prisma.chapter.findFirst({
      where: {
        story: { level_jlpt: level },
        content_en: { not: null }
      },
      include: {
        story: {
          select: { title: true }
        }
      }
    });

    if (sampleChapter && sampleChapter.content_en) {
      console.log(`\n${level} - ${sampleChapter.story.title} (Ch.${sampleChapter.chapter_number}):`);
      console.log(`JA: ${sampleChapter.content.substring(0, 100)}...`);
      console.log(`EN: ${sampleChapter.content_en.substring(0, 100)}...`);
    }
  }

  console.log('\n');

  // Content length analysis
  console.log('📏 CONTENT LENGTH ANALYSIS');
  console.log('─────────────────────────────────────────────────────────────');

  for (const level of levels) {
    const chapters = await prisma.chapter.findMany({
      where: {
        story: { level_jlpt: level },
        content_en: { not: null }
      },
      select: {
        content: true,
        content_en: true
      }
    });

    if (chapters.length > 0) {
      const avgJapaneseLength = chapters.reduce((sum, ch) => sum + ch.content.length, 0) / chapters.length;
      const avgEnglishLength = chapters.reduce((sum, ch) => sum + (ch.content_en?.length || 0), 0) / chapters.length;

      console.log(`${level}:`);
      console.log(`  Avg Japanese length: ${Math.round(avgJapaneseLength)} chars`);
      console.log(`  Avg English length:  ${Math.round(avgEnglishLength)} chars`);
      console.log(`  EN/JA ratio:         ${(avgEnglishLength / avgJapaneseLength).toFixed(2)}x`);
    }
  }

  console.log('\n');

  // Story completion check
  console.log('✓ STORY COMPLETION CHECK');
  console.log('─────────────────────────────────────────────────────────────');

  const stories = await prisma.story.findMany({
    orderBy: { story_id: 'asc' },
    select: {
      story_id: true,
      title: true,
      level_jlpt: true,
      _count: {
        select: {
          chapters: true
        }
      }
    }
  });

  let allComplete = true;

  for (const story of stories) {
    const chaptersWithEnglish = await prisma.chapter.count({
      where: {
        story_id: story.story_id,
        content_en: { not: null }
      }
    });

    const status = chaptersWithEnglish === story._count.chapters ? '✅' : '❌';
    if (chaptersWithEnglish < story._count.chapters) {
      allComplete = false;
      console.log(`${status} Story ${story.story_id}: ${story.title} (${story.level_jlpt})`);
      console.log(`   ${chaptersWithEnglish}/${story._count.chapters} chapters translated`);
    }
  }

  if (allComplete) {
    console.log('✅ All stories have complete English translations!');
  }

  console.log('\n');

  // Quality check: Find very short or potentially missing translations
  console.log('⚠️  QUALITY CHECK');
  console.log('─────────────────────────────────────────────────────────────');

  const shortTranslations = await prisma.chapter.findMany({
    where: {
      AND: [
        { content_en: { not: null } },
        {
          OR: [
            { content_en: { contains: '' } }
          ]
        }
      ]
    },
    select: {
      chapter_id: true,
      chapter_number: true,
      content_en: true,
      story: {
        select: {
          story_id: true,
          title: true
        }
      }
    }
  });

  const suspiciouslyShort = await prisma.chapter.findMany({
    where: {
      content_en: { not: null }
    },
    select: {
      chapter_id: true,
      chapter_number: true,
      content: true,
      content_en: true,
      story: {
        select: {
          story_id: true,
          title: true
        }
      }
    }
  });

  const shortOnes = suspiciouslyShort.filter(ch =>
    ch.content_en && ch.content_en.length < 100
  );

  if (shortOnes.length > 0) {
    console.log(`Found ${shortOnes.length} chapters with suspiciously short translations (<100 chars):`);
    shortOnes.slice(0, 5).forEach(ch => {
      console.log(`  Story ${ch.story.story_id} Ch.${ch.chapter_number}: ${ch.content_en?.length} chars`);
    });
  } else {
    console.log('✅ No suspiciously short translations found');
  }

  console.log('\n');
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('                    REPORT COMPLETE');
  console.log('═══════════════════════════════════════════════════════════════');

  await prisma.$disconnect();
}

generateFinalReport().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
