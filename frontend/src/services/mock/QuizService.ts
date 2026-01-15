import type { StoryCompletionHistory, RecommendedStory } from '@/types';
import { logger } from '@/lib/logger';

/**
 * QuizService - Mock service for future functionality
 *
 * This service provides:
 * - Story completion history (Mock - Future phase)
 * - Recommended story suggestions (Mock - Future phase)
 * - TTS synthesis (Mock - Phase 8)
 *
 * Migrated to API services:
 * - Quiz APIs → QuizApiService
 * - Progress APIs → ProgressApiService
 */
export class QuizService {

  // Mock story completion history
  private mockStoryCompletions: StoryCompletionHistory[] = [
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

  // Mock recommended story
  private mockRecommendation: RecommendedStory = {
    story_id: '4',
    title: '週末の旅行計画',
    description: 'あなたの学習履歴から、このストーリーが最適です。N3レベルの会話表現を学べます。',
    level_jlpt: 'N3',
    level_cefr: 'B1',
    reason: 'あなたの学習履歴から、このストーリーが最適です。',
  };

  /**
   * Get story completion history
   * Response: StoryCompletionHistory[]
   */
  async getStoryCompletionHistory(): Promise<StoryCompletionHistory[]> {
    logger.debug('Fetching story completion history');

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 200));

      logger.info('Story completion history fetched successfully', { count: this.mockStoryCompletions.length });
      return this.mockStoryCompletions;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      logger.error('Failed to fetch story completion history', { error: error.message });
      throw error;
    }
  }

  /**
   * Get recommended story
   * Response: RecommendedStory
   */
  async getRecommendedStory(): Promise<RecommendedStory> {
    logger.debug('Fetching recommended story');

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 200));

      logger.info('Recommended story fetched successfully', { storyId: this.mockRecommendation.story_id });
      return this.mockRecommendation;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      logger.error('Failed to fetch recommended story', { error: error.message });
      throw error;
    }
  }

  /**
   * Synthesize speech from text using Google Cloud TTS (Mock - Phase 8)
   * @MOCK_TO_API: POST /api/tts/synthesize
   * Request: { text: string }
   * Response: AudioBuffer (simulated)
   */
  async synthesizeSpeech(text: string): Promise<void> {
    logger.debug('Synthesizing speech (Mock)', { textLength: text.length });

    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // In real implementation, this would return audio data from Google Cloud TTS
      logger.info('Speech synthesized successfully (Mock)', { textLength: text.length });
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      logger.error('Failed to synthesize speech', { error: error.message });
      throw error;
    }
  }

}

// Export singleton instance
export const quizService = new QuizService();
