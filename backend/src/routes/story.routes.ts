import { Router } from 'express';
import { storyController } from '@/controllers/story.controller.js';

const router = Router();

/**
 * Story Routes
 * API endpoints for story functionality
 */

// GET /api/stories - Get all stories with optional level filter
router.get('/', (req, res) => {
  void storyController.getStoryList(req, res);
});

// GET /api/stories/:id - Get specific story by ID
router.get('/:id', (req, res) => {
  void storyController.getStoryById(req, res);
});

// GET /api/stories/:id/chapters - Get all chapters for a story
router.get('/:id/chapters', (req, res) => {
  void storyController.getChaptersByStoryId(req, res);
});

export default router;
