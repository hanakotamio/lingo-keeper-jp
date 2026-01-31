import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearAllData() {
  console.log('Clearing ALL data from database...\n');

  try {
    // Delete in correct order due to foreign key constraints
    console.log('Deleting quiz_results...');
    await prisma.quizResult.deleteMany({});
    
    console.log('Deleting quiz_choices...');
    await prisma.quizChoice.deleteMany({});
    
    console.log('Deleting quizzes...');
    await prisma.quiz.deleteMany({});
    
    console.log('Deleting vocabulary...');
    await prisma.vocabulary.deleteMany({});
    
    console.log('Deleting choices...');
    await prisma.choice.deleteMany({});
    
    console.log('Deleting chapters...');
    await prisma.chapter.deleteMany({});
    
    console.log('Deleting stories...');
    await prisma.story.deleteMany({});
    
    console.log('\n✅ All data cleared successfully!');
    
    // Verify
    const storyCount = await prisma.story.count();
    console.log(`Remaining stories: ${storyCount}`);
    
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

clearAllData()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
