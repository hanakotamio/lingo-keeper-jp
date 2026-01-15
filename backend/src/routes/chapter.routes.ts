import { Router } from 'express';
import { storyController } from '@/controllers/story.controller.js';

const router = Router();

/**
 * Chapter Routes
 * API endpoints for chapter functionality
 */

// GET /api/chapters/:id - Get chapter by ID
router.get('/:id', (req, res) => {
  void storyController.getChapterById(req, res);
});

export default router;
