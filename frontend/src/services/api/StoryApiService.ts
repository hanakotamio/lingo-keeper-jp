import { apiClient } from './axios';
import { API_PATHS } from '@/types';
import type { Story, Chapter, LevelFilter } from '@/types';
import { logger } from '@/lib/logger';

/**
 * Story API Service
 *
 * This service provides real API integration for story experience functionality.
 * Replaces mock implementation with actual backend API calls.
 */
export class StoryApiService {
  /**
   * Get list of stories
   * Endpoint: GET /api/stories
   * Response: { success: boolean, data: Story[], count: number }
   */
  static async getStoryList(levelFilter?: LevelFilter): Promise<Story[]> {
    logger.debug('Fetching story list from API', {
      endpoint: API_PATHS.STORIES.LIST,
      levelFilter,
    });

    try {
      const response = await apiClient.get<{
        success: boolean;
        data: Story[];
        count: number;
      }>(API_PATHS.STORIES.LIST);

      if (!response.data.success) {
        throw new Error('API returned unsuccessful response');
      }

      let filteredStories = response.data.data;

      // Apply level filter (client-side for now)
      if (levelFilter && levelFilter !== 'all') {
        filteredStories = response.data.data.filter((story) => {
          const storyLevel = `${story.level_jlpt}-${story.level_cefr}`;
          return storyLevel === levelFilter;
        });
      }

      logger.info('Story list fetched successfully from API', {
        count: filteredStories.length,
        levelFilter,
      });

      return filteredStories;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      logger.error('Failed to fetch story list from API', {
        error: error.message,
        endpoint: API_PATHS.STORIES.LIST,
      });
      throw error;
    }
  }

  /**
   * Get specific story by ID
   * Endpoint: GET /api/stories/:id
   * Response: { success: boolean, data: Story }
   */
  static async getStoryById(storyId: string): Promise<Story> {
    logger.debug('Fetching story by ID from API', {
      storyId,
      endpoint: API_PATHS.STORIES.DETAIL(storyId),
    });

    try {
      const response = await apiClient.get<{
        success: boolean;
        data: Story;
      }>(API_PATHS.STORIES.DETAIL(storyId));

      if (!response.data.success) {
        throw new Error('API returned unsuccessful response');
      }

      logger.info('Story fetched successfully from API', {
        storyId,
        title: response.data.data.title,
      });

      return response.data.data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      logger.error('Failed to fetch story from API', {
        error: error.message,
        storyId,
      });
      throw error;
    }
  }

  /**
   * Get all chapters for a story
   * Endpoint: GET /api/stories/:id/chapters
   * Response: { success: boolean, data: Chapter[] }
   */
  static async getChaptersByStoryId(storyId: string): Promise<Chapter[]> {
    logger.debug('Fetching chapters by story ID from API', {
      storyId,
      endpoint: API_PATHS.STORIES.CHAPTERS(storyId),
    });

    try {
      const response = await apiClient.get<{
        success: boolean;
        data: Chapter[];
      }>(API_PATHS.STORIES.CHAPTERS(storyId));

      if (!response.data.success) {
        throw new Error('API returned unsuccessful response');
      }

      logger.info('Chapters fetched successfully from API', {
        storyId,
        count: response.data.data.length,
      });

      return response.data.data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      logger.error('Failed to fetch chapters from API', {
        error: error.message,
        storyId,
      });
      throw error;
    }
  }

  /**
   * Get chapter by ID
   * Endpoint: GET /api/chapters/:id
   * Response: { success: boolean, data: Chapter }
   */
  static async getChapterById(chapterId: string): Promise<Chapter> {
    logger.debug('Fetching chapter by ID from API', {
      chapterId,
      endpoint: API_PATHS.CHAPTERS.DETAIL(chapterId),
    });

    try {
      const response = await apiClient.get<{
        success: boolean;
        data: Chapter;
      }>(API_PATHS.CHAPTERS.DETAIL(chapterId));

      if (!response.data.success) {
        throw new Error('API returned unsuccessful response');
      }

      logger.info('Chapter fetched successfully from API', {
        chapterId,
        chapterNumber: response.data.data.chapter_number,
      });

      return response.data.data;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      logger.error('Failed to fetch chapter from API', {
        error: error.message,
        chapterId,
      });
      throw error;
    }
  }
}

export const storyApiService = new StoryApiService();
