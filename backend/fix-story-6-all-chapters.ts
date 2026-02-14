import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ストーリー6「公園での散歩」の正しい英訳
const correctTranslations = {
  'ch-6-1': `Today the weather is nice. I'm going to the park.

There are many beautiful flowers in the park. Red flowers, yellow flowers, and white flowers are blooming.

There are birds too. Small birds are singing. They have very beautiful voices.`,

  'ch-6-2': `I walk in the park. There is a big tree next to the path.

I rest a little under the tree. The wind feels nice.

Children are playing. They are playing with a ball. They look happy.`,

  'ch-6-3': `There is a pond. There are fish in the pond.

Big fish and small fish are swimming.

I sit on a bench. It's very quiet and nice.`,

  'ch-6-4': `There is a cat in the park. It's a white cat.

I approach the cat. The cat doesn't run away.

I pet the cat. The cat is happy. It's cute.`,

  'ch-6-5': `It's already evening. The sky has turned red.

My walk in the park is over. It was very fun.

I will come again tomorrow. Goodbye, park.`
};

async function fixStory6() {
  console.log('ストーリー6「公園での散歩」の翻訳を修正中...\n');

  for (const [chapterId, translation] of Object.entries(correctTranslations)) {
    const chapterNum = chapterId.split('-')[2];
    console.log(`✏️  Updating Chapter ${chapterNum} (${chapterId})...`);

    await prisma.chapter.update({
      where: { chapter_id: chapterId },
      data: { content_en: translation }
    });

    console.log(`✅ Chapter ${chapterNum} updated`);
  }

  console.log('\n🎉 Story 6の全翻訳を修正しました！');

  // 確認
  console.log('\n=== 修正後の確認 ===\n');
  const chapters = await prisma.chapter.findMany({
    where: { story_id: '6' },
    orderBy: { chapter_number: 'asc' }
  });

  for (const chapter of chapters) {
    console.log(`\n📖 Chapter ${chapter.chapter_number}:`);
    console.log('日本語:', chapter.content.substring(0, 60).replace(/\n/g, ' ') + '...');
    console.log('英訳:', chapter.content_en?.substring(0, 60).replace(/\n/g, ' ') + '...');
  }

  await prisma.$disconnect();
}

fixStory6().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
