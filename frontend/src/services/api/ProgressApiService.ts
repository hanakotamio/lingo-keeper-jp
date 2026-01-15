import { apiClient } from './axios';
import { API_PATHS } from '@/types';
import type { UserLearningProgress, ProgressGraphData } from '@/types';
import { logger } from '@/lib/logger';

/**
 * Progress API Service
 *
 * This service provides real API integration for progress functionality.
 * Replaces mock implementation with actual backend API calls.
 */
export class ProgressApiService {
  /**
   * Get user learning progress
   * Endpoint: GET /api/progress
   * Response: { success: boolean, data: UserLearningProgress }
   */
  static async getLearningProgress(): Promise<UserLearningProgress> {
    logger.debug('Fetching learning progress from API', {
      endpoint: API_PATHS.PROGRESS.LEARNING,
    });

    try {
      const response = await apiClient.get<{
        success: boolean;
        data: UserLearningProgress;
      }>(API_PATHS.PROGRESS.LEARNING);

      if (!response.data.success) {
        throw new Error('API returned unsuccessful response');
      }

      logger.info('Learning progress fetched successfully from API', {
        accuracyRate: response.data.data.accuracy_rate,
        totalQuizzes: response.data.data.total_quizzes,
      });

      return response.data.data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      logger.error('Failed to fetch learning progress from API', {
        error: error.message,
        endpoint: API_PATHS.PROGRESS.LEARNING,
      });
      throw error;
    }
  }

  /**
   * Get progress graph data
   * Endpoint: GET /api/progress/graph?period={week|month|year}
   * Response: { success: boolean, data: ProgressGraphData }
   */
  static async getProgressGraphData(period: 'week' | 'month' | 'year' = 'week'): Promise<ProgressGraphData> {
    logger.debug('Fetching progress graph data from API', {
      endpoint: API_PATHS.PROGRESS.GRAPH,
      period,
    });

    try {
      const response = await apiClient.get<{
        success: boolean;
        data: ProgressGraphData;
      }>(`${API_PATHS.PROGRESS.GRAPH}?period=${period}`);

      if (!response.data.success) {
        throw new Error('API returned unsuccessful response');
      }

      logger.info('Progress graph data fetched successfully from API', {
        dataPoints: response.data.data.data_points.length,
        levels: response.data.data.levels,
        period,
      });

      return response.data.data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      logger.error('Failed to fetch progress graph data from API', {
        error: error.message,
        endpoint: API_PATHS.PROGRESS.GRAPH,
        period,
      });
      throw error;
    }
  }
}

export const progressApiService = new ProgressApiService();
