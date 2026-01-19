import prisma from '@/lib/db.js';
import logger, { PerformanceTracker } from '@/lib/logger.js';
import type { JLPTLevel } from '@/types/index.js';

/**
 * Progress Repository
 * データベースアクセス処理を担当
 */
export class ProgressRepository {
  /**
   * Get all quiz results
   */
  async getAllQuizResults(): Promise<
    Array<{
      result_id: string;
      quiz_id: string;
      is_correct: boolean;
      answered_at: Date;
      difficulty_level: string;
      story_id: string;
    }>
  > {
    const tracker = new PerformanceTracker('ProgressRepository.getAllQuizResults');
    logger.debug('Getting all quiz results');

    try {
      const results = await prisma.quizResult.findMany({
        include: {
          quiz: {
            select: {
              difficulty_level: true,
              story_id: true,
            },
          },
        },
        orderBy: {
          answered_at: 'desc',
        },
      });

      logger.info('Quiz results retrieved successfully', {
        count: results.length,
      });

      tracker.end({ count: results.length });

      return results.map((result) => ({
        result_id: result.result_id,
        quiz_id: result.quiz_id,
        is_correct: result.is_correct,
        answered_at: result.answered_at,
        difficulty_level: result.quiz.difficulty_level,
        story_id: result.quiz.story_id,
      }));
    } catch (error) {
      logger.error('Failed to retrieve quiz results', {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  /**
   * Get quiz results by period
   */
  async getQuizResultsByPeriod(
    period: 'week' | 'month' | 'year'
  ): Promise<
    Array<{
      result_id: string;
      quiz_id: string;
      is_correct: boolean;
      answered_at: Date;
      difficulty_level: string;
      story_id: string;
    }>
  > {
    const tracker = new PerformanceTracker('ProgressRepository.getQuizResultsByPeriod');
    logger.debug('Getting quiz results by period', { period });

    try {
      // Calculate date threshold
      const now = new Date();
      const threshold = new Date(now);

      switch (period) {
        case 'week':
          threshold.setDate(now.getDate() - 7);
          break;
        case 'month':
          threshold.setDate(now.getDate() - 30);
          break;
        case 'year':
          threshold.setDate(now.getDate() - 365);
          break;
      }

      const results = await prisma.quizResult.findMany({
        where: {
          answered_at: {
            gte: threshold,
          },
        },
        include: {
          quiz: {
            select: {
              difficulty_level: true,
              story_id: true,
            },
          },
        },
        orderBy: {
          answered_at: 'asc',
        },
      });

      logger.info('Quiz results by period retrieved successfully', {
        period,
        count: results.length,
        threshold: threshold.toISOString(),
      });

      tracker.end({ period, count: results.length });

      return results.map((result) => ({
        result_id: result.result_id,
        quiz_id: result.quiz_id,
        is_correct: result.is_correct,
        answered_at: result.answered_at,
        difficulty_level: result.quiz.difficulty_level,
        story_id: result.quiz.story_id,
      }));
    } catch (error) {
      logger.error('Failed to retrieve quiz results by period', {
        error: error instanceof Error ? error.message : String(error),
        period,
      });
      throw error;
    }
  }

  /**
   * Get completed stories (stories with quiz results)
   */
  async getCompletedStories(): Promise<string[]> {
    const tracker = new PerformanceTracker('ProgressRepository.getCompletedStories');
    logger.debug('Getting completed stories');

    try {
      const results = await prisma.quizResult.findMany({
        distinct: ['quiz_id'],
        select: {
          quiz: {
            select: {
              story_id: true,
            },
          },
        },
      });

      // Extract unique story IDs
      const storyIds = [...new Set(results.map((r) => r.quiz.story_id))];

      logger.info('Completed stories retrieved successfully', {
        count: storyIds.length,
      });

      tracker.end({ count: storyIds.length });

      return storyIds;
    } catch (error) {
      logger.error('Failed to retrieve completed stories', {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  /**
   * Get total quiz count by level
   */
  async getTotalQuizCountByLevel(level: JLPTLevel): Promise<number> {
    const tracker = new PerformanceTracker('ProgressRepository.getTotalQuizCountByLevel');
    logger.debug('Getting total quiz count by level', { level });

    try {
      const count = await prisma.quiz.count({
        where: {
          difficulty_level: level,
        },
      });

      logger.info('Total quiz count by level retrieved', {
        level,
        count,
      });

      tracker.end({ level, count });

      return count;
    } catch (error) {
      logger.error('Failed to get total quiz count by level', {
        error: error instanceof Error ? error.message : String(error),
        level,
      });
      throw error;
    }
  }

  /**
   * Get total quiz count by all levels (optimization for N+1 problem)
   * Uses groupBy to fetch all counts in a single query
   */
  async getTotalQuizCountByAllLevels(): Promise<Record<JLPTLevel, number>> {
    const tracker = new PerformanceTracker('ProgressRepository.getTotalQuizCountByAllLevels');
    logger.debug('Getting total quiz count by all levels');

    try {
      const counts = await prisma.quiz.groupBy({
        by: ['difficulty_level'],
        _count: {
          quiz_id: true,
        },
      });

      const result: Record<string, number> = {};
      counts.forEach((item) => {
        result[item.difficulty_level] = item._count.quiz_id;
      });

      logger.info('Total quiz counts by all levels retrieved', {
        counts: result,
      });

      tracker.end({ counts: result });

      return result as Record<JLPTLevel, number>;
    } catch (error) {
      logger.error('Failed to get total quiz count by all levels', {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }
}

export const progressRepository = new ProgressRepository();
