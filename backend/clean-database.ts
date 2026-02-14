import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanDatabase() {
  console.log('Cleaning database...\n');

  // Delete all data in correct order (respecting foreign keys)
  await prisma.quizChoice.deleteMany({});
  console.log('✅ Deleted all quiz choices');

  await prisma.quiz.deleteMany({});
  console.log('✅ Deleted all quizzes');

  await prisma.choice.deleteMany({});
  console.log('✅ Deleted all choices');

  await prisma.chapter.deleteMany({});
  console.log('✅ Deleted all chapters');

  await prisma.story.deleteMany({});
  console.log('✅ Deleted all stories');

  console.log('\n📊 Database is now clean!');
  await prisma.$disconnect();
}

cleanDatabase().catch((error) => {
  console.error('Error cleaning database:', error);
  process.exit(1);
});
