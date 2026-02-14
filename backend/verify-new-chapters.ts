import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const prisma = new PrismaClient();

async function verifyNewChapters() {
  console.log('=== Verification: Sample of Newly Added Chapters ===\n');

  // Sample chapters from different levels
  const sampleChapterIds = [
    'chapter-2-5',  // N5
    'chapter-8-4',  // N4
    'chapter-13-5', // N3
    'chapter-19-5', // N2
    'chapter-25-5'  // N1
  ];

  for (const chapterId of sampleChapterIds) {
    const chapter = await prisma.chapter.findUnique({
      where: { chapter_id: chapterId }
    });

    if (chapter) {
      const contentPreview = chapter.content.substring(0, 100);
      const vocabWords = (chapter.vocabulary as any).words;

      console.log(`Chapter ID: ${chapter.chapter_id}`);
      console.log(`Story ID: ${chapter.story_id}`);
      console.log(`Title: ${chapter.title}`);
      console.log(`Content: ${contentPreview}...`);
      console.log(`Learning Points: ${JSON.stringify(chapter.learning_points, null, 2)}`);
      console.log(`Vocabulary Count: ${vocabWords.length} words`);
      console.log('---\n');
    }
  }

  await prisma.$disconnect();
}

verifyNewChapters();
