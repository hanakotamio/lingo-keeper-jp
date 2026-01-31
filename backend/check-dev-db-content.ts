import { PrismaClient } from '@prisma/client';

// 開発環境のDATABASE_URL
const devDatabaseUrl = 'postgresql://neondb_owner:npg_9zkXoHEsC8PQ@ep-morning-sky-a1dv4mjd-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: devDatabaseUrl
    }
  }
});

async function checkDevStoryContent() {
  try {
    console.log('Connecting to DEVELOPMENT database...\n');
    console.log('Database URL:', devDatabaseUrl.replace(/:[^:@]+@/, ':***@'));
    console.log('\n');

    // Get first 5 stories
    const stories = await prisma.$queryRaw<any[]>`
      SELECT story_id, title, description, level_jlpt, level_cefr
      FROM stories
      ORDER BY story_id ASC
      LIMIT 5
    `;

    console.log(`Found ${stories.length} stories in DEVELOPMENT database\n`);

    stories.forEach((story, index) => {
      console.log(`${index + 1}. ${story.title}`);
      console.log(`   ID: ${story.story_id}`);
      console.log(`   Description: ${story.description}`);
      console.log(`   Level: JLPT ${story.level_jlpt} / CEFR ${story.level_cefr}`);
      console.log('');
    });

    // Get sample chapter content
    const chapter = await prisma.$queryRaw<any[]>`
      SELECT content
      FROM chapters
      WHERE story_id = ${stories[0].story_id}
      LIMIT 1
    `;

    console.log('\nSample Chapter Content from first story:');
    console.log('='.repeat(80));
    console.log(chapter[0]?.content || 'No content found');
    console.log('='.repeat(80));

  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

checkDevStoryContent()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
