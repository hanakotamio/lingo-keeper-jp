import prisma from '@/lib/db.js';
import logger, { PerformanceTracker } from '@/lib/logger.js';
import type { Story, Chapter, JLPTLevel, CEFRLevel, LevelFilter } from '@/types/index.js';
import type { Story as PrismaStory, Chapter as PrismaChapter, Choice as PrismaChoice } from '@prisma/client';

/**
 * Story Repository
 * データベースアクセス処理を担当
 */
export class StoryRepository {
  /**
   * Convert Prisma Story to application Story type
   */
  private toDomainStory(prismaStory: PrismaStory): Story {
    return {
      story_id: prismaStory.story_id,
      title: prismaStory.title,
      description: prismaStory.description,
      level_jlpt: prismaStory.level_jlpt as JLPTLevel,
      level_cefr: prismaStory.level_cefr as CEFRLevel,
      estimated_time: prismaStory.estimated_time,
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
    prismaChapter: PrismaChapter & { choices: PrismaChoice[] }
  ): Chapter {
    return {
      chapter_id: prismaChapter.chapter_id,
      story_id: prismaChapter.story_id,
      parent_chapter_id: prismaChapter.parent_chapter_id || undefined,
      chapter_number: prismaChapter.chapter_number,
      depth_level: prismaChapter.depth_level,
      content: prismaChapter.content,
      content_with_ruby: prismaChapter.content_with_ruby || undefined,
      translation: prismaChapter.translation || undefined,
      vocabulary: prismaChapter.vocabulary ? (prismaChapter.vocabulary as any) : undefined,
      created_at: prismaChapter.created_at.toISOString(),
      updated_at: prismaChapter.updated_at.toISOString(),
      choices: prismaChapter.choices.map((choice) => ({
        choice_id: choice.choice_id,
        chapter_id: choice.chapter_id,
        choice_text: choice.choice_text,
        choice_description: choice.choice_description || undefined,
        next_chapter_id: choice.next_chapter_id,
        display_order: choice.display_order,
        created_at: choice.created_at.toISOString(),
      })),
    };
  }

  /**
   * Get all stories with optional level filter
   */
  async findAllStories(levelFilter?: LevelFilter): Promise<Story[]> {
    const tracker = new PerformanceTracker('StoryRepository.findAllStories');
    logger.debug('Finding all stories', { levelFilter });

    try {
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

      logger.info('Stories retrieved successfully', {
        count: stories.length,
        levelFilter,
      });

      tracker.end({ storiesCount: stories.length });
      return stories.map((story) => this.toDomainStory(story));
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
          choices: {
            orderBy: { display_order: 'asc' },
          },
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
          choices: {
            orderBy: { display_order: 'asc' },
          },
        },
        orderBy: [
          { depth_level: 'asc' },
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
