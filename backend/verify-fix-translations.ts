import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface TranslationIssue {
  storyId: string;
  storyTitle: string;
  chapterId: string;
  chapterNumber: number;
  chapterTitle: string;
  issue: string;
  japaneseContent: string;
  currentEnglish: string | null;
  correctedEnglish: string;
}

const translationIssues: TranslationIssue[] = [];

/**
 * Get proper English translation based on Japanese content and JLPT level
 */
function getCorrectTranslation(japaneseContent: string, jlptLevel: string | null): string {
  // This is a mapping of known incorrect translations to correct ones
  // Based on the Japanese content
  const translations: Record<string, string> = {
    // Story 3 Chapter 1 - Family Introduction
    '私の家族を紹介します。': 'Let me introduce my family.',
    '私は田中さくらと言います。家族は4人です。': 'My name is Sakura Tanaka. There are four people in my family.',
    '父、母、弟、そして私です。': 'My father, mother, younger brother, and me.',
    '父は会社員です。毎日7時に家を出ます。': 'My father is a company employee. He leaves home at 7:00 every day.',
    '母は看護師です。病院で働いています。': 'My mother is a nurse. She works at a hospital.',
    '弟は高校生です。サッカーが大好きです。': 'My younger brother is a high school student. He loves soccer.',
    '週末はみんなで一緒に過ごします。': 'We spend weekends together as a family.',

    // Story 4 Chapter 1 - Convenience Store Shopping
    '今日はコンビニで買い物をします。': 'Today I\'m going shopping at a convenience store.',
    'コンビニは便利です。24時間開いています。': 'Convenience stores are convenient. They\'re open 24 hours.',
    '食べ物、飲み物、雑誌など、いろいろな物があります。': 'They have various things like food, drinks, and magazines.',
    '私はおにぎりとお茶を買いました。': 'I bought a rice ball and tea.',
    'レジで「ありがとうございます」と言われました。': 'At the register, they said "Thank you very much."',
    '袋はもらいませんでした。': 'I didn\'t get a bag.',
    '環境のためにエコバッグを使っています。': 'I use an eco-bag for the environment.',

    // Story 5 Chapter 1 - Favorite Food
    '私の好きな食べ物について話します。': 'I\'ll talk about my favorite food.',
    '私は日本料理が大好きです。': 'I really love Japanese cuisine.',
    '特に寿司とラーメンが好きです。': 'I especially like sushi and ramen.',
    '寿司は新鮮な魚を使います。とても美味しいです。': 'Sushi uses fresh fish. It\'s very delicious.',
    'ラーメンには色々な種類があります。': 'There are various types of ramen.',
    '醤油、味噌、塩、豚骨などです。': 'Soy sauce, miso, salt, pork bone, and others.',
    '私は味噌ラーメンが一番好きです。': 'I like miso ramen the best.',
    '友達と一緒にラーメン屋さんに行くのが楽しいです。': 'It\'s fun to go to ramen shops with friends.',

    // Story 6 Chapter 1 - Park Walk
    '今日は公園を散歩します。': 'Today I\'m taking a walk in the park.',
    '公園には大きな木がたくさんあります。': 'There are many large trees in the park.',
    '春には桜が咲いてとてもきれいです。': 'In spring, cherry blossoms bloom and it\'s very beautiful.',
    '池もあります。鴨が泳いでいます。': 'There\'s also a pond. Ducks are swimming.',
    '子供たちが遊んでいます。': 'Children are playing.',
    'ベンチに座って本を読みます。': 'I sit on a bench and read a book.',
    '公園は静かで、リラックスできる場所です。': 'The park is quiet and a relaxing place.',

    // Story 10 Chapter 1 - Weekend Plans
    '週末の予定について考えています。': 'I\'m thinking about my weekend plans.',
    '土曜日は友達と映画を見に行きます。': 'On Saturday, I\'m going to see a movie with friends.',
    '新しいアニメ映画が公開されました。': 'A new anime movie has been released.',
    'とても楽しみにしています。': 'I\'m really looking forward to it.',
    '日曜日は家で休みます。': 'On Sunday, I\'ll rest at home.',
    '部屋の掃除をして、洗濯もします。': 'I\'ll clean my room and do laundry too.',
    '夜は家族と一緒に夕食を食べます。': 'In the evening, I\'ll have dinner with my family.',
    '良い週末になりそうです。': 'It looks like it will be a good weekend.',
  };

  // Return exact match if found
  const exactMatch = translations[japaneseContent.trim()];
  if (exactMatch) {
    return exactMatch;
  }

  // If no exact match, return a placeholder indicating manual review needed
  return `[NEEDS MANUAL TRANSLATION: ${japaneseContent.substring(0, 50)}...]`;
}

/**
 * Verify translation accuracy by checking if content matches story context
 */
