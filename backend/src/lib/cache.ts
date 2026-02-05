import NodeCache from 'node-cache';
import logger from './logger.js';

/**
 * Application-wide cache instance
 *
 * Configuration:
 * - stdTTL: 300 seconds (5 minutes) - default expiration
 * - checkperiod: 60 seconds - automatic cleanup interval
 * - useClones: false - return direct references (better performance)
 */
const cache = new NodeCache({
  stdTTL: 300, // 5 minutes
  checkperiod: 60, // Check for expired keys every minute
  useClones: false, // Better performance, be careful with mutations
});

/**
 * Cache key prefixes for different data types
 */
export const CacheKeys = {
  STORIES_ALL: 'stories:all',
  STORIES_BY_LEVEL: (levelFilter: string) => `stories:level:${levelFilter}`,
  STORY_BY_ID: (storyId: string) => `story:${storyId}`,
  CHAPTERS_BY_STORY: (storyId: string) => `chapters:story:${storyId}`,
  QUIZZES_BY_STORY: (storyId: string) => `quizzes:story:${storyId}`,
  QUIZZES_ALL: 'quizzes:all',
  QUIZ_BY_ID: (quizId: string) => `quiz:${quizId}`,
};

/**
 * Cache TTL (Time To Live) configurations in seconds
 */
export const CacheTTL = {
  STORIES: 300, // 5 minutes - stories rarely change
  CHAPTERS: 600, // 10 minutes - chapters are static content
  QUIZZES: 300, // 5 minutes - quizzes rarely change
};

/**
 * Event logging for cache operations (debugging)
 */
cache.on('set', (key) => {
  logger.debug('Cache SET', { key, ttl: cache.getTtl(key) });
});

cache.on('expired', (key) => {
  logger.debug('Cache EXPIRED', { key });
});

cache.on('del', (key) => {
  logger.debug('Cache DEL', { key });
});

export default cache;
