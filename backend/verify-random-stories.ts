import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyStory(storyId: string, storyTitle: string) {
  console.log(`\n=== Story ${storyId}: ${storyTitle} ===`);

  const story = await prisma.story.findFirst({
    where: { story_id: storyId },
    include: {
      chapters: {
        orderBy: { chapter_number: 'asc' },
        include: { choices: true }
      },
      quizzes: {
        include: { choices: true }
      }
    }
  });

  if (!story) {
    console.log('❌ ストーリーが見つかりません');
    return;
  }

  console.log(`\n📊 チャプター数: ${story.chapters.length}/5`);
  console.log(`📊 クイズ数: ${story.quizzes.length}/5`);

  // Check first chapter
  const firstChapter = story.chapters[0];
  console.log(`\n📖 Chapter 1 プレビュー:`);
  console.log(firstChapter.content?.substring(0, 150) + '...');

  // Check first quiz
  const firstQuiz = story.quizzes[0];
  console.log(`\n❓ Quiz 1 プレビュー:`);
  console.log(`Q: ${firstQuiz.question_text}`);
  console.log(`タイプ: ${firstQuiz.question_type}`);
  const correctChoice = firstQuiz.choices.find(c => c.is_correct);
  console.log(`正解: ${correctChoice?.choice_text}`);
}

async function main() {
  console.log('=== ランダムストーリー検証 ===');

  // Test different levels
  await verifyStory('1', '東京での新しい生活 (N3)');
  await verifyStory('7', 'レストランでの注文 (N4)');
  await verifyStory('15', '会社での会議 (N3)');
  await verifyStory('20', '環境問題について (N2)');
  await verifyStory('25', '伝統文化の継承 (N1)');

  console.log('\n✅ 検証完了');
  await prisma.$disconnect();
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
