import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkQuizzes() {
  const quizzes = await prisma.quiz.findMany();
  console.log('Total quizzes in database:', quizzes.length);

  const byStory: Record<string, number> = {};
  for (const q of quizzes) {
    byStory[q.story_id] = (byStory[q.story_id] || 0) + 1;
  }

  console.log('\nQuizzes per story:');
  for (let i = 1; i <= 25; i++) {
    const count = byStory[String(i)] || 0;
    console.log(`  Story ${i}: ${count} quizzes`);
  }

  await prisma.$disconnect();
}

checkQuizzes();
