/**
 * Reset database and seed with valid data
 * This script clears all tables and re-seeds the database
 */

import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

// Load environment variables from ../.env.local
dotenv.config({ path: '../.env.local' });

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Resetting database and seeding with valid data...');

  try {
    // Delete all data in reverse dependency order
    console.log('\n🗑️  Clearing all tables...');

    await prisma.quizResult.deleteMany({});
    console.log('  ✓ Cleared quiz_results');

    await prisma.userProgress.deleteMany({});
    console.log('  ✓ Cleared user_progress');

    await prisma.quizChoice.deleteMany({});
    console.log('  ✓ Cleared quiz_choices');

    await prisma.quiz.deleteMany({});
    console.log('  ✓ Cleared quizzes');

    await prisma.choice.deleteMany({});
    console.log('  ✓ Cleared choices');

    await prisma.chapter.deleteMany({});
    console.log('  ✓ Cleared chapters');

    await prisma.story.deleteMany({});
    console.log('  ✓ Cleared stories');

    console.log('\n✅ All tables cleared successfully!');

    // Now run the seed script
    console.log('\n🌱 Running seed script...');
    console.log('Please run: npx prisma db seed');

  } catch (error) {
    console.error('❌ Error resetting database:', error);
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
