import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyAllStories() {
  console.log('Verifying all stories in database...\n');

  try {
    // Check all stories
    const stories = await prisma.story.findMany({
      select: {
        story_id: true,
        title: true,
        level_jlpt: true,
        level_cefr: true,
      },
      orderBy: {
        story_id: 'asc',
      },
    });

    console.log('=== All Stories ===');
    console.log(`Total stories: ${stories.length}\n`);

    stories.forEach((story, index) => {
      console.log(`${index + 1}. [${story.story_id}] ${story.title}`);
      console.log(`   Level: ${story.level_jlpt} / ${story.level_cefr}`);
    });

    // Check for any stories with null levels
    const invalidStories = stories.filter(s => !s.level_jlpt || !s.level_cefr);
    console.log(`\n=== Validation ===`);
    console.log(`Invalid stories (null levels): ${invalidStories.length}`);

    if (invalidStories.length > 0) {
      console.log('WARNING: Found stories with null levels:');
      invalidStories.forEach(s => {
        console.log(`- ${s.story_id}: ${s.title}`);
      });
    } else {
      console.log('✅ All stories have valid level_jlpt and level_cefr');
    }

    // Check total chapters
    const totalChapters = await prisma.chapter.count();
    console.log(`\nTotal chapters: ${totalChapters}`);

    // Check total quizzes
    const totalQuizzes = await prisma.quiz.count();
    console.log(`Total quizzes: ${totalQuizzes}`);

    console.log('\n✅ Database verification complete!');
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

verifyAllStories()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
