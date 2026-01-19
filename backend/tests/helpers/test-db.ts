import prisma from '@/lib/db.js';
import logger from '@/lib/logger.js';

/**
 * テスト用データベースヘルパー
 */

/**
 * 全テーブルのデータをクリア
 */
export async function cleanupDatabase(): Promise<void> {
  try {
    // 外部キー制約を一時的に無効化
    await prisma.$executeRawUnsafe('SET session_replication_role = replica;');

    // 全テーブルのデータを削除（順序重要）
    await prisma.quizResult.deleteMany({});
    await prisma.quizChoice.deleteMany({});
    await prisma.quiz.deleteMany({});
    await prisma.choice.deleteMany({});
    await prisma.chapter.deleteMany({});
    await prisma.userProgress.deleteMany({});
    await prisma.story.deleteMany({});

    // 外部キー制約を再度有効化
    await prisma.$executeRawUnsafe('SET session_replication_role = origin;');

    logger.debug('Database cleaned up successfully');
  } catch (error) {
    logger.error('Failed to cleanup database', {
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}

/**
 * テスト用シードデータを投入
 */
export async function seedTestData(): Promise<void> {
  try {
    // テスト用ストーリーを作成
    const story = await prisma.story.create({
      data: {
        story_id: 'test-story-1',
        title: 'テストストーリー',
        description: 'テスト用のストーリーです',
        level_jlpt: 'N5',
        level_cefr: 'A1',
        estimated_time: 10,
        root_chapter_id: 'chapter-1',
      },
    });

    // テスト用チャプターを作成
    await prisma.chapter.create({
      data: {
        chapter_id: 'chapter-1',
        story_id: story.story_id,
        chapter_number: 1,
        depth_level: 0,
        content: 'これはテスト用のチャプターです。',
      },
    });

    // テスト用クイズを作成
    const quiz = await prisma.quiz.create({
      data: {
        quiz_id: 'test-quiz-1',
        story_id: story.story_id,
        question_text: 'テスト問題です',
        question_type: '読解',
        difficulty_level: 'N5',
      },
    });

    // テスト用クイズ選択肢を作成
    await prisma.quizChoice.createMany({
      data: [
        {
          quiz_id: quiz.quiz_id,
          choice_text: '正解の選択肢',
          is_correct: true,
        },
        {
          quiz_id: quiz.quiz_id,
          choice_text: '不正解の選択肢1',
          is_correct: false,
        },
        {
          quiz_id: quiz.quiz_id,
          choice_text: '不正解の選択肢2',
          is_correct: false,
        },
      ],
    });

    logger.debug('Test data seeded successfully');
  } catch (error) {
    logger.error('Failed to seed test data', {
      error: error instanceof Error ? error.message : String(error),
    });
    throw error;
  }
}

/**
 * データベース接続を閉じる
 */
export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect();
}
