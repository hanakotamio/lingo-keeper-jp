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

export interface Chapter {
  chapter_id: string;
  story_id: string;
  parent_chapter_id?: string; // ツリー構造用
  chapter_number: number;
  depth_level: number; // ツリー深度（0=ルート）
  content: string;
  content_with_ruby?: string; // ルビ付き本文
  translation?: string;
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
