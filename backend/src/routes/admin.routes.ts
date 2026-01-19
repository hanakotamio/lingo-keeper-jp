import { Router } from 'express';
import type { Request, Response } from 'express';
import { storyGenerationService } from '@/services/story-generation.service.js';
import logger from '@/lib/logger.js';

const router = Router();

/**
 * POST /api/admin/stories/generate
 * Generate a new story using AI
 */
router.post('/stories/generate', async (req: Request, res: Response): Promise<void> => {
  try {
    const { level, theme, chapterCount } = req.body;

    // Validation
    if (!level || !theme) {
      res.status(400).json({
        success: false,
        error: 'Missing required fields: level and theme are required',
      });
      return;
    }

    logger.info('Story generation requested', {
      level,
      theme,
      chapterCount,
    });

    // Generate story
    const story = await storyGenerationService.generateStory({
      level,
      theme,
      chapterCount: chapterCount || 5,
    });

    logger.info('Story generation completed', {
      storyId: story.story_id,
      title: story.title,
    });

    res.status(201).json({
      success: true,
      data: story,
    });
  } catch (error) {
    logger.error('Story generation failed', {
      error: error instanceof Error ? error.message : String(error),
    });

    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate story',
    });
  }
});

/**
 * POST /api/admin/stories/generate/batch
 * Generate multiple stories in batch
 */
router.post('/stories/generate/batch', async (req: Request, res: Response): Promise<void> => {
  try {
    const { level, themes, chapterCount } = req.body;

    // Validation
    if (!level || !themes || !Array.isArray(themes) || themes.length === 0) {
      res.status(400).json({
        success: false,
        error: 'Missing required fields: level and themes (array) are required',
      });
      return;
    }

    logger.info('Batch story generation requested', {
      level,
      themeCount: themes.length,
      chapterCount,
    });

    // Generate stories
    const results = await storyGenerationService.generateBatch({
      level,
      themes,
      chapterCount: chapterCount || 5,
    });

    const successCount = results.filter(r => !r.error).length;

    logger.info('Batch story generation completed', {
      total: results.length,
      success: successCount,
      failed: results.length - successCount,
    });

    res.status(201).json({
      success: true,
      data: results,
      summary: {
        total: results.length,
        success: successCount,
        failed: results.length - successCount,
      },
    });
  } catch (error) {
    logger.error('Batch story generation failed', {
      error: error instanceof Error ? error.message : String(error),
    });

    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate stories',
    });
  }
});

export default router;
