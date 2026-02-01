import { Router } from 'express';
import { quizController } from '@/controllers/quiz.controller.js';

const router = Router();

/**
 * Quiz Routes
 * API endpoints for quiz functionality
 */

// GET /api/quizzes - Get all quizzes, or quizzes for a specific story if story_id query param is provided
router.get('/', (req, res) => {
  void quizController.getQuizzes(req, res);
});

// GET /api/quizzes/:id - Get specific quiz by ID
router.get('/:id', (req, res) => {
  void quizController.getQuizById(req, res);
});

export default router;
