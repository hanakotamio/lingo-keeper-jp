import type { Request, Response } from 'express';
import { quizService } from '@/services/quiz.service.js';
import logger from '@/lib/logger.js';

/**
 * Quiz Controller
 * リクエスト処理とレスポンス形成を担当
 */
export class QuizController {
  /**
   * GET /api/quizzes
   * Get random quiz (1 question)
   */
  async getRandomQuiz(_req: Request, res: Response): Promise<void> {
    logger.info('GET /api/quizzes');

    try {
      const quiz = await quizService.getRandomQuiz();

      res.status(200).json({
        success: true,
        data: quiz,
      });

      logger.info('Random quiz returned successfully', {
        quizId: quiz.quiz_id,
        questionType: quiz.question_type,
        difficultyLevel: quiz.difficulty_level,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error('Failed to get random quiz', {
        error: errorMessage,
      });

      // Check if it's a no quizzes available error
      if (errorMessage.includes('No quizzes available')) {
        res.status(404).json({
          success: false,
          error: 'Not Found',
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

  /**
   * GET /api/quizzes/story/:storyId
   * Get quizzes by story ID
   */
  async getQuizzesByStoryId(req: Request, res: Response): Promise<void> {
    const storyId = Array.isArray(req.params.storyId) ? req.params.storyId[0] : req.params.storyId;
    logger.info('GET /api/quizzes/story/:storyId', { storyId });

    try {
      const quizzes = await quizService.getQuizzesByStoryId(storyId);

      res.status(200).json({
        success: true,
        data: quizzes,
        count: quizzes.length,
      });

      logger.info('Quizzes returned successfully', {
        storyId,
        count: quizzes.length,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error('Failed to get quizzes by story ID', {
        error: errorMessage,
        storyId,
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
          ? 'Failed to retrieve quizzes'
          : errorMessage,
      });
    }
  }

  /**
   * POST /api/quizzes/answer
   * Submit quiz answer and get feedback
   */
  async submitQuizAnswer(req: Request, res: Response): Promise<void> {
    logger.info('POST /api/quizzes/answer', {
      quizId: req.body.quiz_id,
      responseMethod: req.body.response_method,
    });

    try {
      // Extract and validate request body
      const { quiz_id, user_answer, response_method } = req.body as {
        quiz_id?: string;
        user_answer?: string;
        response_method?: '音声' | 'テキスト';
      };

      // Validate required fields
      if (!quiz_id || !user_answer || !response_method) {
        res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'quiz_id, user_answer, and response_method are required',
        });
        return;
      }

      // Validate response_method
      if (response_method !== '音声' && response_method !== 'テキスト') {
        res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'response_method must be either "音声" or "テキスト"',
        });
        return;
      }

      const feedback = await quizService.submitQuizAnswer({
        quizId: quiz_id,
        userAnswer: user_answer,
        responseMethod: response_method,
      });

      res.status(200).json({
        success: true,
        data: feedback,
      });

      logger.info('Quiz answer submitted successfully', {
        quizId: quiz_id,
        isCorrect: feedback.is_correct,
        responseMethod: response_method,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error('Failed to submit quiz answer', {
        error: errorMessage,
        quizId: req.body.quiz_id,
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
      if (errorMessage.includes('required') || errorMessage.includes('Invalid')) {
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
          ? 'Failed to submit quiz answer'
          : errorMessage,
      });
    }
  }
}

export const quizController = new QuizController();
