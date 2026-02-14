import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

// Load .env.local file
dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

async function checkChapterCounts() {
  try {
    const stories = await prisma.story.findMany({
      orderBy: { story_id: 'asc' }
    });

    console.log('Chapter counts by story:\n');
    for (const story of stories) {
      const chapters = await prisma.chapter.findMany({
        where: { story_id: story.story_id },
        orderBy: { chapter_number: 'asc' }
      });
      console.log(`Story ${story.story_id}: ${story.title} (${story.level_jlpt}) - ${chapters.length} chapters`);
    }

    // Get one sample chapter to see structure
    const sample = await prisma.chapter.findFirst();
    if (sample) {
      console.log('\nSample chapter structure:');
      console.log(JSON.stringify(sample, null, 2));
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkChapterCounts();
