// JLPT/CEFRレベル型定義
export type JLPTLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

// ストーリー関連型定義
export interface Story {
  story_id: string;
  title: string;
  description: string;
  level_jlpt: JLPTLevel;
  level_cefr: CEFRLevel;
  estimated_time: number; // 分
  thumbnail_url?: string;
  root_chapter_id: string;
  created_at: string;
  updated_at: string;
}

// 語彙ヘルプアイテム型定義
export interface VocabularyItem {
  word: string; // 日本語の単語
  reading: string; // ひらがな読み
  meanings: {
    [languageCode: string]: string; // 言語コード → 意味
  };
  example?: string; // 使用例（日本語）
}

export interface Chapter {
  chapter_id: string;
  story_id: string;
  parent_chapter_id?: string; // ツリー構造用
  chapter_number: number;
  depth_level: number; // ツリー深度（0=ルート）
  content: string;
  content_with_ruby?: string; // ルビ付き本文
  translation?: string;
  vocabulary?: VocabularyItem[]; // 語彙ヘルプデータ
  created_at: string;
  updated_at: string;
  choices: Choice[]; // 関連する選択肢
}

export interface Choice {
  choice_id: string;
  chapter_id: string;
  choice_text: string;
  choice_description?: string; // カードUI用説明
  next_chapter_id: string;
  display_order: number;
  created_at: string;
}

// クイズ関連型定義
export type QuestionType = '読解' | '語彙' | '文法' | 'リスニング';

export interface Quiz {
  quiz_id: string;
  story_id: string;
  question_text: string;
  question_type: QuestionType;
  difficulty_level: JLPTLevel;
  is_ai_generated?: boolean;
  source_text?: string;
  created_at: string;
  updated_at: string;
  choices: QuizChoice[];
}

export interface QuizChoice {
  choice_id: string;
  quiz_id: string;
  choice_text: string;
  is_correct: boolean;
  explanation?: string;
}

// LocalStorage用型定義
export interface UserProgress {
  story_id: string;
  current_chapter_id: string;
  completed_chapters: string[]; // チャプターIDリスト
  completion_rate: number; // 0-100
  last_accessed: string; // ISO 8601形式
}

export interface UserQuizResult {
  result_id: string;
  quiz_id: string;
  user_answer: string;
  is_correct: boolean;
  answered_at: string; // ISO 8601形式
  response_method: '音声' | 'テキスト';
}

// 母国語選択機能用型定義
export type SupportedLanguage = 'en' | 'zh' | 'ko' | 'es' | 'fr' | 'de' | 'pt' | 'ru' | 'ar' | 'hi';

export interface UserLanguagePreference {
  language: SupportedLanguage;
  selected_at: string; // ISO 8601形式
}

export interface LanguageInfo {
  code: SupportedLanguage;
  name: string; // ネイティブ名（例：日本語、中文、한국어）
  englishName: string; // 英語名（例：Japanese, Chinese, Korean）
  flag: string; // 絵文字フラグ（例：🇯🇵、🇨🇳、🇰🇷）
}

export interface LevelProgress {
  completed: number;
  total: number;
  accuracy: number; // パーセンテージ（0-100）
}

export interface UserLearningProgress {
  total_quizzes: number;
  correct_count: number;
  accuracy_rate: number; // パーセンテージ（0-100）
  level_progress: {
    [key in JLPTLevel]: LevelProgress;
  };
  last_updated: string; // ISO 8601形式
  completed_stories: string[]; // ストーリーIDリスト
}

// 進捗グラフデータ型定義（理解度チェック＋進捗ページ用）
export interface ProgressDataPoint {
  date: string; // ISO 8601形式
  accuracy_rate: number; // パーセンテージ（0-100）
  level: JLPTLevel;
}

export interface ProgressGraphData {
  data_points: ProgressDataPoint[];
  levels: JLPTLevel[]; // グラフに表示するレベル
}

// ストーリー完了履歴型定義
export interface StoryCompletionHistory {
  story_id: string;
  story_title: string;
  completed_at: string; // ISO 8601形式
  accuracy_rate: number; // パーセンテージ（0-100）
  level_jlpt: JLPTLevel;
  level_cefr: CEFRLevel;
}

