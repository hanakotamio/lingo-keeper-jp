import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Updating null next_chapter_id to empty string...');
  
  const result = await prisma.$executeRaw`
    UPDATE choices 
    SET next_chapter_id = '' 
    WHERE next_chapter_id IS NULL
  `;
  
  console.log(`✅ Updated ${result} choices`);
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
