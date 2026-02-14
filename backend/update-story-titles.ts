import prisma from './src/lib/db.js';

/**
 * Update Story titles and descriptions to Japanese
 * Chapters and choices are already in Japanese, but Story metadata is in English
 */
async function updateStoryTitles() {
  console.log('Updating Story titles and descriptions to Japanese...\n');

  try {
    // Story 1: Shopping at the Supermarket
    await prisma.story.update({
      where: { story_id: '1' },
      data: {
        title: 'スーパーで買い物',
        description: '日本語の基本的な買い物の語彙と表現を学びます。',
      },
    });
    console.log('✅ Story 1: スーパーで買い物');

    // Story 2: My Morning Routine
    await prisma.story.update({
      where: { story_id: '2' },
      data: {
        title: '私の朝のルーティン',
        description: '日常生活の語彙と時間表現を学びます。',
      },
    });
    console.log('✅ Story 2: 私の朝のルーティン');

    // Story 3: Eating at a Restaurant
    await prisma.story.update({
      where: { story_id: '3' },
      data: {
        title: 'レストランで食事',
        description: 'レストランでの注文方法と会話を学びます。',
      },
    });
    console.log('✅ Story 3: レストランで食事');

    // Story 4: Taking the Train
    await prisma.story.update({
      where: { story_id: '4' },
      data: {
        title: '電車に乗る',
        description: '日本語の電車システムの語彙を学びます。',
      },
    });
    console.log('✅ Story 4: 電車に乗る');

    // Story 5: Convenience Store Visit
    await prisma.story.update({
      where: { story_id: '5' },
      data: {
        title: 'コンビニで買い物',
        description: '日本のコンビニエンスストアで買い物をします。',
      },
    });
    console.log('✅ Story 5: コンビニで買い物');

    console.log('\n✅ All story titles and descriptions updated to Japanese!');
  } catch (error) {
    console.error('❌ Error updating story titles:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

updateStoryTitles();
