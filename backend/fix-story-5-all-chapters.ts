import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ストーリー5「好きな食べ物」の正しい英訳
const correctTranslations = {
  'ch-5-1': `I like food.

I especially like Japanese food.

Today I will talk about my favorite food.`,

  'ch-5-2': `My favorite food is sushi.

The fish is fresh and delicious.

I like tuna. I also like salmon.`,

  'ch-5-3': `I also love ramen.

The hot soup is delicious.

I often eat tonkotsu ramen.`,

  'ch-5-4': `I also like sweets.

I like chocolate. It's sweet and delicious.

I sometimes eat cake too.`,

  'ch-5-5': `Food is fun.

I want to try new foods.

I will eat various foods from now on.`
};

async function fixStory5() {
  console.log('ストーリー5「好きな食べ物」の翻訳を修正中...\n');

  for (const [chapterId, translation] of Object.entries(correctTranslations)) {
    const chapterNum = chapterId.split('-')[2];
    console.log(`✏️  Updating Chapter ${chapterNum} (${chapterId})...`);

    await prisma.chapter.update({
      where: { chapter_id: chapterId },
      data: { content_en: translation }
    });

    console.log(`✅ Chapter ${chapterNum} updated`);
  }

  console.log('\n🎉 Story 5の全翻訳を修正しました！');

  // 確認
  console.log('\n=== 修正後の確認 ===\n');
  const chapters = await prisma.chapter.findMany({
    where: { story_id: '5' },
    orderBy: { chapter_number: 'asc' }
  });

  for (const chapter of chapters) {
    console.log(`\n📖 Chapter ${chapter.chapter_number}:`);
    console.log('日本語:', chapter.content.substring(0, 80).replace(/\n/g, ' ') + '...');
    console.log('英訳:', chapter.content_en?.substring(0, 80).replace(/\n/g, ' ') + '...');
  }

  await prisma.$disconnect();
}

fixStory5().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
