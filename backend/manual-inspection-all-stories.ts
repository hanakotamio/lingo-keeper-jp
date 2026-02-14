/**
 * Manual Inspection of All Story Translations
 *
 * This script prints out Japanese and English content side-by-side
 * for manual review of all 125 chapters.
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

interface StoryData {
  storyNumber: number;
  storyId: string;
  storyTitle: string;
  jlptLevel: string | null;
  chapters: ChapterData[];
}

interface ChapterData {
  chapterNumber: number;
  chapterId: string;
  chapterTitle: string;
  japanese: string;
  english: string | null;
}

async function inspectAllStories(): Promise<void> {
  console.log('📋 Generating complete translation inspection report...\n');

  try {
    const stories = await prisma.story.findMany({
      include: {
        chapters: {
          orderBy: {
            chapter_number: 'asc'
          }
        }
      },
      orderBy: {
        title: 'asc'
      }
    });

    let reportContent = '# Complete Translation Inspection Report\n\n';
    reportContent += `Total Stories: ${stories.length}\n`;
    reportContent += `Total Chapters: ${stories.reduce((sum, s) => sum + s.chapters.length, 0)}\n`;
    reportContent += `Generated: ${new Date().toISOString()}\n\n`;
    reportContent += '=' + '='.repeat(100) + '\n\n';

    let storyCount = 0;

    for (const story of stories) {
      storyCount++;

      reportContent += `## Story ${storyCount}: ${story.title}\n`;
      reportContent += `- JLPT Level: ${story.level_jlpt || 'N/A'}\n`;
      reportContent += `- Story ID: ${story.story_id}\n`;
      reportContent += `- Chapters: ${story.chapters.length}\n\n`;

      for (const chapter of story.chapters) {
        reportContent += `### Chapter ${chapter.chapter_number}: ${chapter.title}\n`;
        reportContent += `Chapter ID: ${chapter.chapter_id}\n\n`;

        reportContent += `**日本語:**\n\`\`\`\n${chapter.content}\n\`\`\`\n\n`;

        reportContent += `**English:**\n\`\`\`\n${chapter.content_en || 'NULL - MISSING TRANSLATION'}\n\`\`\`\n\n`;

        // Quick check for obvious mismatch
        const jpKeywords = extractKeywords(chapter.content);
        const enKeywords = extractEnglishKeywords(chapter.content_en || '');

        reportContent += `**Keywords:**\n`;
        reportContent += `- Japanese: ${jpKeywords.slice(0, 10).join(', ')}\n`;
        reportContent += `- English: ${enKeywords.slice(0, 10).join(', ')}\n\n`;

        reportContent += '-'.repeat(80) + '\n\n';
      }

      reportContent += '\n' + '='.repeat(100) + '\n\n';
    }

    const reportPath = '/home/hanakotamio0705/Lingo Keeper JP/backend/TRANSLATION_INSPECTION_FULL.md';
    fs.writeFileSync(reportPath, reportContent);

    console.log(`✅ Full inspection report saved to: ${reportPath}`);
    console.log(`   Total stories: ${storyCount}`);
    console.log(`   Total chapters: ${stories.reduce((sum, s) => sum + s.chapters.length, 0)}`);

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

function extractKeywords(text: string): string[] {
  const keywords = new Set<string>();

  // Common Japanese words to look for
  const patterns = [
    /猫|ねこ|ネコ/g,
    /犬|いぬ|イヌ/g,
    /公園|こうえん/g,
    /学校|がっこう/g,
    /電車|でんしゃ/g,
    /図書館|としょかん/g,
    /レストラン/g,
    /会社|かいしゃ/g,
    /友達|ともだち/g,
    /家族|かぞく/g,
    /先生|せんせい/g,
    /学生|がくせい/g,
  ];

  for (const pattern of patterns) {
    const matches = text.match(pattern);
    if (matches) {
      keywords.add(matches[0]);
    }
  }

  return Array.from(keywords);
}

function extractEnglishKeywords(text: string): string[] {
  const keywords = new Set<string>();
  const textLower = text.toLowerCase();

  const patterns = [
    'cat', 'dog', 'park', 'school', 'train', 'library',
    'restaurant', 'company', 'friend', 'family', 'teacher',
    'student', 'morning', 'evening', 'night', 'house', 'home'
  ];

  for (const word of patterns) {
    if (textLower.includes(word)) {
      keywords.add(word);
    }
  }

  return Array.from(keywords);
}

inspectAllStories();
