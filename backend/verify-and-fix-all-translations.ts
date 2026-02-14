/**
 * Translation Verification and Fixing Script
 *
 * This script:
 * 1. Checks all 125 chapters across 25 stories
 * 2. Compares Japanese content with English translation
 * 3. Identifies mismatches and incorrect translations
 * 4. Generates correct translations based on JLPT level
 * 5. Applies fixes to the database
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface TranslationIssue {
  storyId: string;
  storyTitle: string;
  chapterId: string;
  chapterNumber: number;
  chapterTitle: string;
  jlptLevel: string | null;
  japaneseContent: string;
  currentTranslation: string | null;
  issue: string;
  suggestedFix?: string;
}

interface TranslationReport {
  totalStories: number;
  totalChapters: number;
  checkedChapters: number;
  issuesFound: TranslationIssue[];
  fixedChapters: number;
}

/**
 * Generate appropriate English translation based on JLPT level
 */
function generateTranslation(japaneseContent: string, jlptLevel: string | null): string {
  const level = jlptLevel || 'N5';

  // This is a placeholder - in production, you would use an AI translation service
  // For now, we'll mark it for manual review
  return `[NEEDS REVIEW - ${level}] ${japaneseContent}`;
}

/**
 * Check if translation matches Japanese content semantically
 */
function checkTranslationMatch(japanese: string, english: string | null): {
  isValid: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  if (!english) {
    issues.push('Missing English translation');
    return { isValid: false, issues };
  }

  if (english.trim() === '') {
    issues.push('Empty English translation');
    return { isValid: false, issues };
  }

  // Check for common keywords that should appear in both
  const keywordPairs = [
    { jp: ['猫', 'ねこ', 'ネコ'], en: ['cat'] },
    { jp: ['犬', 'いぬ', 'イヌ'], en: ['dog'] },
    { jp: ['木', 'き'], en: ['tree', 'wood'] },
    { jp: ['公園', 'こうえん'], en: ['park'] },
    { jp: ['散歩', 'さんぽ'], en: ['walk', 'stroll'] },
    { jp: ['家', 'いえ', 'うち'], en: ['house', 'home'] },
    { jp: ['学校', 'がっこう'], en: ['school'] },
    { jp: ['友達', 'ともだち'], en: ['friend'] },
    { jp: ['先生', 'せんせい'], en: ['teacher'] },
    { jp: ['学生', 'がくせい'], en: ['student'] },
    { jp: ['本', 'ほん'], en: ['book'] },
    { jp: ['食べる', 'たべる'], en: ['eat'] },
    { jp: ['飲む', 'のむ'], en: ['drink'] },
    { jp: ['見る', 'みる'], en: ['see', 'look', 'watch'] },
    { jp: ['行く', 'いく'], en: ['go'] },
    { jp: ['来る', 'くる'], en: ['come'] },
    { jp: ['朝', 'あさ'], en: ['morning'] },
    { jp: ['昼', 'ひる'], en: ['noon', 'day'] },
    { jp: ['夜', 'よる'], en: ['night', 'evening'] },
    { jp: ['雨', 'あめ'], en: ['rain'] },
    { jp: ['天気', 'てんき'], en: ['weather'] },
  ];

  const englishLower = english.toLowerCase();

  for (const pair of keywordPairs) {
    const hasJapanese = pair.jp.some(jp => japanese.includes(jp));
    const hasEnglish = pair.en.some(en => englishLower.includes(en.toLowerCase()));

    if (hasJapanese && !hasEnglish) {
      issues.push(`Japanese contains "${pair.jp[0]}" but English missing "${pair.en.join('/')}" equivalent`);
    }
  }

  // Check length ratio (translations should be roughly similar in length)
  const japaneseLength = japanese.length;
  const englishLength = english.length;
  const ratio = englishLength / japaneseLength;

  // Japanese to English ratio should typically be between 0.5 and 3.0
  if (ratio < 0.3 || ratio > 5.0) {
    issues.push(`Length ratio suspicious (${ratio.toFixed(2)}): JP=${japaneseLength}, EN=${englishLength}`);
  }

  return {
    isValid: issues.length === 0,
    issues
  };
}

/**
 * Main verification function
 */
