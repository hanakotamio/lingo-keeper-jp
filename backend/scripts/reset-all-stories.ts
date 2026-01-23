import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Deleting ALL stories and related data...');
  
  // Delete in correct order due to foreign keys
  await prisma.quizChoice.deleteMany({});
  await prisma.quiz.deleteMany({});
  await prisma.choice.deleteMany({});
  await prisma.chapter.deleteMany({});
  await prisma.story.deleteMany({});
  
  console.log('✅ All stories deleted successfully');
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
