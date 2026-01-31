/**
 * Fix null level_jlpt and level_cefr values in stories table
 * This script updates or deletes stories with null values
 */

import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

// Load environment variables from ../.env.local
dotenv.config({ path: '../.env.local' });

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Checking for stories with null level_jlpt or level_cefr...');

  try {
    // Find stories with null values using raw SQL
    const storiesWithNull: any[] = await prisma.$queryRaw`
      SELECT story_id, title, level_jlpt, level_cefr
      FROM stories
      WHERE level_jlpt IS NULL OR level_cefr IS NULL
    `;

    if (storiesWithNull.length === 0) {
      console.log('✅ No stories with null values found!');
      return;
    }

    console.log(`⚠️  Found ${storiesWithNull.length} stories with null values:`);
    storiesWithNull.forEach((story) => {
      console.log(`  - ${story.story_id}: "${story.title}" (JLPT: ${story.level_jlpt}, CEFR: ${story.level_cefr})`);
    });

    // Delete stories with null values using Prisma (CASCADE will handle related records)
    console.log('\n🗑️  Deleting stories with null values...');

    let deletedCount = 0;
    for (const story of storiesWithNull) {
      try {
        await prisma.story.delete({
          where: { story_id: story.story_id },
        });
        deletedCount++;
        console.log(`  ✓ Deleted: ${story.title}`);
      } catch (err) {
        console.log(`  ✗ Failed to delete: ${story.title} - ${err instanceof Error ? err.message : String(err)}`);
      }
    }

    console.log(`✅ Deleted ${deletedCount} stories with null values`);

    // Verify the fix
    const remainingNull: any[] = await prisma.$queryRaw`
      SELECT COUNT(*) as count
      FROM stories
      WHERE level_jlpt IS NULL OR level_cefr IS NULL
    `;

    if (Number(remainingNull[0].count) === 0) {
      console.log('✅ All null values have been removed!');
    } else {
      console.log(`⚠️  Still ${remainingNull[0].count} stories with null values remaining`);
    }

    // Show remaining stories count
    const totalStories = await prisma.story.count();
    console.log(`\n📊 Total stories in database: ${totalStories}`);
  } catch (error) {
    console.error('❌ Error fixing null stories:', error);
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
