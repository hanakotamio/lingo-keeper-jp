import { progressRepository } from '@/repositories/progress.repository.js';
import logger, { PerformanceTracker } from '@/lib/logger.js';
import type {
  JLPTLevel,
  UserLearningProgress,
  ProgressGraphData,
  ProgressDataPoint,
  LevelProgress,
} from '@/types/index.js';

/**
 * Progress Service
 * ビジネスロジック処理を担当
 */
export class ProgressService {
  private readonly JLPT_LEVELS: JLPTLevel[] = ['N5', 'N4', 'N3', 'N2', 'N1'];

  /**
   * Get user learning progress
   */
  async getLearningProgress(): Promise<UserLearningProgress> {
    const tracker = new PerformanceTracker('ProgressService.getLearningProgress');
    logger.debug('Calculating learning progress');

    try {
      // Get all quiz results
      const allResults = await progressRepository.getAllQuizResults();

      // Calculate overall statistics
      const totalQuizzes = allResults.length;
      const correctCount = allResults.filter((r) => r.is_correct).length;
      const accuracyRate = totalQuizzes > 0 ? (correctCount / totalQuizzes) * 100 : 0;

      // Calculate level-specific progress
      const levelProgress: { [key in JLPTLevel]: LevelProgress } = {
        N5: { completed: 0, total: 0, accuracy: 0 },
        N4: { completed: 0, total: 0, accuracy: 0 },
        N3: { completed: 0, total: 0, accuracy: 0 },
        N2: { completed: 0, total: 0, accuracy: 0 },
        N1: { completed: 0, total: 0, accuracy: 0 },
      };

      // Group results by level
      for (const level of this.JLPT_LEVELS) {
        const levelResults = allResults.filter((r) => r.difficulty_level === level);
        const levelCorrect = levelResults.filter((r) => r.is_correct).length;
        const totalQuizzesForLevel = await progressRepository.getTotalQuizCountByLevel(level);

        levelProgress[level] = {
          completed: levelResults.length,
          total: totalQuizzesForLevel,
          accuracy: levelResults.length > 0 ? (levelCorrect / levelResults.length) * 100 : 0,
        };
      }

      // Get completed stories
      const completedStories = await progressRepository.getCompletedStories();

      // Get last updated time
      const lastUpdated =
        allResults.length > 0 ? allResults[0].answered_at.toISOString() : new Date().toISOString();

      const progress: UserLearningProgress = {
        total_quizzes: totalQuizzes,
        correct_count: correctCount,
        accuracy_rate: Math.round(accuracyRate * 10) / 10, // Round to 1 decimal place
        level_progress: levelProgress,
        last_updated: lastUpdated,
        completed_stories: completedStories,
      };

      logger.info('Learning progress calculated successfully', {
        totalQuizzes,
        correctCount,
        accuracyRate: progress.accuracy_rate,
        completedStories: completedStories.length,
      });

      tracker.end({ totalQuizzes, correctCount });

      return progress;
    } catch (error) {
      logger.error('Failed to calculate learning progress', {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  /**
   * Get progress graph data
   */
  async getProgressGraphData(period: 'week' | 'month' | 'year'): Promise<ProgressGraphData> {
    const tracker = new PerformanceTracker('ProgressService.getProgressGraphData');
    logger.debug('Generating progress graph data', { period });

    try {
      // Get quiz results for the period
      const results = await progressRepository.getQuizResultsByPeriod(period);

      if (results.length === 0) {
        logger.info('No quiz results found for period', { period });
        tracker.end({ dataPoints: 0 });

        return {
          data_points: [],
          levels: this.JLPT_LEVELS,
        };
      }

      // Group results by date and level
      const dataPointsMap = new Map<string, Map<JLPTLevel, { correct: number; total: number }>>();

      for (const result of results) {
        const dateKey = result.answered_at.toISOString().split('T')[0]; // YYYY-MM-DD
        const level = result.difficulty_level as JLPTLevel;

        if (!dataPointsMap.has(dateKey)) {
          dataPointsMap.set(dateKey, new Map());
        }

        const levelMap = dataPointsMap.get(dateKey)!;

        if (!levelMap.has(level)) {
          levelMap.set(level, { correct: 0, total: 0 });
        }

        const stats = levelMap.get(level)!;
        stats.total += 1;
        if (result.is_correct) {
          stats.correct += 1;
        }
      }

      // Convert to ProgressDataPoint array
      const dataPoints: ProgressDataPoint[] = [];

      for (const [dateKey, levelMap] of dataPointsMap.entries()) {
        for (const [level, stats] of levelMap.entries()) {
          const accuracy = stats.total > 0 ? (stats.correct / stats.total) * 100 : 0;

          dataPoints.push({
            date: `${dateKey}T00:00:00.000Z`, // ISO 8601 format
            accuracy_rate: Math.round(accuracy * 10) / 10, // Round to 1 decimal place
            level: level,
          });
        }
      }

      // Sort by date
      dataPoints.sort((a, b) => a.date.localeCompare(b.date));

      // Get unique levels that have data
      const levelsWithData = [...new Set(dataPoints.map((dp) => dp.level))];

      logger.info('Progress graph data generated successfully', {
        period,
        dataPoints: dataPoints.length,
        levelsWithData: levelsWithData.length,
      });

      tracker.end({ period, dataPoints: dataPoints.length });

      return {
        data_points: dataPoints,
        levels: levelsWithData,
      };
    } catch (error) {
      logger.error('Failed to generate progress graph data', {
        error: error instanceof Error ? error.message : String(error),
        period,
      });
      throw error;
    }
  }
}

export const progressService = new ProgressService();
