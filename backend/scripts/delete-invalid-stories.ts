import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function deleteInvalidStories() {
  console.log('Deleting stories with null levels...');

  try {
    // Delete all stories with null level_jlpt or level_cefr
    const result = await prisma.$executeRaw`
      DELETE FROM stories
      WHERE level_jlpt IS NULL OR level_cefr IS NULL
    `;

    console.log(`✓ Deleted ${result} invalid stories`);

    // Verify no stories with null levels remain
    const remainingInvalid = await prisma.$queryRaw`
      SELECT story_id, title, level_jlpt, level_cefr
      FROM stories
      WHERE level_jlpt IS NULL OR level_cefr IS NULL
    `;

    console.log('Remaining invalid stories:', remainingInvalid);

    // Count total stories
    const totalStories = await prisma.story.count();
    console.log(`Total stories in database: ${totalStories}`);

    console.log('\n✅ Cleanup complete!');
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

deleteInvalidStories()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
