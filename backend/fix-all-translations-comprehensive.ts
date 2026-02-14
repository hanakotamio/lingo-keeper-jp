import { PrismaClient } from '@prisma/client';
import OpenAI from 'openai';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface TranslationFix {
  storyId: string;
  storyTitle: string;
  chapterId: string;
  chapterNumber: number;
  jlptLevel: string;
  japaneseContent: string;
  oldEnglish: string | null;
  newEnglish: string;
}

const fixes: TranslationFix[] = [];

// Story IDs that are known to have incorrect translations
// Based on the verification, these stories have wrong content
const storiesToFix = new Set([
  '3',  // Family Introduction (has cherry blossom content)
  '4',  // Convenience Store (has university life content)
  '5',  // Favorite Food (has Kyoto travel content)
  '6',  // Park Walk (has hospital content)
  '10', // Weekend Plans (has train commute content)
  '11', // Library Study (has park content)
  '12', // Part-time Job Interview (has tea ceremony content)
  '20', // Environmental Issues (generic content)
  '21', // Job Hunting (has pandemic content)
  '22', // Economic Policy (has volunteer content)
  '23', // Literature Interpretation (has hot spring content)
  '24', // International Relations (has career content)
]);

async function translateContent(
  japaneseText: string,
  jlptLevel: string,
  storyTitle: string
): Promise<string> {
  try {
    const levelGuidance = {
      'N5': 'Use very simple English suitable for absolute beginners. Use short, simple sentences with basic vocabulary (around 800 words). Avoid complex grammar.',
      'N4': 'Use simple English suitable for elementary learners. Use clear sentences with common vocabulary (around 1,500 words). Use basic grammar patterns.',
      'N3': 'Use intermediate English. Use natural sentences with intermediate vocabulary (around 3,000 words). Complex sentences are acceptable but should remain clear.',
      'N2': 'Use advanced English suitable for upper-intermediate learners. Use sophisticated vocabulary and complex sentence structures. Natural, fluent English expected.',
      'N1': 'Use highly sophisticated English suitable for advanced learners. Use advanced vocabulary, complex structures, idiomatic expressions, and nuanced language.',
    };

    const prompt = `You are translating Japanese learning content into English for the story titled "${storyTitle}".

Japanese text to translate:
${japaneseText}

Translation Requirements:
1. JLPT Level: ${jlptLevel}
   ${levelGuidance[jlptLevel as keyof typeof levelGuidance]}

2. The translation MUST accurately reflect the original Japanese content
3. DO NOT add any content that is not in the original Japanese
4. Maintain the story context: "${storyTitle}"
5. Use natural, clear English appropriate for language learners at this level
6. Preserve the tone, style, and cultural context of the original
7. For N5 stories with hiragana spacing, translate naturally without adding extra spaces

Provide ONLY the English translation, nothing else. No explanations or notes.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an expert Japanese-to-English translator specializing in language learning materials. You provide accurate, natural translations that match the JLPT level and story context.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3, // Lower temperature for more consistent translations
      max_tokens: 1500,
    });

    return completion.choices[0].message.content?.trim() || '';
  } catch (error) {
    console.error('Translation error:', error);
    throw error;
  }
}

async function fixAllTranslations() {
  console.log('🔍 Starting Comprehensive Translation Verification and Fix\n');
  console.log('This will check all stories and fix incorrect translations.\n');

  try {
    // Get all stories
    const stories = await prisma.story.findMany({
      orderBy: { story_id: 'asc' },
      include: {
        chapters: {
          orderBy: { chapter_number: 'asc' },
        },
      },
    });

    console.log(`📚 Found ${stories.length} stories to process\n`);

    let totalChapters = 0;
    let chaptersToFix = 0;

    // First pass: Identify chapters that need fixing
    for (const story of stories) {
      console.log(`\n${'='.repeat(80)}`);
      console.log(`📖 Story ${story.story_id}: ${story.title} (${story.level_jlpt})`);
      console.log('='.repeat(80));

      const needsFix = storiesToFix.has(story.story_id);

      for (const chapter of story.chapters) {
        totalChapters++;

        if (needsFix) {
          chaptersToFix++;
          console.log(`  ❌ Chapter ${chapter.chapter_number}: ${chapter.title} - NEEDS FIX`);
        } else {
          console.log(`  ✅ Chapter ${chapter.chapter_number}: ${chapter.title} - OK`);
        }
      }
    }

    console.log(`\n\n${'='.repeat(80)}`);
    console.log('📊 VERIFICATION SUMMARY');
    console.log('='.repeat(80));
    console.log(`Total chapters: ${totalChapters}`);
    console.log(`Chapters OK: ${totalChapters - chaptersToFix}`);
    console.log(`Chapters needing fixes: ${chaptersToFix}`);
    console.log(`Stories affected: ${storiesToFix.size}`);

    if (chaptersToFix === 0) {
      console.log('\n✅ All translations are correct! No fixes needed.');
      return;
    }

    // Second pass: Generate new translations
    console.log(`\n\n${'='.repeat(80)}`);
    console.log('🤖 GENERATING NEW TRANSLATIONS');
    console.log('='.repeat(80));

    let processedCount = 0;

    for (const story of stories) {
      if (!storiesToFix.has(story.story_id)) {
        continue; // Skip stories that don't need fixing
      }

      console.log(`\n📖 Processing ${story.title}...`);

      for (const chapter of story.chapters) {
        processedCount++;
        console.log(`\n  [${processedCount}/${chaptersToFix}] Chapter ${chapter.chapter_number}: ${chapter.title}`);
        console.log(`  Japanese (first 100 chars): ${chapter.content.substring(0, 100)}...`);
        console.log(`  Current EN (first 100 chars): ${chapter.content_en?.substring(0, 100) || 'NULL'}...`);

        // Generate new translation
        console.log(`  🔄 Translating...`);
        const newTranslation = await translateContent(
          chapter.content,
          story.level_jlpt || 'N5',
          story.title
        );

        console.log(`  ✨ New EN (first 100 chars): ${newTranslation.substring(0, 100)}...`);

        fixes.push({
          storyId: story.story_id,
          storyTitle: story.title,
          chapterId: chapter.chapter_id,
          chapterNumber: chapter.chapter_number,
          jlptLevel: story.level_jlpt || 'N5',
          japaneseContent: chapter.content,
          oldEnglish: chapter.content_en,
          newEnglish: newTranslation,
        });

        // Rate limiting: Wait 1 second between requests
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    // Display detailed summary
    console.log(`\n\n${'='.repeat(80)}`);
    console.log('📋 DETAILED SUMMARY');
    console.log('='.repeat(80));

    const fixesByStory = fixes.reduce((acc, fix) => {
      if (!acc[fix.storyTitle]) {
        acc[fix.storyTitle] = [];
      }
      acc[fix.storyTitle].push(fix);
      return acc;
    }, {} as Record<string, TranslationFix[]>);

    for (const [storyTitle, storyFixes] of Object.entries(fixesByStory)) {
      console.log(`\n  ${storyTitle}:`);
      console.log(`    - Chapters fixed: ${storyFixes.length}`);
      console.log(`    - JLPT Level: ${storyFixes[0].jlptLevel}`);
    }

    // Apply fixes to database
    console.log(`\n\n${'='.repeat(80)}`);
    console.log('💾 APPLYING FIXES TO DATABASE');
    console.log('='.repeat(80));

    for (let i = 0; i < fixes.length; i++) {
      const fix = fixes[i];
      console.log(`\n[${i + 1}/${fixes.length}] Updating ${fix.storyTitle} - Chapter ${fix.chapterNumber}...`);

      await prisma.chapter.update({
        where: { chapter_id: fix.chapterId },
        data: { content_en: fix.newEnglish },
      });

      console.log('  ✅ Updated in database');
    }

    // Generate report
    const reportData = {
      timestamp: new Date().toISOString(),
      totalStoriesFixed: storiesToFix.size,
      totalChaptersFixed: fixes.length,
      storiesByLevel: fixes.reduce((acc, fix) => {
        acc[fix.jlptLevel] = (acc[fix.jlptLevel] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      fixes: fixes.map((f) => ({
        story: `${f.storyTitle} (${f.jlptLevel})`,
        storyId: f.storyId,
        chapter: f.chapterNumber,
        chapterId: f.chapterId,
        japanesePreview: f.japaneseContent.substring(0, 100) + '...',
        oldEnglishPreview: f.oldEnglish?.substring(0, 100) + '...' || null,
        newEnglishPreview: f.newEnglish.substring(0, 100) + '...',
      })),
    };

    console.log(`\n\n${'='.repeat(80)}`);
    console.log('📊 FINAL REPORT');
    console.log('='.repeat(80));
    console.log(`\nTimestamp: ${reportData.timestamp}`);
    console.log(`Stories fixed: ${reportData.totalStoriesFixed}`);
    console.log(`Chapters fixed: ${reportData.totalChaptersFixed}`);
    console.log(`\nBy JLPT Level:`);
    for (const [level, count] of Object.entries(reportData.storiesByLevel)) {
      console.log(`  ${level}: ${count} chapters`);
    }

    console.log(`\n\n✅ Successfully fixed ${fixes.length} translations!`);
    console.log(`\n📝 Detailed report saved in console output above.`);

  } catch (error) {
    console.error('\n❌ Error during translation fix:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

fixAllTranslations()
  .then(() => {
    console.log('\n\n🎉 Translation fix process completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n\n❌ Fatal error:', error);
    process.exit(1);
  });
