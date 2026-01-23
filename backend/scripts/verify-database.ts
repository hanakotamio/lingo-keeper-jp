import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyDatabase() {
  console.log('Verifying database state...\n');

  try {
    // Check all stories
    const stories = await prisma.story.findMany({
      select: {
        story_id: true,
        title: true,
        level_jlpt: true,
        level_cefr: true,
      },
    });

    console.log('=== Stories ===');
    console.log(`Total stories: ${stories.length}`);
    stories.forEach(story => {
      console.log(`- ${story.story_id}: ${story.title} (${story.level_jlpt}, ${story.level_cefr})`);
    });

    // Check for any stories with null levels
    const invalidStories = stories.filter(s => !s.level_jlpt || !s.level_cefr);
    console.log(`\nInvalid stories (null levels): ${invalidStories.length}`);
    if (invalidStories.length > 0) {
      console.log('WARNING: Found stories with null levels:', invalidStories);
    }

    // Check chapters for Story 10
    const chapters = await prisma.chapter.findMany({
      where: { story_id: '10' },
      select: {
        chapter_id: true,
        chapter_number: true,
        content: true,
      },
      orderBy: { chapter_number: 'asc' },
    });

    console.log(`\n=== Chapters for Story 10 ===`);
    console.log(`Total chapters: ${chapters.length}`);
    chapters.forEach(ch => {
      const preview = ch.content.length > 50 ? ch.content.substring(0, 50) + '...' : ch.content;
      console.log(`- Chapter ${ch.chapter_number} (${ch.chapter_id}): ${preview}`);
    });

    // Check quizzes for Story 10
    const quizzes = await prisma.quiz.findMany({
      where: { story_id: '10' },
      include: {
        choices: true,
      },
    });

    console.log(`\n=== Quizzes for Story 10 ===`);
    console.log(`Total quizzes: ${quizzes.length}`);
    quizzes.forEach(quiz => {
      console.log(`- ${quiz.quiz_id}: ${quiz.question_text}`);
      console.log(`  Choices: ${quiz.choices.length}`);
    });

    console.log('\n✅ Database verification complete!');
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

verifyDatabase()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
