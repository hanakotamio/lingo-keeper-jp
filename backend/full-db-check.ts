import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fullCheck() {
  try {
    const totalStories = await prisma.story.count();
    const totalChapters = await prisma.chapter.count();
    const totalQuizzes = await prisma.quiz.count();

    console.log(`📊 Database Counts:`);
    console.log(`  Stories: ${totalStories}`);
    console.log(`  Chapters: ${totalChapters}`);
    console.log(`  Quizzes: ${totalQuizzes}`);

    // Get all story IDs and titles
    const allStories = await prisma.story.findMany({
      select: {
        story_id: true,
        title: true,
      },
      orderBy: { title: 'asc' },
    });

    console.log(`\n📚 All Stories (${allStories.length}):`);
    for (const story of allStories) {
      // Count chapters for each
      const chapterCount = await prisma.chapter.count({
        where: { story_id: story.story_id },
      });
      console.log(`  ${story.title}: ${chapterCount} chapters (${story.story_id})`);
    }

    // Sample a few chapters
    const sampleChapters = await prisma.chapter.findMany({
      take: 3,
      include: {
        choices: true,
      },
    });

    console.log(`\n📖 Sample Chapters:`);
    for (const ch of sampleChapters) {
      console.log(`\nChapter: ${ch.title}`);
      console.log(`  Story ID: ${ch.story_id}`);
      console.log(`  Chapter #: ${ch.chapter_number}`);
      console.log(`  Content: ${ch.content.substring(0, 80)}...`);
      console.log(`  Choices: ${ch.choices.length}`);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fullCheck();
