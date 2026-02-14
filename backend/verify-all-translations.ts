import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyTranslations() {
  // サンプルチェック: いくつかのストーリーの最初のチャプターをチェック
  const storiesToCheck = ['2', '3', '4', '5', '6', '7', '10', '15'];

  console.log('=== 翻訳の整合性チェック ===\n');

  for (const storyId of storiesToCheck) {
    const story = await prisma.story.findUnique({
      where: { story_id: storyId }
    });

    const chapter = await prisma.chapter.findFirst({
      where: { story_id: storyId, chapter_number: 1 }
    });

    if (!story || !chapter) continue;

    console.log(`\n📖 Story ${storyId}: ${story.title} (${story.level_jlpt})`);
    console.log('─'.repeat(60));
    console.log('日本語 (最初の100文字):');
    console.log(chapter.content.substring(0, 100).replace(/\n/g, ' '));
    console.log('\n英訳 (最初の100文字):');
    if (chapter.content_en) {
      console.log(chapter.content_en.substring(0, 100).replace(/\n/g, ' '));
    } else {
      console.log('❌ 翻訳なし');
    }
  }

  await prisma.$disconnect();
}

verifyTranslations().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
