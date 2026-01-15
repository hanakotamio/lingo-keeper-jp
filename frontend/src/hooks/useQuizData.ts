import { useState, useEffect } from 'react';
import { QuizApiService } from '@/services/api/QuizApiService';
import { ProgressApiService } from '@/services/api/ProgressApiService';
import type {
  Quiz,
  UserLearningProgress,
  ProgressGraphData,
  StoryCompletionHistory,
  RecommendedStory,
  QuizFeedback,
} from '@/types';
import { logger } from '@/lib/logger';

/**
 * useQuizData - Custom hook for quiz and progress data management
 *
 * This hook provides:
 * - Random quiz fetching or story-specific quizzes (API - Real backend)
 * - Answer submission (API - Real backend)
 * - Learning progress data (API - Real backend)
 * - Progress graph data (API - Real backend)
 * - Story completion history (Mock - Future phase - No backend endpoint yet)
 * - Recommended story suggestions (Mock - Future phase - No backend endpoint yet)
 *
 * Note: Story completion history and recommendations still use mock data
 * as these features are planned for a future phase and the backend
 * endpoints don't exist yet.
 */
export const useQuizData = (storyId?: string) => {
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [progress, setProgress] = useState<UserLearningProgress | null>(null);
  const [graphData, setGraphData] = useState<ProgressGraphData | null>(null);
  const [completionHistory, setCompletionHistory] = useState<StoryCompletionHistory[]>([]);
  const [recommendedStory, setRecommendedStory] = useState<RecommendedStory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fetch all data on mount or when storyId changes
   */
  useEffect(() => {
    logger.debug('useQuizData hook initialized', { storyId });
    fetchAllData();
  }, [storyId]);

  /**
   * Fetch all quiz and progress data
   */
  const fetchAllData = async () => {
    try {
      setLoading(true);
      logger.debug('Fetching all quiz and progress data', { storyId });

      // Fetch quizzes based on storyId or random
      let quizData: Quiz | Quiz[];
      if (storyId) {
        quizData = await QuizApiService.getQuizzesByStory(storyId);
        if (Array.isArray(quizData) && quizData.length > 0) {
          setQuizzes(quizData);
          setCurrentQuiz(quizData[0]);
          setCurrentQuizIndex(0);
        }
      } else {
        quizData = await QuizApiService.getRandomQuiz();
        setCurrentQuiz(quizData as Quiz);
        setQuizzes([quizData as Quiz]);
        setCurrentQuizIndex(0);
      }

      const [progressData, graph] = await Promise.all([
        ProgressApiService.getLearningProgress(), // API integration - Real backend
        ProgressApiService.getProgressGraphData(), // API integration - Real backend
      ]);

      // Mock data for future features (no backend endpoints yet)
      const history: StoryCompletionHistory[] = [
        {
          story_id: '1',
          story_title: '東京での新しい生活',
          completed_at: '2026-01-10T10:00:00Z',
          accuracy_rate: 90,
          level_jlpt: 'N5',
          level_cefr: 'A1',
        },
        {
          story_id: '2',
          story_title: 'カフェでの出会い',
          completed_at: '2026-01-09T14:30:00Z',
          accuracy_rate: 85,
          level_jlpt: 'N4',
          level_cefr: 'A2',
        },
        {
          story_id: '3',
          story_title: '初めてのコンビニ',
          completed_at: '2026-01-08T09:15:00Z',
          accuracy_rate: 80,
          level_jlpt: 'N5',
          level_cefr: 'A1',
        },
      ];

      const recommended: RecommendedStory = {
        story_id: '4',
        title: '週末の旅行計画',
        description: 'あなたの学習履歴から、このストーリーが最適です。N3レベルの会話表現を学べます。',
        level_jlpt: 'N3',
        level_cefr: 'B1',
        reason: 'あなたの学習履歴から、このストーリーが最適です。',
      };

      setProgress(progressData);
      setGraphData(graph);
      setCompletionHistory(history);
      setRecommendedStory(recommended);

      logger.info('All quiz and progress data fetched successfully', {
        quizId: currentQuiz?.quiz_id,
        accuracyRate: progressData.accuracy_rate,
        storyId,
      });
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      logger.error('Failed to fetch quiz and progress data', { error: error.message });
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Submit quiz answer
   */
  const submitAnswer = async (
    userAnswer: string,
    responseMethod: '音声' | 'テキスト'
  ): Promise<QuizFeedback> => {
    if (!currentQuiz) {
      throw new Error('No current quiz available');
    }

    try {
      logger.debug('Submitting quiz answer', { quizId: currentQuiz.quiz_id, responseMethod });

      const feedback = await QuizApiService.submitAnswer(
        currentQuiz.quiz_id,
        userAnswer,
        responseMethod
      ); // API integration

      // Refresh progress data after answer submission (API integration)
      const updatedProgress = await ProgressApiService.getLearningProgress();
      setProgress(updatedProgress);

      logger.info('Quiz answer submitted successfully', { isCorrect: feedback.is_correct });
      return feedback;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      logger.error('Failed to submit quiz answer', { error: error.message });
      throw error;
    }
  };

  /**
   * Load next quiz
   */
  const loadNextQuiz = async () => {
    try {
      setLoading(true);
      logger.debug('Loading next quiz', { storyId, currentIndex: currentQuizIndex });

      // If we have a story-specific quiz list, move to next quiz
      if (storyId && quizzes.length > 0) {
        const nextIndex = currentQuizIndex + 1;
        if (nextIndex < quizzes.length) {
          setCurrentQuizIndex(nextIndex);
          setCurrentQuiz(quizzes[nextIndex]);
          logger.info('Moved to next quiz in story', {
            quizId: quizzes[nextIndex].quiz_id,
            index: nextIndex,
            total: quizzes.length
          });
        } else {
          // No more quizzes for this story, loop back to first
          setCurrentQuizIndex(0);
          setCurrentQuiz(quizzes[0]);
          logger.info('Looped back to first quiz in story', { quizId: quizzes[0].quiz_id });
        }
      } else {
        // Random quiz mode
        const quiz = await QuizApiService.getRandomQuiz();
        setCurrentQuiz(quiz);
        logger.info('Next random quiz loaded successfully', { quizId: quiz.quiz_id });
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      logger.error('Failed to load next quiz', { error: error.message });
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Refresh progress data
   */
  const refreshProgress = async () => {
    try {
      logger.debug('Refreshing progress data');

      const [progressData, graph] = await Promise.all([
        ProgressApiService.getLearningProgress(),
        ProgressApiService.getProgressGraphData(),
      ]);

      setProgress(progressData);
      setGraphData(graph);

      logger.info('Progress data refreshed successfully');
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      logger.error('Failed to refresh progress data', { error: error.message });
      throw error;
    }
  };

  /**
   * Refresh graph data with specific period
   */
  const refreshGraphData = async (period: 'week' | 'month' | 'year') => {
    try {
      logger.debug('Refreshing graph data with period', { period });

      const graph = await ProgressApiService.getProgressGraphData(period);
      setGraphData(graph);

      logger.info('Graph data refreshed successfully with period', { period });
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      logger.error('Failed to refresh graph data with period', {
        error: error.message,
        period,
      });
      throw error;
    }
  };

  return {
    currentQuiz,
    progress,
    graphData,
    completionHistory,
    recommendedStory,
    loading,
    error,
    submitAnswer,
    loadNextQuiz,
    refreshProgress,
    refreshGraphData,
    refetch: fetchAllData,
  };
};
