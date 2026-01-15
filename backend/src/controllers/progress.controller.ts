import type { Request, Response } from 'express';
import { progressService } from '@/services/progress.service.js';
import logger from '@/lib/logger.js';

/**
 * Progress Controller
 * リクエスト/レスポンス処理を担当
 */
export class ProgressController {
  /**
   * GET /api/progress
   * 学習進捗データを取得
   */
  async getProgress(_req: Request, res: Response): Promise<void> {
    logger.info('GET /api/progress - Request received');

    try {
      const progress = await progressService.getLearningProgress();

      logger.info('GET /api/progress - Success', {
        totalQuizzes: progress.total_quizzes,
        accuracyRate: progress.accuracy_rate,
      });

      res.status(200).json({
        success: true,
        data: progress,
      });
    } catch (error) {
      logger.error('GET /api/progress - Failed', {
        error: error instanceof Error ? error.message : String(error),
      });

      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Failed to retrieve learning progress',
      });
    }
  }

  /**
   * GET /api/progress/graph
   * 進捗グラフデータを取得
   */
  async getProgressGraph(req: Request, res: Response): Promise<void> {
    logger.info('GET /api/progress/graph - Request received', {
      period: req.query.period,
    });

    try {
      // Validate period parameter
      const period = req.query.period as string | undefined;
      const validPeriods = ['week', 'month', 'year'];

      let selectedPeriod: 'week' | 'month' | 'year' = 'week'; // Default

      if (period) {
        if (!validPeriods.includes(period)) {
          logger.warn('GET /api/progress/graph - Invalid period parameter', {
            period,
          });

          res.status(400).json({
            success: false,
            error: 'Bad Request',
            message: 'Invalid period parameter. Must be one of: week, month, year',
          });
          return;
        }

        selectedPeriod = period as 'week' | 'month' | 'year';
      }

      const graphData = await progressService.getProgressGraphData(selectedPeriod);

      logger.info('GET /api/progress/graph - Success', {
        period: selectedPeriod,
        dataPoints: graphData.data_points.length,
      });

      res.status(200).json({
        success: true,
        data: graphData,
        period: selectedPeriod,
      });
    } catch (error) {
      logger.error('GET /api/progress/graph - Failed', {
        error: error instanceof Error ? error.message : String(error),
      });

      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Failed to retrieve progress graph data',
      });
    }
  }
}

export const progressController = new ProgressController();
