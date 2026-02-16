import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Adding content_ruby field to chapters table...');

  try {
    await prisma.$executeRawUnsafe(`
      ALTER TABLE chapters ADD COLUMN IF NOT EXISTS content_ruby TEXT;
    `);

    console.log('✅ Successfully added content_ruby field');
    console.log('');
    console.log('📝 Now you need to re-seed the database to add ruby content.');
    console.log('Run: npx tsx prisma/seed_complete.ts');

  } catch (error) {
    console.error('❌ Error adding content_ruby field:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
