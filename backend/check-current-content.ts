import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkCurrentContent() {
  try {
    // Get all stories
    const stories = await prisma.story.findMany({
      orderBy: { story_id: 'asc' },
      select: {
        story_id: true,
        title: true,
        level_jlpt: true,
        category: true,
      },
    });

    console.log(`\n📚 Total Stories: ${stories.length}\n`);
    stories.forEach((story, index) => {
      console.log(`${index + 1}. ${story.title} (${story.level_jlpt}) - ${story.story_id}`);
    });

    // Get sample chapters from Story 6 "公園での散歩"
    const parkStory = stories.find(s => s.title.includes('公園'));
    if (parkStory) {
      console.log(`\n\n🔍 Checking Story 6: ${parkStory.title}\n`);

      const chapters = await prisma.chapter.findMany({
        where: { story_id: parkStory.story_id },
        orderBy: { chapter_number: 'asc' },
        take: 3,
      });

      chapters.forEach(chapter => {
        console.log(`\n--- Chapter ${chapter.chapter_number}: ${chapter.title} ---`);
        console.log(`Content: ${chapter.content.substring(0, 200)}...`);
        console.log(`Learning Points:`, chapter.learning_points);
        console.log(`Vocabulary:`, chapter.vocabulary);
      });
    }

    // Check total chapters and quizzes
    const totalChapters = await prisma.chapter.count();
    const totalQuizzes = await prisma.quiz.count();

    console.log(`\n\n📊 Database Statistics:`);
    console.log(`Total Chapters: ${totalChapters}`);
    console.log(`Total Quizzes: ${totalQuizzes}`);

    // Get sample quiz
    if (parkStory) {
      const quizzes = await prisma.quiz.findMany({
        where: { story_id: parkStory.story_id },
        include: { choices: true },
        take: 2,
      });

      console.log(`\n\n🎯 Sample Quizzes for "${parkStory.title}":\n`);
      quizzes.forEach((quiz, index) => {
        console.log(`\nQuiz ${index + 1}:`);
        console.log(`Question: ${quiz.question_text}`);
        quiz.choices.forEach((choice, i) => {
          console.log(`  ${i + 1}. ${choice.choice_text} ${choice.is_correct ? '✓' : ''}`);
        });
      });
    }

  } catch (error) {
    console.error('Error checking content:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCurrentContent();
