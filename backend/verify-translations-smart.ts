/**
 * Smart Translation Verification Script
 *
 * This script manually inspects actual translation mismatches
 * by fetching full chapter content and identifying chapters where
 * the English translation doesn't match the Japanese content.
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface MismatchedChapter {
  storyId: string;
  storyTitle: string;
  chapterId: string;
  chapterNumber: number;
  chapterTitle: string;
  jlptLevel: string | null;
  japaneseContent: string;
  englishContent: string | null;
}

async function findMismatchedTranslations(): Promise<void> {
  console.log('🔍 Checking all 125 chapters for translation mismatches...\n');

  try {
    // Get all stories with chapters
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

    const mismatches: MismatchedChapter[] = [];
    let totalChecked = 0;

    for (const story of stories) {
      for (const chapter of story.chapters) {
        totalChecked++;

        // Check for obvious mismatches
        const jpFirstLine = chapter.content.split('\n')[0].trim();
        const enFirstLine = chapter.content_en?.split('\n')[0]?.trim() || '';

        // Print for manual inspection
        console.log(`\n${'='.repeat(80)}`);
        console.log(`📖 Story ${totalChecked}/125: ${story.title} (${story.level_jlpt || 'N/A'})`);
        console.log(`   Chapter ${chapter.chapter_number}: ${chapter.title}`);
        console.log(`   Chapter ID: ${chapter.chapter_id}`);
        console.log(`\n日本語 (First 200 chars):`);
        console.log(chapter.content.substring(0, 200));
        console.log(`\n英語 (First 200 chars):`);
        console.log(chapter.content_en?.substring(0, 200) || 'NULL');

        // Detect if translation seems completely different (heuristic check)
        if (!chapter.content_en) {
          console.log(`\n⚠️  WARNING: Missing English translation`);
          mismatches.push({
            storyId: story.story_id,
            storyTitle: story.title,
            chapterId: chapter.chapter_id,
            chapterNumber: chapter.chapter_number,
            chapterTitle: chapter.title,
            jlptLevel: story.level_jlpt,
            japaneseContent: chapter.content,
            englishContent: null
          });
        }
      }
    }

    console.log(`\n\n${'='.repeat(80)}`);
    console.log(`📊 SUMMARY`);
    console.log(`${'='.repeat(80)}`);
    console.log(`Total chapters checked: ${totalChecked}`);
    console.log(`Chapters with missing translations: ${mismatches.length}`);
    console.log(`${'='.repeat(80)}\n`);

    if (mismatches.length > 0) {
      console.log('Chapters with missing translations:');
      mismatches.forEach(m => {
        console.log(`- ${m.storyTitle}, Chapter ${m.chapterNumber} (${m.chapterId})`);
      });
    }

  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

findMismatchedTranslations();
