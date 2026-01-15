import type {
  StoryCompletion,
  LearnerLevel,
  JLPTLevel,
  UserQuizResult,
  UserLanguagePreference,
  SupportedLanguage,
} from '@/types';
import { logger } from './logger';

// LocalStorageキー定数
const STORAGE_KEYS = {
  COMPLETED_STORIES: 'lingo_keeper_completed_stories',
  QUIZ_RESULTS: 'lingo_keeper_quiz_results',
  LEARNER_LEVEL: 'lingo_keeper_learner_level',
  LANGUAGE_PREFERENCE: 'lingo_keeper_language_preference',
} as const;

/**
 * ストーリー完了データの保存
 */
export const saveStoryCompletion = (completion: StoryCompletion): void => {
  try {
    const existing = getCompletedStories();

    // 既存の同じストーリーを削除（上書き）
    const filtered = existing.filter(c => c.story_id !== completion.story_id);
    const updated = [...filtered, completion];

    localStorage.setItem(STORAGE_KEYS.COMPLETED_STORIES, JSON.stringify(updated));
    logger.info('Story completion saved', { storyId: completion.story_id });
  } catch (error) {
    logger.error('Failed to save story completion', {
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

/**
 * 完了済みストーリー一覧の取得
 */
export const getCompletedStories = (): StoryCompletion[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.COMPLETED_STORIES);
    if (!data) return [];

    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    logger.error('Failed to get completed stories', {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
};

/**
 * 特定ストーリーの完了状態確認
 */
export const isStoryCompleted = (storyId: string): boolean => {
  const completed = getCompletedStories();
  return completed.some(c => c.story_id === storyId);
};

/**
 * 特定ストーリーの完了データ取得
 */
export const getStoryCompletion = (storyId: string): StoryCompletion | null => {
  const completed = getCompletedStories();
  return completed.find(c => c.story_id === storyId) || null;
};

/**
 * クイズ結果の保存
 */
export const saveQuizResult = (result: UserQuizResult): void => {
  try {
    const existing = getQuizResults();
    const updated = [...existing, result];

    localStorage.setItem(STORAGE_KEYS.QUIZ_RESULTS, JSON.stringify(updated));

    // クイズ結果保存後、学習者レベルを再計算
    updateLearnerLevel();

    logger.info('Quiz result saved', { quizId: result.quiz_id, isCorrect: result.is_correct });
  } catch (error) {
    logger.error('Failed to save quiz result', {
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

/**
 * すべてのクイズ結果を取得
 */
export const getQuizResults = (): UserQuizResult[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.QUIZ_RESULTS);
    if (!data) return [];

    const parsed = JSON.parse(data);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    logger.error('Failed to get quiz results', {
      error: error instanceof Error ? error.message : String(error),
    });
    return [];
  }
};

/**
 * 特定ストーリーのクイズ結果を取得
 */
export const getStoryQuizResults = (storyId: string): UserQuizResult[] => {
  const allResults = getQuizResults();
  return allResults.filter(r => r.quiz_id.startsWith(`quiz-${storyId}-`));
};

/**
 * 特定ストーリーのクイズ正答率を計算
 */
export const calculateStoryQuizAccuracy = (storyId: string): number => {
  const results = getStoryQuizResults(storyId);
  if (results.length === 0) return 0;

  const correctCount = results.filter(r => r.is_correct).length;
  return Math.round((correctCount / results.length) * 100);
};

/**
 * JLPTレベルの順序マップ
 */
const JLPT_LEVEL_ORDER: { [key in JLPTLevel]: number } = {
  N5: 1,
  N4: 2,
  N3: 3,
  N2: 4,
  N1: 5,
};

/**
 * 学習者レベルの計算と保存
 */
export const updateLearnerLevel = (): LearnerLevel => {
  try {
    const quizResults = getQuizResults();

    if (quizResults.length === 0) {
      // クイズ結果がない場合はデフォルトN5
      const defaultLevel: LearnerLevel = {
        current_level: 'N5',
        confidence: 0,
        recommended_next_level: 'N5',
        accuracy_by_level: {
          N5: 0,
          N4: 0,
          N3: 0,
          N2: 0,
          N1: 0,
        },
      };

      localStorage.setItem(STORAGE_KEYS.LEARNER_LEVEL, JSON.stringify(defaultLevel));
      return defaultLevel;
    }

    // レベル別の正答率を計算
    const levelStats: { [key in JLPTLevel]: { correct: number; total: number } } = {
      N5: { correct: 0, total: 0 },
      N4: { correct: 0, total: 0 },
      N3: { correct: 0, total: 0 },
      N2: { correct: 0, total: 0 },
      N1: { correct: 0, total: 0 },
    };

    // クイズIDからレベルを推定（quiz-{storyId}-{num}）
    // storyId 1-3 = N5, 4 = N4, 5 = N3, 6-7 = N2, 8-9 = N1
    const storyToLevel: { [key: string]: JLPTLevel } = {
      '1': 'N5', '2': 'N5', '3': 'N5',
      '4': 'N4',
      '5': 'N3',
      '6': 'N2', '7': 'N2',
      '8': 'N1', '9': 'N1',
    };

    quizResults.forEach(result => {
      const storyIdMatch = result.quiz_id.match(/^quiz-(\d+)-/);
      if (storyIdMatch) {
        const storyId = storyIdMatch[1];
        const level = storyToLevel[storyId] || 'N5';

        levelStats[level].total += 1;
        if (result.is_correct) {
          levelStats[level].correct += 1;
        }
      }
    });

    // レベル別正答率を計算
    const accuracyByLevel: { [key in JLPTLevel]: number } = {
      N5: levelStats.N5.total > 0 ? Math.round((levelStats.N5.correct / levelStats.N5.total) * 100) : 0,
      N4: levelStats.N4.total > 0 ? Math.round((levelStats.N4.correct / levelStats.N4.total) * 100) : 0,
      N3: levelStats.N3.total > 0 ? Math.round((levelStats.N3.correct / levelStats.N3.total) * 100) : 0,
      N2: levelStats.N2.total > 0 ? Math.round((levelStats.N2.correct / levelStats.N2.total) * 100) : 0,
      N1: levelStats.N1.total > 0 ? Math.round((levelStats.N1.correct / levelStats.N1.total) * 100) : 0,
    };

    // 現在のレベルを判定（正答率80%以上のレベルのうち最高レベル）
    let currentLevel: JLPTLevel = 'N5';
    let maxLevelOrder = 0;

    (['N5', 'N4', 'N3', 'N2', 'N1'] as JLPTLevel[]).forEach(level => {
      if (levelStats[level].total >= 3 && accuracyByLevel[level] >= 80) {
        if (JLPT_LEVEL_ORDER[level] > maxLevelOrder) {
          currentLevel = level;
          maxLevelOrder = JLPT_LEVEL_ORDER[level];
        }
      }
    });

    // 推奨次レベルを決定
    const getNextLevel = (level: JLPTLevel): JLPTLevel => {
      const levelMap: { [key in JLPTLevel]: JLPTLevel } = {
        N1: 'N1',
        N2: 'N1',
        N3: 'N2',
        N4: 'N3',
        N5: 'N4',
      };
      return levelMap[level];
    };

    const recommendedNextLevel = getNextLevel(currentLevel);

    // 確度を計算（現在レベルのクイズ数が多いほど高い）
    const totalQuizzesAtCurrentLevel = levelStats[currentLevel].total;
    const confidence = Math.min(100, Math.round((totalQuizzesAtCurrentLevel / 10) * 100));

    const learnerLevel: LearnerLevel = {
      current_level: currentLevel,
      confidence,
      recommended_next_level: recommendedNextLevel,
      accuracy_by_level: accuracyByLevel,
    };

    localStorage.setItem(STORAGE_KEYS.LEARNER_LEVEL, JSON.stringify(learnerLevel));
    logger.info('Learner level updated', { currentLevel, recommendedNextLevel, confidence });

    return learnerLevel;
  } catch (error) {
    logger.error('Failed to update learner level', {
      error: error instanceof Error ? error.message : String(error),
    });

    // エラー時はデフォルト
    const defaultLevel: LearnerLevel = {
      current_level: 'N5',
      confidence: 0,
      recommended_next_level: 'N5',
      accuracy_by_level: {
        N5: 0,
        N4: 0,
        N3: 0,
        N2: 0,
        N1: 0,
      },
    };
    return defaultLevel;
  }
};

/**
 * 学習者レベルの取得
 */
export const getLearnerLevel = (): LearnerLevel => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.LEARNER_LEVEL);
    if (!data) {
      return updateLearnerLevel();
    }

    return JSON.parse(data);
  } catch (error) {
    logger.error('Failed to get learner level', {
      error: error instanceof Error ? error.message : String(error),
    });
    return updateLearnerLevel();
  }
};

/**
 * 母国語選択の保存
 */
export const saveLanguagePreference = (language: SupportedLanguage): void => {
  try {
    const preference: UserLanguagePreference = {
      language,
      selected_at: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEYS.LANGUAGE_PREFERENCE, JSON.stringify(preference));
    logger.info('Language preference saved', { language });
  } catch (error) {
    logger.error('Failed to save language preference', {
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

/**
 * 母国語選択の取得
 */
export const getLanguagePreference = (): UserLanguagePreference | null => {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.LANGUAGE_PREFERENCE);
    if (!data) return null;

    const parsed = JSON.parse(data);
    return parsed as UserLanguagePreference;
  } catch (error) {
    logger.error('Failed to get language preference', {
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
};

/**
 * 母国語選択のクリア
 */
export const clearLanguagePreference = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.LANGUAGE_PREFERENCE);
    logger.info('Language preference cleared');
  } catch (error) {
    logger.error('Failed to clear language preference', {
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

/**
 * すべてのデータをクリア（テスト用）
 */
export const clearAllData = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEYS.COMPLETED_STORIES);
    localStorage.removeItem(STORAGE_KEYS.QUIZ_RESULTS);
    localStorage.removeItem(STORAGE_KEYS.LEARNER_LEVEL);
    localStorage.removeItem(STORAGE_KEYS.LANGUAGE_PREFERENCE);
    logger.info('All storage data cleared');
  } catch (error) {
    logger.error('Failed to clear storage data', {
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
