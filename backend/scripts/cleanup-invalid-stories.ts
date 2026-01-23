import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanupInvalidStories() {
  console.log('\n========================================');
  console.log('🧹 Story Cleanup: Remove NULL level_jlpt');
  console.log('========================================\n');

  try {
    // Find stories with empty or NULL level_jlpt using raw query
    console.log('🔍 Searching for stories with empty or invalid level_jlpt...\n');

    const rawResults = await prisma.$queryRaw<
      Array<{
        story_id: string;
        title: string;
        level_jlpt: string | null;
        description: string;
        level_cefr: string;
      }>
    >`SELECT story_id, title, level_jlpt, description, level_cefr FROM stories WHERE level_jlpt IS NULL OR level_jlpt = '' OR trim(level_jlpt) = ''`;

    if (!rawResults || rawResults.length === 0) {
      console.log('✅ No stories with NULL or empty level_jlpt found!\n');
      console.log('📊 Database Status:');
      const totalStories = await prisma.story.count();
      console.log(`   Total stories: ${totalStories}`);
      return;
    }

    // Display found stories
    console.log(`⚠️  Found ${rawResults.length} story(ies) with invalid level_jlpt:\n`);

    const storyIds: string[] = [];
    const storyTitles: Record<string, string> = {};

    rawResults.forEach((story, index) => {
      storyIds.push(story.story_id);
      storyTitles[story.story_id] = story.title;

      console.log(`${index + 1}. Story ID: ${story.story_id}`);
      console.log(`   Title: ${story.title}`);
      console.log(`   Level JLPT: ${story.level_jlpt || 'NULL/EMPTY'}`);
      console.log(`   Level CEFR: ${story.level_cefr}`);
      console.log();
    });

    // Count related data
    console.log('📈 Related Data:\n');
    let totalChapters = 0;
    let totalQuizzes = 0;

    for (const storyId of storyIds) {
      const chapters = await prisma.chapter.count({
        where: { story_id: storyId },
      });

      const quizzes = await prisma.quiz.count({
        where: { story_id: storyId },
      });

      totalChapters += chapters;
      totalQuizzes += quizzes;
    }

    console.log(`   Total chapters to be deleted: ${totalChapters}`);
    console.log(`   Total quizzes to be deleted: ${totalQuizzes}`);
    console.log();

    // Check for --confirm flag
    const confirmFlag = process.argv.includes('--confirm');

    if (!confirmFlag) {
      console.log('⚠️  Run with --confirm flag to proceed with deletion:');
      console.log('   npx tsx scripts/cleanup-invalid-stories.ts --confirm\n');
      return;
    }

    console.log('✅ --confirm flag detected. Proceeding with deletion...\n');

    // Delete the stories
    console.log('🗑️  Deleting stories...\n');

    let deletedCount = 0;
    let totalChaptersDeleted = 0;
    let totalQuizzesDeleted = 0;

    for (const storyId of storyIds) {
      const chapters = await prisma.chapter.count({
        where: { story_id: storyId },
      });

      const quizzes = await prisma.quiz.count({
        where: { story_id: storyId },
      });

      // Delete chapters (which will cascade delete choices)
      await prisma.$executeRaw`DELETE FROM chapters WHERE story_id = ${storyId}`;

      // Delete quizzes (which will cascade delete quiz_choices and quiz_results)
      await prisma.$executeRaw`DELETE FROM quizzes WHERE story_id = ${storyId}`;

      // Delete story
      await prisma.$executeRaw`DELETE FROM stories WHERE story_id = ${storyId}`;

      deletedCount++;
      totalChaptersDeleted += chapters;
      totalQuizzesDeleted += quizzes;

      console.log(`✅ Deleted: ${storyTitles[storyId]} (ID: ${storyId})`);
    }

    console.log('\n========================================');
    console.log('🎉 Cleanup Complete!');
    console.log('========================================');
    console.log(`Stories deleted: ${deletedCount}`);
    console.log(`Chapters deleted: ${totalChaptersDeleted}`);
    console.log(`Quizzes deleted: ${totalQuizzesDeleted}`);
    console.log();

    // Display remaining stories
    console.log('📊 Remaining Stories:');
    const remainingStories = await prisma.story.findMany({
      orderBy: { level_jlpt: 'asc' },
      select: {
        story_id: true,
        title: true,
        level_jlpt: true,
        level_cefr: true,
      },
    });

    if (remainingStories.length === 0) {
      console.log('   (No stories in database)\n');
    } else {
      remainingStories.forEach((story) => {
        console.log(`   - ${story.title}`);
        console.log(`     ID: ${story.story_id} | JLPT: ${story.level_jlpt} | CEFR: ${story.level_cefr}`);
      });
      console.log();
    }

    console.log(`✨ Total remaining stories: ${remainingStories.length}\n`);
  } catch (error) {
    console.error('\n❌ Error during cleanup:');
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupInvalidStories().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
