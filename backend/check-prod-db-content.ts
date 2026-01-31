import { PrismaClient } from '@prisma/client';

// 本番環境のDATABASE_URL（Secret Managerから取得した値）
const prodDatabaseUrl = 'postgresql://neondb_owner:npg_bDu9oz4BJsGp@ep-wandering-bread-a12b5y0c-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: prodDatabaseUrl
    }
  }
});

async function checkProdStoryContent() {
  try {
    console.log('Connecting to PRODUCTION database...\n');
    console.log('Database URL:', prodDatabaseUrl.replace(/:[^:@]+@/, ':***@'));
    console.log('\n');

    // Get first 3 stories with their chapters
    const stories = await prisma.story.findMany({
      take: 3,
      orderBy: { story_id: 'asc' },
      include: {
        chapters: {
          take: 2,
          orderBy: { chapter_number: 'asc' }
        }
      }
    });

    console.log(`Found ${stories.length} stories in PRODUCTION database\n`);

    stories.forEach((story, index) => {
      console.log(`\n${'='.repeat(80)}`);
      console.log(`PRODUCTION STORY ${index + 1}: ${story.title}`);
      console.log(`Story ID: ${story.story_id}`);
      console.log(`Description: ${story.description}`);
      console.log(`Level: JLPT ${story.level_jlpt} / CEFR ${story.level_cefr}`);
      console.log(`${'='.repeat(80)}\n`);

      story.chapters.forEach((chapter, chapterIndex) => {
        console.log(`  CHAPTER ${chapterIndex + 1}:`);
        console.log(`  Chapter ID: ${chapter.chapter_id}`);
        console.log(`  Chapter Number: ${chapter.chapter_number}`);
        console.log(`  Content:\n`);
        console.log(`  ${chapter.content}\n`);
        console.log(`  ${'-'.repeat(70)}\n`);
      });
    });

  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

checkProdStoryContent()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