// 理解度チェックページ用UI状態管理型定義
export interface QuizViewerState {
  currentQuizId: string | null;
  userAnswer: string | null;
  isCorrect: boolean | null;
  showFeedback: boolean;
  showQuestionText: boolean;
  isVoiceRecording: boolean;
  voiceRecognitionResult: string | null;
  inputMethod: '音声' | 'テキスト';
  isAudioPlaying: boolean;
  isLoading: boolean;
}

// クイズフィードバック型定義
export interface QuizFeedback {
  is_correct: boolean;
  explanation: string;
  sample_answer?: string; // 誤認識時のサンプル回答
}

// おすすめストーリー型定義
export interface RecommendedStory {
  story_id: string;
  title: string;
  description: string;
  level_jlpt: JLPTLevel;
  level_cefr: CEFRLevel;
  reason: string; // おすすめ理由
}

// ストーリー完了データ型定義
export interface StoryCompletion {
  story_id: string;
  completed_at: string; // ISO 8601形式
  completion_percentage: number; // 100
  quiz_accuracy: number; // そのストーリーのクイズ正答率（0-100）
  chapters_completed: string[]; // 完了したチャプターIDリスト
}

// 学習者レベル判定型定義
export interface LearnerLevel {
  current_level: JLPTLevel;
  confidence: number; // 0-100（判定の確度）
  recommended_next_level: JLPTLevel;
  accuracy_by_level: {
    [key in JLPTLevel]: number; // レベル別正答率
  };
}

// 認証関連型定義（MVPフェーズでは未使用、Phase 2以降用）
export interface User {
  user_id: string;
  email: string;
  username: string;
  role: 'guest' | 'user' | 'admin';
  created_at: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

// ストーリー体験ページ用UI状態管理型定義
export interface StoryViewerState {
  currentStoryId: string | null;
  currentChapterId: string | null;
  selectedChoiceId: string | null;
  progress: number; // 0-100
  showRuby: boolean;
  showTranslation: boolean;
  completedChapters: string[]; // チャプターIDリスト
  isAudioPlaying: boolean;
  isLoading: boolean;
}

// ストーリー分岐管理用アクション型定義
export type StoryAction =
  | { type: 'SELECT_STORY'; payload: { storyId: string } }
  | { type: 'LOAD_CHAPTER'; payload: { chapterId: string } }
  | { type: 'SELECT_CHOICE'; payload: { choiceId: string; nextChapterId: string } }
  | { type: 'UPDATE_PROGRESS'; payload: { progress: number } }
  | { type: 'TOGGLE_RUBY' }
  | { type: 'TOGGLE_TRANSLATION' }
  | { type: 'SET_AUDIO_PLAYING'; payload: { isPlaying: boolean } }
  | { type: 'SET_LOADING'; payload: { isLoading: boolean } }
  | { type: 'RESET_STATE' };

// レベルフィルター用型定義
export type LevelFilter = 'all' | 'N5-A1' | 'N4-A2' | 'N3-B1' | 'N2-B2' | 'N1-C1';

// ストーリーカードメタデータ型定義
export interface StoryCardMeta {
  level: string; // "N3 / B1" 形式
  estimatedTime: string; // "約10分" 形式
  progress: number; // 0-100
}

// API パス定義
export const API_PATHS = {
  STORIES: {
    LIST: '/api/stories',
    DETAIL: (id: string) => `/api/stories/${id}`,
    CHAPTERS: (id: string) => `/api/stories/${id}/chapters`,
  },
  CHAPTERS: {
    DETAIL: (id: string) => `/api/chapters/${id}`,
  },
  QUIZZES: {
    LIST: '/api/quizzes',
    BY_STORY: (storyId: string) => `/api/quizzes/story/${storyId}`,
    ANSWER: '/api/quizzes/answer',
  },
  PROGRESS: {
    LEARNING: '/api/progress',
    GRAPH: '/api/progress/graph',
  },
  TTS: {
    SYNTHESIZE: '/api/tts/synthesize',
  },
  HEALTH: '/api/health',
} as const;
