import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixNullLevels() {
  console.log('Checking for stories with null levels...');

  try {
    // Find stories with null level_jlpt or level_cefr
    const stories = await prisma.$queryRaw`
      SELECT story_id, title, level_jlpt, level_cefr
      FROM stories
      WHERE level_jlpt IS NULL OR level_cefr IS NULL
    `;

    console.log('Stories with null levels:', stories);

    // Update Story 10 if it has null levels
    const story10 = await prisma.$queryRaw`
      SELECT * FROM stories WHERE story_id = '10'
    `;

    console.log('Story 10:', story10);

    // Delete Story 10 if it exists with null levels and recreate it properly
    await prisma.$executeRaw`
      DELETE FROM stories WHERE story_id = '10' AND (level_jlpt IS NULL OR level_cefr IS NULL)
    `;

    console.log('✓ Deleted Story 10 with null levels');

    // Recreate Story 10 with proper values
    await prisma.story.create({
      data: {
        story_id: '10',
        title: '朝のあいさつ',
        description: '学校での朝のあいさつを学びます。友達や先生との自然な会話を体験しましょう。',
        level_jlpt: 'N5',
        level_cefr: 'A1',
        estimated_time: 5,
        root_chapter_id: 'ch-10-1',
      },
    });

    console.log('✓ Recreated Story 10 with proper levels');

    // Verify
    const updatedStory = await prisma.story.findUnique({
      where: { story_id: '10' },
    });

    console.log('Updated Story 10:', updatedStory);

    console.log('\n✅ Fixed null levels!');
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

fixNullLevels()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
