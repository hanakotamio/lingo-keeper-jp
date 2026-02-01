import { quizRepository } from '@/repositories/quiz.repository.js';
import logger, { PerformanceTracker } from '@/lib/logger.js';
import type { Quiz } from '@/types/index.js';

/**
 * Quiz Service
 * ビジネスロジックを担当
 */
export class QuizService {
  /**
   * Get all quizzes for a specific story
   */
  async getQuizzesByStoryId(storyId: string): Promise<Quiz[]> {
    const tracker = new PerformanceTracker('QuizService.getQuizzesByStoryId');
    logger.info('Getting quizzes by story ID', { storyId });

    try {
      // Validate story ID
      if (!storyId || storyId.trim() === '') {
        const error = new Error('Story ID is required');
        logger.error('Invalid story ID', { storyId });
        throw error;
      }

      const quizzes = await quizRepository.findQuizzesByStoryId(storyId);

      logger.info('Quizzes retrieved successfully', {
        storyId,
        count: quizzes.length,
      });

      tracker.end({ storyId, quizzesCount: quizzes.length });
      return quizzes;
    } catch (error) {
      logger.error('Failed to get quizzes', {
        error: error instanceof Error ? error.message : String(error),
        storyId,
      });
      throw error;
    }
  }

  /**
   * Get quiz by ID
   */
  async getQuizById(quizId: string): Promise<Quiz> {
    const tracker = new PerformanceTracker('QuizService.getQuizById');
    logger.info('Getting quiz by ID', { quizId });

    try {
      // Validate quiz ID
      if (!quizId || quizId.trim() === '') {
        const error = new Error('Quiz ID is required');
        logger.error('Invalid quiz ID', { quizId });
        throw error;
      }

      const quiz = await quizRepository.findQuizById(quizId);

      if (!quiz) {
        const error = new Error(`Quiz not found: ${quizId}`);
        logger.error('Quiz not found', { quizId });
        throw error;
      }

      logger.info('Quiz retrieved successfully', {
        quizId,
        questionType: quiz.question_type,
      });

      tracker.end({ quizId });
      return quiz;
    } catch (error) {
      logger.error('Failed to get quiz', {
        error: error instanceof Error ? error.message : String(error),
        quizId,
      });
      throw error;
    }
  }

  /**
   * Get all quizzes
   */
  async getAllQuizzes(): Promise<Quiz[]> {
    const tracker = new PerformanceTracker('QuizService.getAllQuizzes');
    logger.info('Getting all quizzes');

    try {
      const quizzes = await quizRepository.findAllQuizzes();

      logger.info('All quizzes retrieved successfully', {
        count: quizzes.length,
      });

      tracker.end({ quizzesCount: quizzes.length });
      return quizzes;
    } catch (error) {
      logger.error('Failed to get all quizzes', {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }
}

export const quizService = new QuizService();
