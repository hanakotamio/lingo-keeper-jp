import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ストーリー2「初めての挨拶」の正しい英訳
const correctTranslations = {
  'ch-2-1': `Today is my first Japanese class.

I am nervous. But I am also excited.

The teacher came. She said, "Good morning."`,

  'ch-2-2': `The teacher is kind. She asked, "What is your name?"

I answered, "My name is Alex."

The teacher said, "Nice to meet you."`,

  'ch-2-3': `There are also classmates. I greet the person next to me.

"Hello. I am Alex."

The person next to me said, "I am Emma. Nice to meet you."`,

  'ch-2-4': `We study Japanese in class.

We learned "thank you," "excuse me," and "goodbye."

We practice together. It is fun.`,

  'ch-2-5': `Class is over.

I said to the teacher, "Thank you very much."

I will come again tomorrow. Studying Japanese is interesting.`
};

async function fixTranslations() {
  console.log('ストーリー2「初めての挨拶」の翻訳を修正中...\n');

  for (const [chapterId, translation] of Object.entries(correctTranslations)) {
    console.log(`✏️  Updating ${chapterId}...`);

    await prisma.chapter.update({
      where: { chapter_id: chapterId },
      data: { content_en: translation }
    });

    console.log(`✅ ${chapterId} updated`);
  }

  console.log('\n🎉 すべての翻訳を修正しました！');

  // 確認
  console.log('\n=== 修正後の確認 ===\n');
  const chapters = await prisma.chapter.findMany({
    where: { story_id: '2' },
    orderBy: { chapter_number: 'asc' }
  });

  for (const chapter of chapters) {
    console.log(`Chapter ${chapter.chapter_number}:`);
    console.log(`日本語: ${chapter.content.substring(0, 50)}...`);
    console.log(`英訳: ${chapter.content_en?.substring(0, 50)}...`);
    console.log('');
  }

  await prisma.$disconnect();
}

fixTranslations().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
