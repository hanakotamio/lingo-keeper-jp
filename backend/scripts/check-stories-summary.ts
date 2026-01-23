import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkStoriesSummary() {
  console.log('Checking Stories 1-10 Summary...\n');

  try {
    for (let i = 1; i <= 10; i++) {
      const story = await prisma.story.findUnique({
        where: { story_id: String(i) },
      });

      if (story) {
        const quizzes = await prisma.quiz.findMany({
          where: { story_id: String(i) },
        });

        console.log(`Story ${i}: ${story.title}`);
        console.log(`  Level: ${story.level_jlpt} / ${story.level_cefr}`);
        console.log(`  Quizzes: ${quizzes.length}`);
        console.log(`  Time: ${story.estimated_time} min\n`);
      } else {
        console.log(`Story ${i}: NOT FOUND\n`);
      }
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkStoriesSummary();
