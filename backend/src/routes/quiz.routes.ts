import { Router } from 'express';
import { quizController } from '@/controllers/quiz.controller.js';

const router = Router();

/**
 * Quiz Routes
 * API endpoints for quiz functionality
 */

// GET /api/quizzes - Get random quiz (1 question)
router.get('/', (req, res) => {
  void quizController.getRandomQuiz(req, res);
});

// GET /api/quizzes/story/:storyId - Get quizzes by story ID
router.get('/story/:storyId', (req, res) => {
  void quizController.getQuizzesByStoryId(req, res);
});

// POST /api/quizzes/answer - Submit quiz answer
router.post('/answer', (req, res) => {
  void quizController.submitQuizAnswer(req, res);
});

export default router;
