import { PrismaClient } from '@prisma/client';

const prodDatabaseUrl = 'postgresql://neondb_owner:npg_bDu9oz4BJsGp@ep-wandering-bread-a12b5y0c-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: prodDatabaseUrl
    }
  }
});

async function checkProdRaw() {
  try {
    console.log('PRODUCTION DATABASE CHECK\n');
    console.log('='.repeat(80));

    // Get stories
    const storiesRaw: any[] = await prisma.$queryRaw`
      SELECT story_id, title, description, level_jlpt, level_cefr
      FROM stories
      ORDER BY story_id
      LIMIT 3
    `;

    console.log(`\nFound ${storiesRaw.length} stories\n`);

    for (const story of storiesRaw) {
      console.log('\n' + '='.repeat(80));
      console.log(`STORY: ${story.title}`);
      console.log(`ID: ${story.story_id}`);
      console.log(`Description: ${story.description}`);
      console.log(`Level: JLPT ${story.level_jlpt} / CEFR ${story.level_cefr}`);
      console.log('='.repeat(80));

      // Get chapters for this story
      const chaptersRaw: any[] = await prisma.$queryRaw`
        SELECT chapter_id, chapter_number, content
        FROM chapters
        WHERE story_id = ${story.story_id}
        ORDER BY chapter_number
        LIMIT 2
      `;

      console.log(`\nFound ${chaptersRaw.length} chapters\n`);

      chaptersRaw.forEach((chapter, idx) => {
        console.log(`  CHAPTER ${idx + 1}:`);
        console.log(`  Chapter ID: ${chapter.chapter_id}`);
        console.log(`  Chapter Number: ${chapter.chapter_number}`);
        console.log(`  Content:\n`);
        console.log(`  ${chapter.content}\n`);
        console.log(`  ${'-'.repeat(70)}\n`);
      });
    }

  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

checkProdRaw()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
