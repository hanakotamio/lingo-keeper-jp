import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    console.log('Connecting to database...');
    
    // Raw query to check for null levels
    const storiesRaw = await prisma.$queryRaw`
      SELECT story_id, title, level_jlpt, level_cefr
      FROM stories
      ORDER BY story_id
    `;
    
    console.log('Stories in database (raw query):');
    console.log(storiesRaw);
    
    // Check for null values
    const nullCheck = await prisma.$queryRaw`
      SELECT COUNT(*) as count
      FROM stories
      WHERE level_jlpt IS NULL OR level_cefr IS NULL
    `;
    
    console.log('\nNull level check:');
    console.log(nullCheck);
    
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

checkDatabase()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
