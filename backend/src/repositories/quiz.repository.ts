import prisma from '@/lib/db.js';
import logger, { PerformanceTracker } from '@/lib/logger.js';
import type { Quiz, QuizChoice, JLPTLevel } from '@/types/index.js';
import type { Quiz as PrismaQuiz, QuizChoice as PrismaQuizChoice } from '@prisma/client';

/**
 * Quiz Repository
 * データベースアクセス処理を担当
 */
export class QuizRepository {
  /**
   * Convert Prisma QuizChoice to application QuizChoice type
   */
  private toDomainQuizChoice(prismaChoice: PrismaQuizChoice): QuizChoice {
    return {
      choice_id: prismaChoice.choice_id,
      quiz_id: prismaChoice.quiz_id,
      choice_text: prismaChoice.choice_text,
      is_correct: prismaChoice.is_correct,
      explanation: prismaChoice.explanation || undefined,
    };
  }

  /**
   * Convert Prisma Quiz to application Quiz type
   */
  private toDomainQuiz(
    prismaQuiz: PrismaQuiz & { quiz_choices: PrismaQuizChoice[] }
  ): Quiz {
    return {
      quiz_id: prismaQuiz.quiz_id,
      story_id: prismaQuiz.story_id,
      question_text: prismaQuiz.question_text,
      question_type: prismaQuiz.question_type as Quiz['question_type'],
      difficulty_level: prismaQuiz.difficulty_level as JLPTLevel,
      is_ai_generated: prismaQuiz.is_ai_generated,
      source_text: prismaQuiz.source_text || undefined,
      created_at: prismaQuiz.created_at.toISOString(),
      updated_at: prismaQuiz.updated_at.toISOString(),
      choices: prismaQuiz.quiz_choices.map((choice) => this.toDomainQuizChoice(choice)),
    };
  }

  /**
   * Get random quiz (1 question)
   */
  async findRandomQuiz(): Promise<Quiz | null> {
    const tracker = new PerformanceTracker('QuizRepository.findRandomQuiz');
    logger.debug('Finding random quiz');

    try {
      // Get total count of quizzes
      const count = await prisma.quiz.count();
      if (count === 0) {
        logger.warn('No quizzes found in database');
        tracker.end({ found: false });
        return null;
      }

      // Generate random skip value
      const skip = Math.floor(Math.random() * count);

      // Get random quiz with choices
      const quiz = await prisma.quiz.findFirst({
        skip,
        include: {
          quiz_choices: true,
        },
      });

      if (!quiz) {
        logger.warn('Random quiz not found');
        tracker.end({ found: false });
        return null;
      }

      logger.info('Random quiz retrieved successfully', {
        quizId: quiz.quiz_id,
        questionType: quiz.question_type,
        difficultyLevel: quiz.difficulty_level,
      });

      tracker.end({ found: true, quizId: quiz.quiz_id });
      return this.toDomainQuiz(quiz);
    } catch (error) {
      logger.error('Failed to retrieve random quiz', {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  /**
   * Get quizzes by story ID
   */
  async findQuizzesByStoryId(storyId: string): Promise<Quiz[]> {
    const tracker = new PerformanceTracker('QuizRepository.findQuizzesByStoryId');
    logger.debug('Finding quizzes by story ID', { storyId });

    try {
      const quizzes = await prisma.quiz.findMany({
        where: { story_id: storyId },
        include: {
          quiz_choices: true,
        },
        orderBy: [
          { difficulty_level: 'desc' }, // N5 -> N1
          { created_at: 'asc' },
        ],
      });

      logger.info('Quizzes retrieved successfully', {
        storyId,
        count: quizzes.length,
      });

      tracker.end({ storyId, quizzesCount: quizzes.length });
      return quizzes.map((quiz) => this.toDomainQuiz(quiz));
    } catch (error) {
      logger.error('Failed to retrieve quizzes by story ID', {
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
          quiz_choices: true,
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
   * Get quiz choice by ID
   */
  async findQuizChoiceById(choiceId: string): Promise<QuizChoice | null> {
    const tracker = new PerformanceTracker('QuizRepository.findQuizChoiceById');
    logger.debug('Finding quiz choice by ID', { choiceId });

    try {
      const choice = await prisma.quizChoice.findUnique({
        where: { choice_id: choiceId },
      });

      if (!choice) {
        logger.warn('Quiz choice not found', { choiceId });
        tracker.end({ found: false });
        return null;
      }

      logger.info('Quiz choice retrieved successfully', {
        choiceId,
        isCorrect: choice.is_correct,
      });

      tracker.end({ found: true });
      return this.toDomainQuizChoice(choice);
    } catch (error) {
      logger.error('Failed to retrieve quiz choice', {
        error: error instanceof Error ? error.message : String(error),
        choiceId,
      });
      throw error;
    }
  }

  /**
   * Save quiz result
   */
  async saveQuizResult(data: {
    quizId: string;
    userAnswer: string;
    isCorrect: boolean;
    responseMethod: '音声' | 'テキスト';
  }): Promise<void> {
    const tracker = new PerformanceTracker('QuizRepository.saveQuizResult');
    logger.debug('Saving quiz result', { quizId: data.quizId });

    try {
      await prisma.quizResult.create({
        data: {
          quiz_id: data.quizId,
          user_answer: data.userAnswer,
          is_correct: data.isCorrect,
          response_method: data.responseMethod,
        },
      });

      logger.info('Quiz result saved successfully', {
        quizId: data.quizId,
        isCorrect: data.isCorrect,
      });

      tracker.end({ saved: true });
    } catch (error) {
      logger.error('Failed to save quiz result', {
        error: error instanceof Error ? error.message : String(error),
        quizId: data.quizId,
      });
      throw error;
    }
  }
}

export const quizRepository = new QuizRepository();
