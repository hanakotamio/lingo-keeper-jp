import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const storyCount = await prisma.story.count();
  const quizCount = await prisma.quiz.count();
  console.log('Stories in DB:', storyCount);
  console.log('Quizzes in DB:', quizCount);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
