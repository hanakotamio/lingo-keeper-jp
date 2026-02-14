/**
 * Identify All Translation Mismatches
 *
 * Systematically checks for semantic mismatches between Japanese and English
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface Mismatch {
  storyNumber: number;
  storyTitle: string;
  storyId: string;
  jlptLevel: string | null;
  chapterId: string;
  chapterNumber: number;
  reason: string;
  japaneseStart: string;
  englishStart: string;
}

async function identifyMismatches(): Promise<void> {
  console.log('🔍 Identifying translation mismatches across all 125 chapters...\n');

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

  const mismatches: Mismatch[] = [];
  let storyNumber = 0;

  // Story-specific topic keywords to check
  const storyTopics: Record<string, { jp: string[], en: string[] }> = {
    '電車での通学': {
      jp: ['電車', '学校', '通学', '駅'],
      en: ['train', 'school', 'commute', 'station']
    },
    '公園での散歩': {
      jp: ['公園', '散歩', '木'],
      en: ['park', 'walk', 'tree']
    },
    '図書館での勉強': {
      jp: ['図書館', '勉強', '本'],
      en: ['library', 'study', 'book']
    },
    'コンビニで買い物': {
      jp: ['コンビニ', '買い物', '店'],
      en: ['convenience store', 'shopping', 'store', 'buy']
    },
    'レストランでの注文': {
      jp: ['レストラン', '注文', '食べ'],
      en: ['restaurant', 'order', 'eat', 'food']
    },
    '家族の紹介': {
      jp: ['家族', '父', '母', '兄弟'],
      en: ['family', 'father', 'mother', 'brother', 'sister']
    },
    '友達との約束': {
      jp: ['友達', '約束', '会う'],
      en: ['friend', 'promise', 'meet', 'appointment']
    },
    '好きな食べ物': {
      jp: ['食べ物', '好き', '食べる'],
      en: ['food', 'like', 'favorite', 'eat']
    },
    '初めての挨拶': {
      jp: ['挨拶', '初めて', 'はじめまして'],
      en: ['greeting', 'first', 'meet', 'hello']
    },
    '会社での会議': {
      jp: ['会社', '会議', '仕事'],
      en: ['company', 'meeting', 'work', 'office']
    },
    'アルバイトの面接': {
      jp: ['アルバイト', '面接', '仕事'],
      en: ['part-time', 'interview', 'job', 'work']
    },
    'ビジネスメールの作成': {
      jp: ['メール', 'ビジネス', '作成'],
      en: ['email', 'business', 'write']
    }
  };

  for (const story of stories) {
    storyNumber++;

    for (const chapter of story.chapters) {
      if (!chapter.content_en) {
        mismatches.push({
          storyNumber,
          storyTitle: story.title,
          storyId: story.story_id,
          jlptLevel: story.level_jlpt,
          chapterId: chapter.chapter_id,
          chapterNumber: chapter.chapter_number,
          reason: 'Missing English translation',
          japaneseStart: chapter.content.substring(0, 100),
          englishStart: 'NULL'
        });
        continue;
      }

      // Check if story has defined topics
      const topics = storyTopics[story.title];
      if (topics) {
        const jpContent = chapter.content.toLowerCase();
        const enContent = chapter.content_en.toLowerCase();

        // Check if Japanese has topic keywords but English doesn't
        const jpHasTopics = topics.jp.some(keyword => jpContent.includes(keyword));
        const enHasTopics = topics.en.some(keyword => enContent.includes(keyword));

        if (jpHasTopics && !enHasTopics) {
          mismatches.push({
            storyNumber,
            storyTitle: story.title,
            storyId: story.story_id,
            jlptLevel: story.level_jlpt,
            chapterId: chapter.chapter_id,
            chapterNumber: chapter.chapter_number,
            reason: `Japanese has topic keywords (${topics.jp.join(', ')}) but English missing (${topics.en.join(', ')})`,
            japaneseStart: chapter.content.substring(0, 150),
            englishStart: chapter.content_en.substring(0, 150)
          });
        }
      }
    }
  }

  // Print report
  console.log(`${'='.repeat(80)}`);
  console.log('📊 MISMATCH DETECTION REPORT');
  console.log(`${'='.repeat(80)}`);
  console.log(`Total Stories: ${stories.length}`);
  console.log(`Total Chapters: ${stories.reduce((sum, s) => sum + s.chapters.length, 0)}`);
  console.log(`Mismatches Found: ${mismatches.length}`);
  console.log(`${'='.repeat(80)}\n`);

  if (mismatches.length > 0) {
    console.log('🔴 MISMATCHED CHAPTERS:\n');

    const byStory = mismatches.reduce((acc, m) => {
      if (!acc[m.storyTitle]) acc[m.storyTitle] = [];
      acc[m.storyTitle].push(m);
      return acc;
    }, {} as Record<string, Mismatch[]>);

    for (const [storyTitle, chapters] of Object.entries(byStory)) {
      console.log(`\n📖 ${storyTitle} (${chapters[0].jlptLevel || 'N/A'}) - Story ${chapters[0].storyNumber}`);
      console.log(`   Story ID: ${chapters[0].storyId}`);
      console.log(`   ${chapters.length} chapter(s) with issues:`);

      for (const chapter of chapters) {
        console.log(`\n   Chapter ${chapter.chapterNumber} (${chapter.chapterId}):`);
        console.log(`   Reason: ${chapter.reason}`);
        console.log(`   Japanese: ${chapter.japaneseStart}...`);
        console.log(`   English:  ${chapter.englishStart}...`);
      }
    }

    // Export to file
    const fs = await import('fs');
    const reportPath = '/home/hanakotamio0705/Lingo Keeper JP/backend/MISMATCHES_FOUND.json';
    fs.writeFileSync(reportPath, JSON.stringify({ total: mismatches.length, mismatches }, null, 2));
    console.log(`\n\n📄 Full mismatch report saved to: ${reportPath}\n`);

  } else {
    console.log('✅ No mismatches found! All translations appear correct.\n');
  }

  await prisma.$disconnect();
}

identifyMismatches();
