import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const stories = await prisma.story.findMany();
    console.log(`Stories count: ${stories.length}`);
    
    if (stories.length > 0) {
      console.log('First story:', stories[0]);
    }

    const chapters = await prisma.chapter.count();
    console.log(`Chapters count: ${chapters}`);
    
    const quizzes = await prisma.quiz.count();
    console.log(`Quizzes count: ${quizzes}`);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
