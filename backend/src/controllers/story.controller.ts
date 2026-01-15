import type { Request, Response } from 'express';
import { storyService } from '@/services/story.service.js';
import logger from '@/lib/logger.js';
import type { LevelFilter } from '@/types/index.js';

/**
 * Story Controller
 * リクエスト処理とレスポンス形成を担当
 */
export class StoryController {
  /**
   * GET /api/stories
   * Get all stories with optional level filter
   */
  async getStoryList(req: Request, res: Response): Promise<void> {
    const levelFilter = req.query.levelFilter as LevelFilter | undefined;
    logger.info('GET /api/stories', { levelFilter });

    try {
      const stories = await storyService.getStoryList(levelFilter);

      res.status(200).json({
        success: true,
        data: stories,
        count: stories.length,
      });

      logger.info('Story list returned successfully', {
        count: stories.length,
        levelFilter,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error('Failed to get story list', {
        error: errorMessage,
        levelFilter,
      });

      // Check if it's a validation error
      if (errorMessage.includes('Invalid level filter')) {
        res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: errorMessage,
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'production'
          ? 'Failed to retrieve story list'
          : errorMessage,
      });
    }
  }

  /**
   * GET /api/stories/:id
   * Get specific story by ID
   */
  async getStoryById(req: Request, res: Response): Promise<void> {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    logger.info('GET /api/stories/:id', { storyId: id });

    try {
      const story = await storyService.getStoryById(id);

      res.status(200).json({
        success: true,
        data: story,
      });

      logger.info('Story returned successfully', {
        storyId: id,
        title: story.title,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error('Failed to get story', {
        error: errorMessage,
        storyId: id,
      });

      // Check if it's a not found error
      if (errorMessage.includes('not found')) {
        res.status(404).json({
          success: false,
          error: 'Not Found',
          message: errorMessage,
        });
        return;
      }

      // Check if it's a validation error
      if (errorMessage.includes('required')) {
        res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: errorMessage,
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'production'
          ? 'Failed to retrieve story'
          : errorMessage,
      });
    }
  }

  /**
   * GET /api/chapters/:id
   * Get chapter by ID
   */
  async getChapterById(req: Request, res: Response): Promise<void> {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    logger.info('GET /api/chapters/:id', { chapterId: id });

    try {
      const chapter = await storyService.getChapterById(id);

      res.status(200).json({
        success: true,
        data: chapter,
      });

      logger.info('Chapter returned successfully', {
        chapterId: id,
        chapterNumber: chapter.chapter_number,
        choicesCount: chapter.choices.length,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error('Failed to get chapter', {
        error: errorMessage,
        chapterId: id,
      });

      // Check if it's a not found error
      if (errorMessage.includes('not found')) {
        res.status(404).json({
          success: false,
          error: 'Not Found',
          message: errorMessage,
        });
        return;
      }

      // Check if it's a validation error
      if (errorMessage.includes('required')) {
        res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: errorMessage,
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'production'
          ? 'Failed to retrieve chapter'
          : errorMessage,
      });
    }
  }

  /**
   * GET /api/stories/:id/chapters
   * Get all chapters for a story
   */
  async getChaptersByStoryId(req: Request, res: Response): Promise<void> {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    logger.info('GET /api/stories/:id/chapters', { storyId: id });

    try {
      const chapters = await storyService.getChaptersByStoryId(id);

      res.status(200).json({
        success: true,
        data: chapters,
        count: chapters.length,
      });

      logger.info('Chapters returned successfully', {
        storyId: id,
        count: chapters.length,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error('Failed to get chapters', {
        error: errorMessage,
        storyId: id,
      });

      // Check if it's a not found error
      if (errorMessage.includes('not found')) {
        res.status(404).json({
          success: false,
          error: 'Not Found',
          message: errorMessage,
        });
        return;
      }

      // Check if it's a validation error
      if (errorMessage.includes('required')) {
        res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: errorMessage,
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'production'
          ? 'Failed to retrieve chapters'
          : errorMessage,
      });
    }
  }
}

export const storyController = new StoryController();
