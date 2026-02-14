import prisma from '@/lib/db.js';
import logger, { PerformanceTracker } from '@/lib/logger.js';
import cache, { CacheKeys, CacheTTL } from '@/lib/cache.js';
import type { Story, Chapter, JLPTLevel, CEFRLevel, LevelFilter } from '@/types/index.js';

/**
 * Story Repository
 * データベースアクセス処理を担当
 */
export class StoryRepository {
  /**
   * Convert Prisma Story to application Story type
   */
  private toDomainStory(prismaStory: any): Story {
    return {
      story_id: prismaStory.story_id,
      title: prismaStory.title,
      title_en: prismaStory.title_en || undefined,
      description: prismaStory.description,
      description_en: prismaStory.description_en || undefined,
      level_jlpt: (prismaStory.level_jlpt as JLPTLevel) || 'N5',
      level_cefr: (prismaStory.level_cefr as CEFRLevel) || 'A1',
      estimated_time: prismaStory.estimated_time || 10,
      thumbnail_url: prismaStory.thumbnail_url || undefined,
      root_chapter_id: prismaStory.root_chapter_id,
      created_at: prismaStory.created_at.toISOString(),
      updated_at: prismaStory.updated_at.toISOString(),
    };
  }

  /**
   * Convert Prisma Chapter to application Chapter type
   */
  private toDomainChapter(
    prismaChapter: any
  ): Chapter {
    return {
      chapter_id: prismaChapter.chapter_id,
      story_id: prismaChapter.story_id,
      parent_chapter_id: prismaChapter.parent_chapter_id || undefined,
      chapter_number: prismaChapter.chapter_number,
      title: prismaChapter.title,
      content: prismaChapter.content,
      content_en: prismaChapter.content_en || undefined,
      audio_url: prismaChapter.audio_url || undefined,
      learning_points: prismaChapter.learning_points ? (prismaChapter.learning_points as any) : undefined,
      vocabulary: prismaChapter.vocabulary ? (prismaChapter.vocabulary as any) : undefined,
      created_at: prismaChapter.created_at.toISOString(),
      choices: prismaChapter.choices?.map((choice: any) => ({
        choice_id: choice.choice_id,
        chapter_id: choice.chapter_id,
        choice_text: choice.choice_text,
        next_chapter_id: choice.next_chapter_id || undefined,
        difficulty_adjustment: choice.difficulty_adjustment,
        ending_type: choice.ending_type || undefined,
        created_at: choice.created_at.toISOString(),
      })) || [],
    };
  }

  /**
   * Get all stories with optional level filter
   */
  async findAllStories(levelFilter?: LevelFilter): Promise<Story[]> {
    const tracker = new PerformanceTracker('StoryRepository.findAllStories');
    logger.debug('Finding all stories', { levelFilter });

    // Check cache first
    const cacheKey = levelFilter
      ? CacheKeys.STORIES_BY_LEVEL(levelFilter)
      : CacheKeys.STORIES_ALL;

    const cached = cache.get<Story[]>(cacheKey);
    if (cached) {
      logger.debug('Cache HIT', { cacheKey, count: cached.length });
      tracker.end({ cached: true });
      return cached;
    }

    logger.debug('Cache MISS', { cacheKey });

    try{
      const whereClause: { level_jlpt?: string; level_cefr?: string } = {};

      // Apply level filter if provided
      if (levelFilter && levelFilter !== 'all') {
        const [jlpt, cefr] = levelFilter.split('-');
        if (jlpt && cefr) {
          whereClause.level_jlpt = jlpt;
          whereClause.level_cefr = cefr;
        }
      }

      const stories = await prisma.story.findMany({
        where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
        orderBy: [
          { level_jlpt: 'desc' }, // N5 -> N1
          { created_at: 'desc' },
        ],
      });

      // Filter out stories with null level_jlpt or level_cefr AFTER fetching
      const validStories = stories.filter(
        (story) => story.level_jlpt !== null && story.level_cefr !== null
      );

      logger.info('Stories retrieved successfully', {
        count: validStories.length,
        filteredOut: stories.length - validStories.length,
        levelFilter,
      });

      const result = validStories.map((story) => this.toDomainStory(story));

      // Store in cache
      cache.set(cacheKey, result, CacheTTL.STORIES);
      logger.debug('Cache SET', { cacheKey, count: result.length });

      tracker.end({ storiesCount: validStories.length });
      return result;
    } catch (error) {
      logger.error('Failed to retrieve stories', {
        error: error instanceof Error ? error.message : String(error),
        levelFilter,
      });
      throw error;
    }
  }

  /**
   * Get story by ID
   */
  async findStoryById(storyId: string): Promise<Story | null> {
    const tracker = new PerformanceTracker('StoryRepository.findStoryById');
    logger.debug('Finding story by ID', { storyId });

    try {
      const story = await prisma.story.findUnique({
        where: { story_id: storyId },
      });

      if (!story) {
        logger.warn('Story not found', { storyId });
        tracker.end({ found: false });
        return null;
      }

      logger.info('Story retrieved successfully', {
        storyId,
        title: story.title,
      });

      tracker.end({ found: true });
      return this.toDomainStory(story);
    } catch (error) {
      logger.error('Failed to retrieve story', {
        error: error instanceof Error ? error.message : String(error),
        storyId,
      });
      throw error;
    }
  }

  /**
   * Get chapter by ID with choices
   */
  async findChapterById(chapterId: string): Promise<Chapter | null> {
    const tracker = new PerformanceTracker('StoryRepository.findChapterById');
    logger.debug('Finding chapter by ID', { chapterId });

    try {
      const chapter = await prisma.chapter.findUnique({
        where: { chapter_id: chapterId },
        include: {
          choices: true,
        },
      });

      if (!chapter) {
        logger.warn('Chapter not found', { chapterId });
        tracker.end({ found: false });
        return null;
      }

      logger.info('Chapter retrieved successfully', {
        chapterId,
        chapterNumber: chapter.chapter_number,
        choicesCount: chapter.choices.length,
      });

      tracker.end({ found: true, choicesCount: chapter.choices.length });
      return this.toDomainChapter(chapter);
    } catch (error) {
      logger.error('Failed to retrieve chapter', {
        error: error instanceof Error ? error.message : String(error),
        chapterId,
      });
      throw error;
    }
  }

  /**
   * Get chapters by story ID
   */
  async findChaptersByStoryId(storyId: string): Promise<Chapter[]> {
    const tracker = new PerformanceTracker('StoryRepository.findChaptersByStoryId');
    logger.debug('Finding chapters by story ID', { storyId });

    try {
      const chapters = await prisma.chapter.findMany({
        where: { story_id: storyId },
        include: {
          choices: true,
        },
        orderBy: [
          { chapter_number: 'asc' },
        ],
      });

      logger.info('Chapters retrieved successfully', {
        storyId,
        count: chapters.length,
      });

      tracker.end({ chaptersCount: chapters.length });
      return chapters.map((chapter) => this.toDomainChapter(chapter));
    } catch (error) {
      logger.error('Failed to retrieve chapters', {
        error: error instanceof Error ? error.message : String(error),
        storyId,
      });
      throw error;
    }
  }
}

export const storyRepository = new StoryRepository();
