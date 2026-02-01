import type { Request, Response } from 'express';
import { quizService } from '@/services/quiz.service.js';
import logger from '@/lib/logger.js';

/**
 * Quiz Controller
 * リクエスト処理とレスポンス形成を担当
 */
export class QuizController {
  /**
   * GET /api/quizzes?story_id=xxx
   * Get all quizzes for a specific story, or all quizzes if no story_id provided
   */
  async getQuizzes(req: Request, res: Response): Promise<void> {
    const storyId = req.query.story_id as string | undefined;
    logger.info('GET /api/quizzes', { storyId });

    try {
      let quizzes;

      if (storyId) {
        quizzes = await quizService.getQuizzesByStoryId(storyId);
      } else {
        quizzes = await quizService.getAllQuizzes();
      }

      res.status(200).json({
        success: true,
        data: quizzes,
        count: quizzes.length,
      });

      logger.info('Quizzes returned successfully', {
        count: quizzes.length,
        storyId,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error('Failed to get quizzes', {
        error: errorMessage,
        storyId,
      });

      // Check if it's a validation error
      if (errorMessage.includes('required')) {
        res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: errorMessage,
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'production'
          ? 'Failed to retrieve quizzes'
          : errorMessage,
      });
    }
  }

  /**
   * GET /api/quizzes/:id
   * Get specific quiz by ID
   */
  async getQuizById(req: Request, res: Response): Promise<void> {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    logger.info('GET /api/quizzes/:id', { quizId: id });

    try {
      const quiz = await quizService.getQuizById(id);

      res.status(200).json({
        success: true,
        data: quiz,
      });

      logger.info('Quiz returned successfully', {
        quizId: id,
        questionType: quiz.question_type,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error('Failed to get quiz', {
        error: errorMessage,
        quizId: id,
      });

      // Check if it's a not found error
      if (errorMessage.includes('not found')) {
        res.status(404).json({
          success: false,
          error: 'Not Found',
          message: errorMessage,
        });
        return;
      }

      // Check if it's a validation error
      if (errorMessage.includes('required')) {
        res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: errorMessage,
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'production'
          ? 'Failed to retrieve quiz'
          : errorMessage,
      });
    }
  }
}

export const quizController = new QuizController();