function verifyTranslationAccuracy(
  storyTitle: string,
  chapterContent: string,
  englishTranslation: string | null
): boolean {
  if (!englishTranslation) return false;

  // Check for known mismatches
  const mismatches: Record<string, string[]> = {
    '家族の紹介': ['cherry', 'sakura', 'spring'], // Should not contain cherry blossom content
    'コンビニで買い物': ['university', 'college', 'student life'], // Should not contain university content
    '好きな食べ物': ['kyoto', 'temple', 'travel'], // Should not contain travel content
    '公園での散歩': ['hospital', 'doctor', 'medical'], // Should not contain hospital content
    '週末の計画': ['train', 'commute', 'station'], // Should not contain train commute content
  };

  const keywords = mismatches[storyTitle];
  if (keywords) {
    const lowerTranslation = englishTranslation.toLowerCase();
    for (const keyword of keywords) {
      if (lowerTranslation.includes(keyword)) {
        return false; // Translation contains wrong content
      }
    }
  }

  return true; // No obvious mismatch detected
}

async function verifyAndFixTranslations() {
  console.log('Starting translation verification and fixing process...\n');

  try {
    // Get all stories with their chapters
    const stories = await prisma.story.findMany({
      orderBy: { story_id: 'asc' },
      include: {
        chapters: {
          orderBy: { chapter_number: 'asc' }
        }
      }
    });

    console.log(`Found ${stories.length} stories to verify\n`);

    for (const story of stories) {
      console.log(`\n=== Story ${story.story_id}: ${story.title} (${story.level_jlpt}) ===`);

      for (const chapter of story.chapters) {
        const isAccurate = verifyTranslationAccuracy(
          story.title,
          chapter.content,
          chapter.content_en
        );

        if (!isAccurate || !chapter.content_en) {
          const correctedTranslation = getCorrectTranslation(
            chapter.content,
            story.level_jlpt
          );

          // Only add to issues if we have a real translation (not placeholder)
          if (!correctedTranslation.startsWith('[NEEDS MANUAL TRANSLATION')) {
            translationIssues.push({
              storyId: story.story_id,
              storyTitle: story.title,
              chapterId: chapter.chapter_id,
              chapterNumber: chapter.chapter_number,
              chapterTitle: chapter.title,
              issue: !chapter.content_en ? 'Missing translation' : 'Incorrect translation',
              japaneseContent: chapter.content,
              currentEnglish: chapter.content_en,
              correctedEnglish: correctedTranslation
            });

            console.log(`  ❌ Chapter ${chapter.chapter_number}: ${chapter.title}`);
            console.log(`     Issue: ${!chapter.content_en ? 'Missing translation' : 'Incorrect translation'}`);
          } else {
            console.log(`  ⚠️  Chapter ${chapter.chapter_number}: ${chapter.title} - Needs manual review`);
          }
        } else {
          console.log(`  ✅ Chapter ${chapter.chapter_number}: ${chapter.title}`);
        }
      }
    }

    // Print summary
    console.log('\n\n=== SUMMARY ===');
    console.log(`Total issues found: ${translationIssues.length}`);
    console.log(`\nIssues by story:`);

    const issuesByStory = translationIssues.reduce((acc, issue) => {
      if (!acc[issue.storyTitle]) {
        acc[issue.storyTitle] = [];
      }
      acc[issue.storyTitle].push(issue);
      return acc;
    }, {} as Record<string, TranslationIssue[]>);

    for (const [storyTitle, issues] of Object.entries(issuesByStory)) {
      console.log(`\n${storyTitle}: ${issues.length} issues`);
      for (const issue of issues) {
        console.log(`  - Chapter ${issue.chapterNumber}: ${issue.issue}`);
      }
    }

    // Apply fixes
    if (translationIssues.length > 0) {
      console.log('\n\n=== APPLYING FIXES ===');

      for (const issue of translationIssues) {
        console.log(`\nFixing ${issue.storyTitle} - Chapter ${issue.chapterNumber}`);
        console.log(`Japanese: ${issue.japaneseContent.substring(0, 60)}...`);
        console.log(`Old English: ${issue.currentEnglish?.substring(0, 60) || 'null'}...`);
        console.log(`New English: ${issue.correctedEnglish.substring(0, 60)}...`);

        await prisma.chapter.update({
          where: { chapter_id: issue.chapterId },
          data: { content_en: issue.correctedEnglish }
        });

        console.log('✅ Fixed');
      }

      console.log(`\n\n✅ Successfully fixed ${translationIssues.length} translations!`);
    } else {
      console.log('\n✅ No translation issues found!');
    }

    // Generate detailed report
    console.log('\n\n=== DETAILED REPORT ===');
    console.log(JSON.stringify(translationIssues, null, 2));

  } catch (error) {
    console.error('Error during verification:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

verifyAndFixTranslations()
  .then(() => {
    console.log('\n✅ Translation verification and fixing completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error:', error);
    process.exit(1);
  });
