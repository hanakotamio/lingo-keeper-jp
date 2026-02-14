import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkStory6() {
  const chapters = await prisma.chapter.findMany({
    where: { story_id: '6' },
    orderBy: { chapter_number: 'asc' }
  });

  console.log('ストーリー6「公園での散歩」全チャプター詳細確認\n');
  console.log('='.repeat(100));

  for (const chapter of chapters) {
    console.log(`\n📖 Chapter ${chapter.chapter_number} (${chapter.chapter_id})`);
    console.log(`タイトル: ${chapter.title}`);
    console.log('\n【日本語コンテンツ（全文）】');
    console.log(chapter.content);
    console.log('\n【現在の英訳（全文）】');
    if (chapter.content_en) {
      console.log(chapter.content_en);
    } else {
      console.log('❌ 英訳なし');
    }
    console.log('\n' + '='.repeat(100));
  }

  await prisma.$disconnect();
}

checkStory6().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
