import { storyRepository } from '@/repositories/story.repository.js';
import logger, { PerformanceTracker } from '@/lib/logger.js';
import type { Story, Chapter, LevelFilter } from '@/types/index.js';

/**
 * Story Service
 * ビジネスロジックを担当
 */
export class StoryService {
  /**
   * Get all stories with optional level filter
   */
  async getStoryList(levelFilter?: LevelFilter): Promise<Story[]> {
    const tracker = new PerformanceTracker('StoryService.getStoryList');
    logger.info('Getting story list', { levelFilter });

    try {
      // Validate level filter if provided
      if (levelFilter && levelFilter !== 'all') {
        const validFilters = ['N5-A1', 'N4-A2', 'N3-B1', 'N2-B2', 'N1-C1'];
        if (!validFilters.includes(levelFilter)) {
          const error = new Error(`Invalid level filter: ${levelFilter}`);
          logger.error('Invalid level filter', { levelFilter, validFilters });
          throw error;
        }
      }

      const stories = await storyRepository.findAllStories(levelFilter);

      logger.info('Story list retrieved successfully', {
        count: stories.length,
        levelFilter,
      });

      tracker.end({ storiesCount: stories.length });
      return stories;
    } catch (error) {
      logger.error('Failed to get story list', {
        error: error instanceof Error ? error.message : String(error),
        levelFilter,
      });
      throw error;
    }
  }

  /**
   * Get story by ID
   */
  async getStoryById(storyId: string): Promise<Story> {
    const tracker = new PerformanceTracker('StoryService.getStoryById');
    logger.info('Getting story by ID', { storyId });

    try {
      // Validate story ID
      if (!storyId || storyId.trim() === '') {
        const error = new Error('Story ID is required');
        logger.error('Invalid story ID', { storyId });
        throw error;
      }

      const story = await storyRepository.findStoryById(storyId);

      if (!story) {
        const error = new Error(`Story not found: ${storyId}`);
        logger.error('Story not found', { storyId });
        throw error;
      }

      logger.info('Story retrieved successfully', {
        storyId,
        title: story.title,
      });

      tracker.end({ storyId });
      return story;
    } catch (error) {
      logger.error('Failed to get story', {
        error: error instanceof Error ? error.message : String(error),
        storyId,
      });
      throw error;
    }
  }

  /**
   * Get chapter by ID
   */
  async getChapterById(chapterId: string): Promise<Chapter> {
    const tracker = new PerformanceTracker('StoryService.getChapterById');
    logger.info('Getting chapter by ID', { chapterId });

    try {
      // Validate chapter ID
      if (!chapterId || chapterId.trim() === '') {
        const error = new Error('Chapter ID is required');
        logger.error('Invalid chapter ID', { chapterId });
        throw error;
      }

      const chapter = await storyRepository.findChapterById(chapterId);

      if (!chapter) {
        const error = new Error(`Chapter not found: ${chapterId}`);
        logger.error('Chapter not found', { chapterId });
        throw error;
      }

      logger.info('Chapter retrieved successfully', {
        chapterId,
        chapterNumber: chapter.chapter_number,
        choicesCount: chapter.choices.length,
      });

      tracker.end({ chapterId, choicesCount: chapter.choices.length });
      return chapter;
    } catch (error) {
      logger.error('Failed to get chapter', {
        error: error instanceof Error ? error.message : String(error),
        chapterId,
      });
      throw error;
    }
  }

  /**
   * Get chapters by story ID
   */
  async getChaptersByStoryId(storyId: string): Promise<Chapter[]> {
    const tracker = new PerformanceTracker('StoryService.getChaptersByStoryId');
    logger.info('Getting chapters by story ID', { storyId });

    try {
      // Validate story ID
      if (!storyId || storyId.trim() === '') {
        const error = new Error('Story ID is required');
        logger.error('Invalid story ID', { storyId });
        throw error;
      }

      // Verify story exists
      const story = await storyRepository.findStoryById(storyId);
      if (!story) {
        const error = new Error(`Story not found: ${storyId}`);
        logger.error('Story not found', { storyId });
        throw error;
      }

      const chapters = await storyRepository.findChaptersByStoryId(storyId);

      logger.info('Chapters retrieved successfully', {
        storyId,
        count: chapters.length,
      });

      tracker.end({ storyId, chaptersCount: chapters.length });
      return chapters;
    } catch (error) {
      logger.error('Failed to get chapters', {
        error: error instanceof Error ? error.message : String(error),
        storyId,
      });
      throw error;
    }
  }
}

export const storyService = new StoryService();
