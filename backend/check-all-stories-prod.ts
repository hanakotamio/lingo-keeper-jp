import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://neondb_owner:npg_9zkXoHEsC8PQ@ep-morning-sky-a1dv4mjd-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
    }
  }
});

async function checkAllStories() {
  console.log('=== Production Database Story Check ===\n');

  try {
    const stories = await prisma.story.findMany({
      orderBy: { story_id: 'asc' }
    });

    console.log(`Total Stories: ${stories.length}\n`);

    if (stories.length === 0) {
      console.log('No stories found in database.\n');
      return;
    }

    console.log('Stories in database:');
    stories.forEach((story, index) => {
      console.log(`${index + 1}. Story ID: ${story.story_id}`);
      console.log(`   Title: ${story.title}`);
      console.log(`   JLPT Level: ${story.level_jlpt || 'N/A'}`);
      console.log(`   CEFR Level: ${story.level_cefr || 'N/A'}`);
      console.log(`   Category: ${story.category}`);
      console.log(`   Difficulty: ${story.difficulty_level}`);
      console.log(`   Root Chapter ID: ${story.root_chapter_id || 'None'}`);
      console.log();
    });

    // Check chapters for each story
    console.log('=== Chapter Counts ===\n');
    for (const story of stories) {
      const chapters = await prisma.chapter.findMany({
        where: { story_id: story.story_id },
        orderBy: { chapter_number: 'asc' }
      });

      console.log(`Story ${story.story_id} "${story.title}": ${chapters.length} chapters`);
      chapters.forEach(ch => {
        console.log(`  - Chapter ${ch.chapter_number}: ${ch.chapter_id}`);
      });
      console.log();
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAllStories();
