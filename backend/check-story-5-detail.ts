import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkStory5() {
  const story = await prisma.story.findFirst({
    where: { title: { contains: '好きな食べ物' } }
  });

  if (!story) {
    console.log('「好きな食べ物」のストーリーが見つかりません');
    return;
  }

  console.log(`ストーリーID: ${story.story_id}`);
  console.log(`タイトル: ${story.title}`);
  console.log(`レベル: ${story.level_jlpt}\n`);

  const chapters = await prisma.chapter.findMany({
    where: { story_id: story.story_id },
    orderBy: { chapter_number: 'asc' }
  });

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

checkStory5().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
