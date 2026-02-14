import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkStory2() {
  const chapters = await prisma.chapter.findMany({
    where: { story_id: '2' },
    orderBy: { chapter_number: 'asc' }
  });

  console.log('ストーリー2「初めての挨拶」のチャプター内容確認\n');
  console.log('='.repeat(80));

  for (const chapter of chapters) {
    console.log(`\n📖 Chapter ${chapter.chapter_number} (${chapter.chapter_id})`);
    console.log(`タイトル: ${chapter.title}`);
    console.log('\n【日本語コンテンツ】');
    console.log(chapter.content);
    console.log('\n【現在の英訳 (content_en)】');
    if (chapter.content_en) {
      console.log(chapter.content_en);
    } else {
      console.log('❌ 英訳なし');
    }
    console.log('\n' + '='.repeat(80));
  }

  await prisma.$disconnect();
}

checkStory2().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
