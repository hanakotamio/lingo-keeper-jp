import { apiClient } from './axios';
import { API_PATHS } from '@/types';
import type { Quiz, QuizFeedback } from '@/types';
import { logger } from '@/lib/logger';

/**
 * Quiz API Service
 *
 * This service provides real API integration for quiz functionality.
 * Replaces mock implementation with actual backend API calls.
 */
export class QuizApiService {
  /**
   * Get random quiz
   * Endpoint: GET /api/quizzes
   * Response: { success: boolean, data: Quiz }
   */
  static async getRandomQuiz(): Promise<Quiz> {
    logger.debug('Fetching random quiz from API', {
      endpoint: API_PATHS.QUIZZES.LIST,
    });

    try {
      const response = await apiClient.get<{
        success: boolean;
        data: Quiz;
      }>(API_PATHS.QUIZZES.LIST);

      if (!response.data.success) {
        throw new Error('API returned unsuccessful response');
      }

      logger.info('Random quiz fetched successfully from API', {
        quizId: response.data.data.quiz_id,
        questionType: response.data.data.question_type,
      });

      return response.data.data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      logger.error('Failed to fetch random quiz from API', {
        error: error.message,
        endpoint: API_PATHS.QUIZZES.LIST,
      });
      throw error;
    }
  }

  /**
   * Get quizzes by story ID
   * Endpoint: GET /api/quizzes?story_id={storyId}
   * Response: { success: boolean, data: Quiz[], count: number }
   */
  static async getQuizzesByStory(storyId: string): Promise<Quiz[]> {
    logger.debug('Fetching quizzes by story from API', {
      storyId,
      endpoint: API_PATHS.QUIZZES.BY_STORY(storyId),
    });

    try {
      const response = await apiClient.get<{
        success: boolean;
        data: Quiz[];
        count: number;
      }>(API_PATHS.QUIZZES.BY_STORY(storyId));

      if (!response.data.success) {
        throw new Error('API returned unsuccessful response');
      }

      logger.info('Quizzes fetched successfully from API', {
        storyId,
        count: response.data.count,
      });

      return response.data.data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      logger.error('Failed to fetch quizzes by story from API', {
        error: error.message,
        storyId,
      });
      throw error;
    }
  }

  /**
   * Submit quiz answer and get feedback
   * Endpoint: POST /api/quizzes/answer
   * Request: { quiz_id: string, user_answer: string, response_method: '音声' | 'テキスト' }
   * Response: { success: boolean, data: QuizFeedback }
   */
  static async submitAnswer(
    quizId: string,
    userAnswer: string,
    responseMethod: '音声' | 'テキスト'
  ): Promise<QuizFeedback> {
    logger.debug('Submitting quiz answer to API', {
      quizId,
      responseMethod,
      endpoint: API_PATHS.QUIZZES.ANSWER,
    });

    try {
      const response = await apiClient.post<{
        success: boolean;
        data: QuizFeedback;
      }>(API_PATHS.QUIZZES.ANSWER, {
        quiz_id: quizId,
        user_answer: userAnswer,
        response_method: responseMethod,
      });

      if (!response.data.success) {
        throw new Error('API returned unsuccessful response');
      }

      logger.info('Quiz answer submitted successfully to API', {
        quizId,
        isCorrect: response.data.data.is_correct,
      });

      return response.data.data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      logger.error('Failed to submit quiz answer to API', {
        error: error.message,
        quizId,
      });
      throw error;
    }
  }
}

export const quizApiService = new QuizApiService();
