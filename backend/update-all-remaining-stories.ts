import { PrismaClient } from '@prisma/client';
import storyContents from './story-content-complete';
import storyContentsN3Part2 from './story-content-n3-part2';
import storyContentsN2 from './story-content-n2';
import storyContentsN2N1 from './story-content-n2-n1';
import storyContentsN1Final from './story-content-n1-final';

const prisma = new PrismaClient();

interface StoryContent {
  title: string;
  chapters: Array<{
    num: number;
    content: string;
    vocabulary: Record<string, string>;
  }>;
  quizzes: Array<{
    id: string;
    question: string;
    type: string;
    choices: Array<{
      text: string;
      correct: boolean;
      explanation: string;
    }>;
  }>;
}

async function updateStory(storyContent: StoryContent, storyId: string) {
  console.log(`\n📖 修正中: ${storyContent.title} (Story ${storyId})`);

  const story = await prisma.story.findFirst({
    where: { story_id: storyId }
  });

  if (!story) {
    console.log(`  ⚠️  ストーリーが見つかりません: ${storyId}`);
    return false;
  }

  // チャプターを更新
  for (const chapterData of storyContent.chapters) {
    const chapterId = `ch-${storyId}-${chapterData.num}`;

    await prisma.chapter.update({
      where: { chapter_id: chapterId },
      data: {
        content: chapterData.content,
        vocabulary: chapterData.vocabulary
      }
    });
  }

  console.log(`  ✅ チャプター${storyContent.chapters.length}個を更新`);

  // 既存のクイズを削除
  const existingQuizzes = await prisma.quiz.findMany({
    where: { story_id: storyId },
    select: { quiz_id: true }
  });

  for (const quiz of existingQuizzes) {
    await prisma.quizChoice.deleteMany({ where: { quiz_id: quiz.quiz_id } });
  }

  await prisma.quiz.deleteMany({ where: { story_id: storyId } });

  // 新しいクイズを作成
  for (const quizData of storyContent.quizzes) {
    const quiz = await prisma.quiz.create({
      data: {
        quiz_id: quizData.id,
        question_text: quizData.question,
        question_type: quizData.type,
        difficulty_level: story.level_jlpt!,
        is_ai_generated: false,
        source_text: `${storyContent.title}から`,
        story: {
          connect: { story_id: storyId }
        }
      },
    });

    for (let i = 0; i < quizData.choices.length; i++) {
      await prisma.quizChoice.create({
        data: {
          choice_id: `${quizData.id}-choice-${i + 1}`,
          quiz_id: quiz.quiz_id,
          choice_text: quizData.choices[i].text,
          is_correct: quizData.choices[i].correct,
          explanation: quizData.choices[i].explanation,
        },
      });
    }
  }

  console.log(`  ✅ クイズ${storyContent.quizzes.length}個を更新`);
  return true;
}

async function main() {
  console.log('=== 残り20個のストーリーを一括更新 ===\n');

  // 全てのストーリーコンテンツをマージ
  const allStoryContents = {
    ...storyContents,
    ...storyContentsN3Part2,
    ...storyContentsN2,
    ...storyContentsN2N1,
    ...storyContentsN1Final
  };

  // ストーリーIDマッピング
  const storyMapping: Record<string, string> = {
    'story1': '1',
    'story7': '7',
    'story8': '8',
    'story9': '9',
    'story10': '10',
    'story11': '11',
    'story12': '12',
    'story13': '13',
    'story14': '14',
    'story15': '15',
    'story16': '16',
    'story17': '17',
    'story18': '18',
    'story19': '19',
    'story20': '20',
    'story21': '21',
    'story22': '22',
    'story23': '23',
    'story24': '24',
    'story25': '25'
  };

  let totalFixed = 0;

  for (const [key, value] of Object.entries(allStoryContents)) {
    const storyId = storyMapping[key];
    if (storyId) {
      try {
        if (await updateStory(value as StoryContent, storyId)) {
          totalFixed++;
        }
      } catch (error) {
        console.error(`  ❌ エラー (Story ${storyId}):`, error);
      }
    }
  }

  console.log(`\n\n🎉 合計 ${totalFixed}個のストーリーを修正しました！`);
  await prisma.$disconnect();
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
