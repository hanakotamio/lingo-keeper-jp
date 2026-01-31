import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Dropping all tables...');
  
  try {
    // Drop tables in reverse dependency order
    await prisma.$executeRaw`DROP TABLE IF EXISTS quiz_results CASCADE`;
    await prisma.$executeRaw`DROP TABLE IF EXISTS quiz_choices CASCADE`;
    await prisma.$executeRaw`DROP TABLE IF EXISTS quizzes CASCADE`;
    await prisma.$executeRaw`DROP TABLE IF EXISTS choices CASCADE`;
    await prisma.$executeRaw`DROP TABLE IF EXISTS chapters CASCADE`;
    await prisma.$executeRaw`DROP TABLE IF EXISTS stories CASCADE`;
    
    console.log('All tables dropped successfully');
  } catch (error) {
    console.error('Error dropping tables:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
