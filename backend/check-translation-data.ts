import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkTranslations() {
  console.log('=== 翻訳データ確認 ===\n');

  // Check a few random chapters
  const chapters = await prisma.chapter.findMany({
    where: {
      story_id: { in: ['1', '6', '15', '25'] }
    },
    orderBy: { chapter_number: 'asc' },
    take: 10
  });

  console.log(`取得したチャプター数: ${chapters.length}\n`);

  for (const chapter of chapters) {
    console.log(`\n📖 Story ${chapter.story_id} - Chapter ${chapter.chapter_number}`);
    console.log(`タイトル: ${chapter.title}`);
    console.log(`日本語コンテンツ: ${chapter.content ? '✅ あり' : '❌ なし'}`);
    console.log(`英訳 (content_en): ${chapter.content_en ? '✅ あり' : '❌ なし'}`);

    if (chapter.content_en) {
      console.log(`英訳プレビュー: ${chapter.content_en.substring(0, 100)}...`);
    } else {
      console.log('⚠️  英訳が存在しません！');
    }
  }

  // Count chapters with and without translations
  const totalChapters = await prisma.chapter.count();
  const chaptersWithTranslation = await prisma.chapter.count({
    where: {
      content_en: { not: null }
    }
  });

  console.log(`\n\n📊 統計:`);
  console.log(`総チャプター数: ${totalChapters}`);
  console.log(`英訳があるチャプター: ${chaptersWithTranslation}`);
  console.log(`英訳がないチャプター: ${totalChapters - chaptersWithTranslation}`);

  await prisma.$disconnect();
}

checkTranslations().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
