import { useState, useEffect, useCallback } from 'react';
import { StoryApiService } from '@/services/api/StoryApiService';
import type { Story, LevelFilter } from '@/types';
import { logger } from '@/lib/logger';

/**
 * Custom hook for fetching and managing story list data
 * Now uses real API integration via StoryApiService
 */
export const useStoryData = (levelFilter?: LevelFilter) => {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      logger.debug('Fetching stories', {
        hookName: 'useStoryData',
        levelFilter
      });

      const result = await StoryApiService.getStoryList(levelFilter);
      setStories(result);

      logger.info('Stories fetched successfully', {
        count: result.length,
        hookName: 'useStoryData'
      });
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));

      logger.error('Failed to fetch stories', {
        error: error.message,
        hookName: 'useStoryData',
        levelFilter
      });

      setError(error);
    } finally {
      setLoading(false);
    }
  }, [levelFilter]);

  useEffect(() => {
    logger.debug('Hook mounted', {
      hookName: 'useStoryData',
      levelFilter
    });

    fetchStories();
  }, [fetchStories, levelFilter]);

  return {
    stories,
    loading,
    error,
    refetch: fetchStories,
  };
};
