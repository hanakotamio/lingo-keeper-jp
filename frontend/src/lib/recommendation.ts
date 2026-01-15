import type { Story, JLPTLevel, LearnerLevel } from '@/types';
import { getLearnerLevel, getCompletedStories } from './storage';
import { logger } from './logger';

/**
 * JLPTレベルの順序
 */
const JLPT_LEVEL_ORDER: { [key in JLPTLevel]: number } = {
  N5: 1,
  N4: 2,
  N3: 3,
  N2: 4,
  N1: 5,
};

/**
 * レベルに基づいてストーリーをフィルタリング
 */
export const filterStoriesByLevel = (
  stories: Story[],
  targetLevel: JLPTLevel,
  includeEasier: boolean = true
): Story[] => {
  const targetOrder = JLPT_LEVEL_ORDER[targetLevel];

  return stories.filter(story => {
    const storyOrder = JLPT_LEVEL_ORDER[story.level_jlpt];

    if (includeEasier) {
      // 目標レベル以下（簡単なレベル含む）
      return storyOrder <= targetOrder;
    } else {
      // 目標レベルのみ
      return storyOrder === targetOrder;
    }
  });
};

/**
 * 学習者に最適なストーリーを推薦
 *
 * ロジック:
 * 1. 完了済みストーリーを除外
 * 2. 学習者の推奨レベルのストーリーを優先
 * 3. 推奨レベルが全て完了している場合、1つ上のレベル
 * 4. ランダムに選択（多様性を確保）
 */
export const getRecommendedStory = (allStories: Story[]): Story | null => {
  try {
    const learnerLevel: LearnerLevel = getLearnerLevel();
    const completedStories = getCompletedStories();
    const completedIds = new Set(completedStories.map(c => c.story_id));

    logger.debug('Getting recommended story', {
      currentLevel: learnerLevel.current_level,
      recommendedLevel: learnerLevel.recommended_next_level,
      completedCount: completedStories.length,
    });

    // 未完了のストーリーのみ
    const uncompletedStories = allStories.filter(story => !completedIds.has(story.story_id));

    if (uncompletedStories.length === 0) {
      logger.info('All stories completed');
      return null;
    }

    // 推奨レベルのストーリーを取得
    const recommendedLevelStories = uncompletedStories.filter(
      story => story.level_jlpt === learnerLevel.recommended_next_level
    );

    if (recommendedLevelStories.length > 0) {
      // 推奨レベルのストーリーからランダムに選択
      const randomIndex = Math.floor(Math.random() * recommendedLevelStories.length);
      const recommended = recommendedLevelStories[randomIndex];

      logger.info('Recommended story selected', {
        storyId: recommended.story_id,
        title: recommended.title,
        level: recommended.level_jlpt,
      });

      return recommended;
    }

    // 推奨レベルが全て完了している場合、現在のレベルまたは1つ上のレベル
    const currentLevelStories = uncompletedStories.filter(
      story => story.level_jlpt === learnerLevel.current_level
    );

    if (currentLevelStories.length > 0) {
      const randomIndex = Math.floor(Math.random() * currentLevelStories.length);
      const recommended = currentLevelStories[randomIndex];

      logger.info('Recommended story selected (current level)', {
        storyId: recommended.story_id,
        title: recommended.title,
        level: recommended.level_jlpt,
      });

      return recommended;
    }

    // それでもない場合、任意の未完了ストーリー
    const randomIndex = Math.floor(Math.random() * uncompletedStories.length);
    const recommended = uncompletedStories[randomIndex];

    logger.info('Recommended story selected (any uncompleted)', {
      storyId: recommended.story_id,
      title: recommended.title,
      level: recommended.level_jlpt,
    });

    return recommended;
  } catch (error) {
    logger.error('Failed to get recommended story', {
      error: error instanceof Error ? error.message : String(error),
    });
    return allStories[0] || null;
  }
};

/**
 * "あなたにおすすめ" セクション用のストーリーリストを取得
 *
 * ロジック:
 * 1. 学習者の推奨レベル±1のストーリー
 * 2. 完了済みを除外
 * 3. 最大3件
 */
export const getRecommendedStories = (allStories: Story[], maxCount: number = 3): Story[] => {
  try {
    const learnerLevel: LearnerLevel = getLearnerLevel();
    const completedStories = getCompletedStories();
    const completedIds = new Set(completedStories.map(c => c.story_id));

    const recommendedOrder = JLPT_LEVEL_ORDER[learnerLevel.recommended_next_level];

    // 推奨レベル±1のストーリーを取得
    const relevantStories = allStories.filter(story => {
      if (completedIds.has(story.story_id)) return false;

      const storyOrder = JLPT_LEVEL_ORDER[story.level_jlpt];
      return Math.abs(storyOrder - recommendedOrder) <= 1;
    });

    // レベルが近い順、ランダムでシャッフル
    const shuffled = relevantStories.sort(() => Math.random() - 0.5);

    logger.info('Recommended stories list generated', {
      count: Math.min(maxCount, shuffled.length),
      recommendedLevel: learnerLevel.recommended_next_level,
    });

    return shuffled.slice(0, maxCount);
  } catch (error) {
    logger.error('Failed to get recommended stories list', {
      error: error instanceof Error ? error.message : String(error),
    });
    return allStories.slice(0, maxCount);
  }
};

/**
 * 完了率の計算
 */
export const calculateOverallCompletion = (totalStories: number): number => {
  try {
    const completedStories = getCompletedStories();
    if (totalStories === 0) return 0;

    return Math.round((completedStories.length / totalStories) * 100);
  } catch (error) {
    logger.error('Failed to calculate overall completion', {
      error: error instanceof Error ? error.message : String(error),
    });
    return 0;
  }
};
