import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkAllTranslations() {
  console.log('Checking all story translations...\n');

  try {
    const stories = await prisma.story.findMany({
      orderBy: { story_id: 'asc' },
      include: {
        chapters: {
          orderBy: { chapter_number: 'asc' }
        }
      }
    });

    console.log(`Total stories: ${stories.length}\n`);

    for (const story of stories) {
      console.log(`\n${'='.repeat(80)}`);
      console.log(`Story ID: ${story.story_id}`);
      console.log(`Title: ${story.title}`);
      console.log(`JLPT Level: ${story.level_jlpt}`);
      console.log(`Total Chapters: ${story.chapters.length}`);
      console.log('='.repeat(80));

      for (const chapter of story.chapters) {
        console.log(`\n  Chapter ${chapter.chapter_number}: ${chapter.title}`);
        console.log(`  Chapter ID: ${chapter.chapter_id}`);
        console.log(`\n  Japanese Content (first 200 chars):`);
        console.log(`  ${chapter.content.substring(0, 200)}...`);
        console.log(`\n  English Translation (first 200 chars):`);
        if (chapter.content_en) {
          console.log(`  ${chapter.content_en.substring(0, 200)}...`);
        } else {
          console.log(`  ❌ NULL - No translation`);
        }
        console.log(`  ${'-'.repeat(76)}`);
      }
    }

  } catch (error) {
    console.error('Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

checkAllTranslations()
  .then(() => {
    console.log('\n✅ Check completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error:', error);
    process.exit(1);
  });
