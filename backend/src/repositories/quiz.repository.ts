import prisma from '@/lib/db.js';
import logger, { PerformanceTracker } from '@/lib/logger.js';
import type { Quiz, JLPTLevel, QuestionType } from '@/types/index.js';

/**
 * Quiz Repository
 * データベースアクセス処理を担当
 */
export class QuizRepository {
  /**
   * Convert Prisma Quiz to application Quiz type
   */
  private toDomainQuiz(prismaQuiz: any): Quiz {
    return {
      quiz_id: prismaQuiz.quiz_id,
      story_id: prismaQuiz.story_id,
      question_text: prismaQuiz.question_text,
      question_type: prismaQuiz.question_type as QuestionType,
      difficulty_level: prismaQuiz.difficulty_level as JLPTLevel,
      is_ai_generated: prismaQuiz.is_ai_generated || false,
      source_text: prismaQuiz.source_text || undefined,
      created_at: prismaQuiz.created_at.toISOString(),
      updated_at: prismaQuiz.created_at.toISOString(),
      choices: prismaQuiz.choices?.map((choice: any) => ({
        choice_id: choice.choice_id,
        quiz_id: choice.quiz_id,
        choice_text: choice.choice_text,
        is_correct: choice.is_correct,
        explanation: choice.explanation || undefined,
      })) || [],
    };
  }

  /**
   * Get all quizzes for a specific story
   */
  async findQuizzesByStoryId(storyId: string): Promise<Quiz[]> {
    const tracker = new PerformanceTracker('QuizRepository.findQuizzesByStoryId');
    logger.debug('Finding quizzes by story ID', { storyId });

    try {
      const quizzes = await prisma.quiz.findMany({
        where: { story_id: storyId },
        include: {
          choices: true,
        },
        orderBy: [
          { created_at: 'asc' },
        ],
      });

      logger.info('Quizzes retrieved successfully', {
        storyId,
        count: quizzes.length,
      });

      tracker.end({ quizzesCount: quizzes.length });
      return quizzes.map((quiz) => this.toDomainQuiz(quiz));
    } catch (error) {
      logger.error('Failed to retrieve quizzes', {
        error: error instanceof Error ? error.message : String(error),
        storyId,
      });
      throw error;
    }
  }

  /**
   * Get quiz by ID
   */
  async findQuizById(quizId: string): Promise<Quiz | null> {
    const tracker = new PerformanceTracker('QuizRepository.findQuizById');
    logger.debug('Finding quiz by ID', { quizId });

    try {
      const quiz = await prisma.quiz.findUnique({
        where: { quiz_id: quizId },
        include: {
          choices: true,
        },
      });

      if (!quiz) {
        logger.warn('Quiz not found', { quizId });
        tracker.end({ found: false });
        return null;
      }

      logger.info('Quiz retrieved successfully', {
        quizId,
        questionType: quiz.question_type,
      });

      tracker.end({ found: true });
      return this.toDomainQuiz(quiz);
    } catch (error) {
      logger.error('Failed to retrieve quiz', {
        error: error instanceof Error ? error.message : String(error),
        quizId,
      });
      throw error;
    }
  }

  /**
   * Get all quizzes
   */
  async findAllQuizzes(): Promise<Quiz[]> {
    const tracker = new PerformanceTracker('QuizRepository.findAllQuizzes');
    logger.debug('Finding all quizzes');

    try {
      const quizzes = await prisma.quiz.findMany({
        include: {
          choices: true,
        },
        orderBy: [
          { story_id: 'asc' },
          { created_at: 'asc' },
        ],
      });

      logger.info('All quizzes retrieved successfully', {
        count: quizzes.length,
      });

      tracker.end({ quizzesCount: quizzes.length });
      return quizzes.map((quiz) => this.toDomainQuiz(quiz));
    } catch (error) {
      logger.error('Failed to retrieve all quizzes', {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }
}

export const quizRepository = new QuizRepository();
