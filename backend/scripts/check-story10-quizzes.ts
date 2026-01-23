import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkQuizzes() {
  const quizzes = await prisma.quiz.findMany({
    where: { story_id: '10' },
  });

  console.log(`✅ Story 10 has ${quizzes.length} quizzes:`);
  for (const quiz of quizzes) {
    console.log(`  - ${quiz.quiz_id}: ${quiz.question_text}`);
  }

  await prisma.$disconnect();
}

checkQuizzes();
