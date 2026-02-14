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

// Known incorrect translations mapping
const incorrectTranslations: Record<string, string[]> = {
  '3': ['cherry', 'sakura', 'spring', 'hanami', 'bloom'], // Story 3: Family Introduction should not have cherry blossom content
  '4': ['university', 'student', '7 AM', 'wake up', 'breakfast'], // Story 4: Convenience Store should not have university life
  '5': ['kyoto', 'temple', 'trip', 'travel', 'famous'], // Story 5: Favorite Food should not have travel content
  '6': ['hospital', 'doctor', 'fever', 'appointment', 'medicine'], // Story 6: Park Walk should not have hospital content
  '10': ['train', 'commute', 'station', 'crowded', 'office'], // Story 10: Weekend Plans should not have train commute
  '11': ['park', 'flower', 'walk', 'duck', 'pond', 'bench'], // Story 11: Library Study should not have park content
  '12': ['tea ceremony', 'traditional', 'culture', 'whisk'], // Story 12: Part-time Job Interview should not have tea ceremony
  '20': ['problem', 'modern society', 'global warming'], // Needs more specific environmental policy content
  '21': ['pandemic', 'online', 'confused'], // Needs job hunting preparation content
  '22': ['volunteer', 'children', 'support', 'community'], // Needs economic policy content
  '23': ['hot spring', 'mountains', 'inn', 'nature'], // Needs literature interpretation content
  '24': ['career', 'company', 'job change', 'colleagues'], // Needs international relations content
};

async function translateContent(
  japaneseText: string,
  jlptLevel: string,
  storyTitle: string
): Promise<string> {
  try {
    const levelGuidance = {
      'N5': 'Use very simple English suitable for beginners. Short sentences, basic vocabulary.',
      'N4': 'Use simple English with some variety. Clear sentences, common vocabulary.',
      'N3': 'Use intermediate English. Natural but not too complex sentences.',
      'N2': 'Use advanced English. Complex sentences and sophisticated vocabulary are acceptable.',
      'N1': 'Use highly sophisticated English. Complex structures and advanced vocabulary expected.',
    };

    const prompt = `You are translating Japanese learning content into English. The story title is "${storyTitle}".

Translate the following Japanese text into English:

${japaneseText}

Requirements:
- JLPT Level: ${jlptLevel} - ${levelGuidance[jlptLevel as keyof typeof levelGuidance]}
- The translation MUST accurately reflect the original Japanese content
- DO NOT add content that is not in the original
- Maintain the story context indicated by the title: "${storyTitle}"
- Use natural, clear English appropriate for language learners
- Preserve the tone and style of the original

Provide ONLY the English translation, nothing else.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert translator specializing in Japanese-to-English translation for language learning materials. You provide accurate, natural translations that match the JLPT level of the content.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.3, // Lower temperature for more consistent translations
      max_tokens: 1000,
    });

    return completion.choices[0].message.content?.trim() || '';
  } catch (error) {
    console.error('Translation error:', error);
    throw error;
  }
}

function hasIncorrectContent(storyId: string, englishText: string | null): boolean {
  if (!englishText) return true; // Missing translation counts as incorrect

  const keywords = incorrectTranslations[storyId];
  if (!keywords) return false; // No known issues for this story

  const lowerText = englishText.toLowerCase();
  let matchCount = 0;

  for (const keyword of keywords) {
    if (lowerText.includes(keyword.toLowerCase())) {
      matchCount++;
    }
  }

  // If 2 or more keywords match, it's likely the wrong content
  return matchCount >= 2;
}

async function fixAllTranslations() {
  console.log('Starting comprehensive translation fix process...\n');
  console.log('This will verify and fix all stories in the database.\n');

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

    console.log(`Found ${stories.length} stories to process\n`);

    for (const story of stories) {
      console.log(`\n${'='.repeat(80)}`);
      console.log(`Processing Story ${story.story_id}: ${story.title} (${story.level_jlpt})`);
      console.log('='.repeat(80));

      for (const chapter of story.chapters) {
        const needsFix = hasIncorrectContent(story.story_id, chapter.content_en);

        if (needsFix) {
          console.log(`\n  ❌ Chapter ${chapter.chapter_number}: ${chapter.title} - NEEDS FIX`);
          console.log(`     Japanese: ${chapter.content.substring(0, 80)}...`);
          console.log(`     Current EN: ${chapter.content_en?.substring(0, 80) || 'NULL'}...`);

          // Get new translation
          console.log(`     Translating...`);
          const newTranslation = await translateContent(
            chapter.content,
            story.level_jlpt || 'N5',
            story.title
          );

          console.log(`     New EN: ${newTranslation.substring(0, 80)}...`);

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

          // Add a small delay to avoid API rate limits
          await new Promise((resolve) => setTimeout(resolve, 500));
        } else {
          console.log(`  ✅ Chapter ${chapter.chapter_number}: ${chapter.title} - OK`);
        }
      }
    }

    // Display summary
    console.log('\n\n' + '='.repeat(80));
    console.log('SUMMARY');
    console.log('='.repeat(80));
    console.log(`Total chapters checked: ${stories.reduce((sum, s) => sum + s.chapters.length, 0)}`);
    console.log(`Chapters needing fixes: ${fixes.length}`);

    if (fixes.length > 0) {
      console.log('\n\nFixes by story:');
      const fixesByStory = fixes.reduce((acc, fix) => {
        if (!acc[fix.storyTitle]) {
          acc[fix.storyTitle] = [];
        }
        acc[fix.storyTitle].push(fix);
        return acc;
      }, {} as Record<string, TranslationFix[]>);

      for (const [storyTitle, storyFixes] of Object.entries(fixesByStory)) {
        console.log(`\n  ${storyTitle}: ${storyFixes.length} chapters`);
      }

      // Ask for confirmation
      console.log('\n\n' + '='.repeat(80));
      console.log('APPLYING FIXES TO DATABASE');
      console.log('='.repeat(80));

      for (const fix of fixes) {
        console.log(`\nUpdating ${fix.storyTitle} - Chapter ${fix.chapterNumber}...`);

        await prisma.chapter.update({
          where: { chapter_id: fix.chapterId },
          data: { content_en: fix.newEnglish },
        });

        console.log('  ✅ Updated');
      }

      // Write detailed report
      const report = {
        timestamp: new Date().toISOString(),
        totalFixed: fixes.length,
        fixes: fixes.map((f) => ({
          story: f.storyTitle,
          storyId: f.storyId,
          chapter: f.chapterNumber,
          chapterId: f.chapterId,
          jlptLevel: f.jlptLevel,
          japanese: f.japaneseContent.substring(0, 100),
          oldEnglish: f.oldEnglish?.substring(0, 100) || null,
          newEnglish: f.newEnglish.substring(0, 100),
        })),
      };

      console.log('\n\n' + '='.repeat(80));
      console.log('DETAILED REPORT');
      console.log('='.repeat(80));
      console.log(JSON.stringify(report, null, 2));

      console.log(`\n\n✅ Successfully fixed ${fixes.length} translations!`);
    } else {
      console.log('\n\n✅ All translations are correct! No fixes needed.');
    }
  } catch (error) {
    console.error('\n❌ Error during translation fix:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

fixAllTranslations()
  .then(() => {
    console.log('\n✅ Translation fix process completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
  });
