/**
 * Clear stories and chapters tables using raw SQL
 */

import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

// Load environment variables - try multiple paths
dotenv.config({ path: '../.env.local' });
dotenv.config({ path: '.env' });
dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

async function main() {
  console.log('🗑️  Clearing stories and chapters tables...');

  try {
    // Delete in correct order to avoid foreign key constraints
    await prisma.$executeRaw`TRUNCATE TABLE choices CASCADE`;
    console.log('  ✓ Cleared choices');

    await prisma.$executeRaw`TRUNCATE TABLE chapters CASCADE`;
    console.log('  ✓ Cleared chapters');

    // Try to clear quizzes if it exists
    try {
      await prisma.$executeRaw`TRUNCATE TABLE quizzes CASCADE`;
      console.log('  ✓ Cleared quizzes');
    } catch (err) {
      console.log('  - Skipped quizzes (table does not exist)');
    }

    await prisma.$executeRaw`TRUNCATE TABLE stories CASCADE`;
    console.log('  ✓ Cleared stories');

    console.log('\n✅ All related tables cleared successfully!');
    console.log('\n📊 Next step: Run seed script to populate database');
    console.log('   Command: npx prisma db seed');

  } catch (error) {
    console.error('❌ Error clearing tables:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
