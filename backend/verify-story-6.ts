import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyStory6() {
  console.log('=== Story 6「公園での散歩」検証 ===\n');

  // Get Story 6
  const story = await prisma.story.findFirst({
    where: { title: '公園での散歩' },
    include: {
      chapters: {
        orderBy: { chapter_number: 'asc' },
        include: {
          choices: true
        }
      },
      quizzes: {
        include: {
          choices: true
        }
      }
    }
  });

  if (!story) {
    console.log('❌ Story 6 not found!');
    return;
  }

  console.log(`📖 Story: ${story.title} (${story.level_jlpt})`);
  console.log(`📊 Chapters: ${story.chapters.length}/5`);
  console.log(`📊 Quizzes: ${story.quizzes.length}/5\n`);

  // Check chapters
  console.log('=== Chapters ===');
  for (const chapter of story.chapters) {
    console.log(`\nChapter ${chapter.chapter_number}:`);
    console.log(`Content: ${chapter.content?.substring(0, 100)}...`);
    console.log(`Choices (${chapter.choices.length}):`);
    for (const choice of chapter.choices) {
      console.log(`  - ${choice.choice_text}`);
    }
  }

  // Check quizzes
  console.log('\n=== Quizzes ===');
  for (let i = 0; i < story.quizzes.length; i++) {
    const quiz = story.quizzes[i];
    console.log(`\nQuiz ${i + 1}: ${quiz.question_type}`);
    console.log(`Question: ${quiz.question_text}`);
    console.log(`Choices:`);
    for (const choice of quiz.choices) {
      const mark = choice.is_correct ? '✅' : '❌';
      console.log(`  ${mark} ${choice.choice_text}`);
    }
  }

  await prisma.$disconnect();
}

verifyStory6().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
