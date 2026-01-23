import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkStories() {
  console.log('Checking all stories in database...\n');

  try {
    const stories = await prisma.$queryRaw<any[]>`
      SELECT story_id, title, level_jlpt, level_cefr
      FROM stories
      ORDER BY story_id
    `;

    console.log(`Found ${stories.length} stories:\n`);

    for (const story of stories) {
      console.log(`Story ${story.story_id}: ${story.title} (${story.level_jlpt}/${story.level_cefr})`);

      // Count quizzes for this story
      const quizzes = await prisma.$queryRaw<any[]>`
        SELECT quiz_id
        FROM quizzes
        WHERE story_id = ${story.story_id}
      `;

      console.log(`  - Quizzes: ${quizzes.length}`);
    }

    console.log('\n✅ Check complete!');
  } catch (error: any) {
    console.error('Error:', error.message);
    if (error.code === 'P2010') {
      console.log('\nDatabase tables may not exist. Run migrations first.');
    }
  }
}

checkStories()
  .catch((e) => {
    console.error('Fatal error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