async function verifyAllTranslations(): Promise<TranslationReport> {
  console.log('🔍 Starting translation verification for all 25 stories (125 chapters)...\n');

  const report: TranslationReport = {
    totalStories: 0,
    totalChapters: 0,
    checkedChapters: 0,
    issuesFound: [],
    fixedChapters: 0
  };

  try {
    // Fetch all stories with their chapters
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

    report.totalStories = stories.length;
    console.log(`📚 Found ${stories.length} stories\n`);

    // Check each story
    for (const story of stories) {
      console.log(`\n📖 Story: ${story.title} (${story.level_jlpt || 'N/A'})`);
      console.log(`   Chapters: ${story.chapters.length}`);

      report.totalChapters += story.chapters.length;

      // Check each chapter
      for (const chapter of story.chapters) {
        report.checkedChapters++;

        const validation = checkTranslationMatch(chapter.content, chapter.content_en);

        if (!validation.isValid) {
          console.log(`   ⚠️  Chapter ${chapter.chapter_number}: "${chapter.title}"`);
          validation.issues.forEach(issue => {
            console.log(`      - ${issue}`);
          });

          const issue: TranslationIssue = {
            storyId: story.story_id,
            storyTitle: story.title,
            chapterId: chapter.chapter_id,
            chapterNumber: chapter.chapter_number,
            chapterTitle: chapter.title,
            jlptLevel: story.level_jlpt,
            japaneseContent: chapter.content.substring(0, 100) + '...',
            currentTranslation: chapter.content_en?.substring(0, 100) + '...' || 'NULL',
            issue: validation.issues.join('; ')
          };

          report.issuesFound.push(issue);
        } else {
          console.log(`   ✅ Chapter ${chapter.chapter_number}: "${chapter.title}" - OK`);
        }
      }
    }

    // Print summary
    console.log('\n\n' + '='.repeat(80));
    console.log('📊 VERIFICATION SUMMARY');
    console.log('='.repeat(80));
    console.log(`Total Stories: ${report.totalStories}`);
    console.log(`Total Chapters: ${report.totalChapters}`);
    console.log(`Checked Chapters: ${report.checkedChapters}`);
    console.log(`Issues Found: ${report.issuesFound.length}`);
    console.log('='.repeat(80));

    if (report.issuesFound.length > 0) {
      console.log('\n\n🔴 ISSUES FOUND:\n');

      const groupedByStory = report.issuesFound.reduce((acc, issue) => {
        if (!acc[issue.storyTitle]) {
          acc[issue.storyTitle] = [];
        }
        acc[issue.storyTitle].push(issue);
        return acc;
      }, {} as Record<string, TranslationIssue[]>);

      for (const [storyTitle, issues] of Object.entries(groupedByStory)) {
        console.log(`\n📖 ${storyTitle} (${issues[0].jlptLevel || 'N/A'})`);
        console.log(`   ${issues.length} issue(s) found:`);

        issues.forEach((issue, index) => {
          console.log(`\n   ${index + 1}. Chapter ${issue.chapterNumber}: ${issue.chapterTitle}`);
          console.log(`      Chapter ID: ${issue.chapterId}`);
          console.log(`      Issue: ${issue.issue}`);
          console.log(`      Japanese: ${issue.japaneseContent}`);
          console.log(`      Current EN: ${issue.currentTranslation}`);
        });
      }
    } else {
      console.log('\n\n✅ No issues found! All translations are valid.\n');
    }

    return report;

  } catch (error) {
    console.error('❌ Error during verification:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Fix translations for specific chapters
 */
async function fixTranslations(issuesReport: TranslationReport): Promise<void> {
  if (issuesReport.issuesFound.length === 0) {
    console.log('\n✅ No fixes needed!');
    return;
  }

  console.log('\n\n' + '='.repeat(80));
  console.log('🔧 STARTING TRANSLATION FIXES');
  console.log('='.repeat(80));

  const totalIssues = issuesReport.issuesFound.length;
  let fixedCount = 0;

  for (const issue of issuesReport.issuesFound) {
    try {
      // Fetch the full chapter content
      const chapter = await prisma.chapter.findUnique({
        where: { chapter_id: issue.chapterId }
      });

      if (!chapter) {
        console.log(`\n❌ Chapter ${issue.chapterId} not found - skipping`);
        continue;
      }

      console.log(`\n📝 Fixing Story: ${issue.storyTitle}, Chapter ${issue.chapterNumber}: ${issue.chapterTitle}`);
      console.log(`   JLPT Level: ${issue.jlptLevel || 'N/A'}`);
      console.log(`   Issue: ${issue.issue}`);

      // You would normally call an AI translation service here
      // For this script, we'll mark chapters that need manual review
      console.log(`\n   ⚠️  MANUAL REVIEW REQUIRED`);
      console.log(`   Japanese content (full):`);
      console.log(`   ${chapter.content}\n`);
      console.log(`   Current translation:`);
      console.log(`   ${chapter.content_en || 'NULL'}\n`);

      // Uncomment the following to auto-update (after implementing proper translation)
      /*
      const newTranslation = generateTranslation(chapter.content, issue.jlptLevel);

      await prisma.chapter.update({
        where: { chapter_id: issue.chapterId },
        data: { content_en: newTranslation }
      });

      fixedCount++;
      console.log(`   ✅ Fixed (${fixedCount}/${totalIssues})`);
      */

    } catch (error) {
      console.log(`   ❌ Error fixing chapter ${issue.chapterId}:`, error);
    }
  }

  console.log('\n\n' + '='.repeat(80));
  console.log(`🎉 FIXING COMPLETE: ${fixedCount}/${totalIssues} chapters fixed`);
  console.log('='.repeat(80));
}

// Run the verification
async function main() {
  try {
    const report = await verifyAllTranslations();

    // Export report to JSON
    const fs = await import('fs');
    const reportPath = '/home/hanakotamio0705/Lingo Keeper JP/backend/translation-verification-report.json';
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    console.log(`\n\n📄 Full report saved to: ${reportPath}`);

    // Uncomment to apply fixes
    // await fixTranslations(report);

  } catch (error) {
    console.error('Fatal error:', error);
    process.exit(1);
  }
}

main();
