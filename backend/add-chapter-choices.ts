import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function addChapterChoices() {
  console.log('=== 入門ストーリーのチャプターに選択肢を追加 ===\n');

  try {
    const storyIds = ['11', '13', '14', '15', '16'];

    for (const storyId of storyIds) {
      console.log(`Story ${storyId}の選択肢を追加中...`);

      // チャプター1-4に「次へ」選択肢を追加（チャプター5は最後なので選択肢不要）
      for (let chapterNum = 1; chapterNum <= 4; chapterNum++) {
        const currentChapterId = `ch-${storyId}-${chapterNum}`;
        const nextChapterId = `ch-${storyId}-${chapterNum + 1}`;
        const choiceId = `choice-${storyId}-${chapterNum}-next`;

        // 選択肢が既に存在するか確認
        const existingChoice = await prisma.choice.findUnique({
          where: { choice_id: choiceId }
        });

        if (!existingChoice) {
          await prisma.choice.create({
            data: {
              choice_id: choiceId,
              chapter: {
                connect: { chapter_id: currentChapterId }
              },
              choice_text: '次へ',
              choice_description: '次のチャプターに進みます',
              next_chapter_id: nextChapterId,
              display_order: 1
            }
          });
          console.log(`  ✓ ${currentChapterId} → ${nextChapterId}の選択肢を追加`);
        }
      }

      console.log(`✅ Story ${storyId}完成（チャプター5は最後なので選択肢なし）\n`);
    }

  } catch (error) {
    console.error('❌ エラーが発生しました:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

addChapterChoices()
  .then(() => {
    console.log('=== すべての選択肢を追加しました ===');
    process.exit(0);
  })
  .catch((error) => {
    console.error('追加に失敗しました:', error);
    process.exit(1);
  });
