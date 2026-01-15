import { quizRepository } from '@/repositories/quiz.repository.js';
import { storyRepository } from '@/repositories/story.repository.js';
import logger, { PerformanceTracker } from '@/lib/logger.js';
import type { Quiz, QuizFeedback } from '@/types/index.js';

/**
 * Quiz Service
 * ビジネスロジックを担当
 */
export class QuizService {
  /**
   * Get random quiz (1 question)
   */
  async getRandomQuiz(): Promise<Quiz> {
    const tracker = new PerformanceTracker('QuizService.getRandomQuiz');
    logger.info('Getting random quiz');

    try {
      const quiz = await quizRepository.findRandomQuiz();

      if (!quiz) {
        const error = new Error('No quizzes available');
        logger.error('No quizzes found');
        throw error;
      }

      logger.info('Random quiz retrieved successfully', {
        quizId: quiz.quiz_id,
        questionType: quiz.question_type,
        difficultyLevel: quiz.difficulty_level,
      });

      tracker.end({ quizId: quiz.quiz_id });
      return quiz;
    } catch (error) {
      logger.error('Failed to get random quiz', {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  /**
   * Get quizzes by story ID
   */
  async getQuizzesByStoryId(storyId: string): Promise<Quiz[]> {
    const tracker = new PerformanceTracker('QuizService.getQuizzesByStoryId');
    logger.info('Getting quizzes by story ID', { storyId });

    try {
      // Validate story ID
      if (!storyId || storyId.trim() === '') {
        const error = new Error('Story ID is required');
        logger.error('Invalid story ID', { storyId });
        throw error;
      }

      // Verify story exists
      const story = await storyRepository.findStoryById(storyId);
      if (!story) {
        const error = new Error(`Story not found: ${storyId}`);
        logger.error('Story not found', { storyId });
        throw error;
      }

      const quizzes = await quizRepository.findQuizzesByStoryId(storyId);

      logger.info('Quizzes retrieved successfully', {
        storyId,
        count: quizzes.length,
      });

      tracker.end({ storyId, quizzesCount: quizzes.length });
      return quizzes;
    } catch (error) {
      logger.error('Failed to get quizzes by story ID', {
        error: error instanceof Error ? error.message : String(error),
        storyId,
      });
      throw error;
    }
  }

  /**
   * Submit quiz answer and get feedback
   */
  async submitQuizAnswer(data: {
    quizId: string;
    userAnswer: string;
    responseMethod: '音声' | 'テキスト';
  }): Promise<QuizFeedback> {
    const tracker = new PerformanceTracker('QuizService.submitQuizAnswer');
    logger.info('Submitting quiz answer', {
      quizId: data.quizId,
      responseMethod: data.responseMethod,
    });

    try {
      // Validate input
      if (!data.quizId || data.quizId.trim() === '') {
        const error = new Error('Quiz ID is required');
        logger.error('Invalid quiz ID', { quizId: data.quizId });
        throw error;
      }

      if (!data.userAnswer || data.userAnswer.trim() === '') {
        const error = new Error('User answer is required');
        logger.error('Invalid user answer');
        throw error;
      }

      if (!data.responseMethod) {
        const error = new Error('Response method is required');
        logger.error('Invalid response method');
        throw error;
      }

      // Get quiz with choices
      const quiz = await quizRepository.findQuizById(data.quizId);
      if (!quiz) {
        const error = new Error(`Quiz not found: ${data.quizId}`);
        logger.error('Quiz not found', { quizId: data.quizId });
        throw error;
      }

      // Find the choice that matches user answer (by choice_id)
      const userChoice = quiz.choices.find(
        (choice) => choice.choice_id === data.userAnswer
      );

      if (!userChoice) {
        const error = new Error(`Invalid answer choice: ${data.userAnswer}`);
        logger.error('Invalid answer choice', {
          quizId: data.quizId,
          userAnswer: data.userAnswer,
        });
        throw error;
      }

      // Check if answer is correct
      const isCorrect = userChoice.is_correct;

      // Find the correct answer
      const correctChoice = quiz.choices.find((choice) => choice.is_correct);
      if (!correctChoice) {
        const error = new Error(`No correct answer found for quiz: ${data.quizId}`);
        logger.error('No correct answer in quiz', { quizId: data.quizId });
        throw error;
      }

      // Save quiz result
      await quizRepository.saveQuizResult({
        quizId: data.quizId,
        userAnswer: data.userAnswer,
        isCorrect,
        responseMethod: data.responseMethod,
      });

      // Generate feedback
      const feedback: QuizFeedback = {
        is_correct: isCorrect,
        explanation: userChoice.explanation || correctChoice.explanation || '解説がありません。',
        sample_answer: !isCorrect ? correctChoice.choice_text : undefined,
      };

      logger.info('Quiz answer submitted successfully', {
        quizId: data.quizId,
        isCorrect,
        responseMethod: data.responseMethod,
      });

      tracker.end({
        quizId: data.quizId,
        isCorrect,
      });

      return feedback;
    } catch (error) {
      logger.error('Failed to submit quiz answer', {
        error: error instanceof Error ? error.message : String(error),
        quizId: data.quizId,
      });
      throw error;
    }
  }
}

export const quizService = new QuizService();
