export interface LevelCheckQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const LEVEL_CHECK_QUESTIONS: LevelCheckQuestion[] = [
  {
    id: 1,
    question: 'What sound does this hiragana make? → あ',
    options: ['ka', 'a', 'sa', 'ta'],
    correctIndex: 1,
    explanation: '「あ」is the first hiragana character, pronounced "a" as in "father".',
  },
  {
    id: 2,
    question: 'What sound does this katakana make? → ス',
    options: ['ku', 'tsu', 'su', 'shi'],
    correctIndex: 2,
    explanation: '「ス」is the katakana for "su", used in words like スポーツ (sports).',
  },
  {
    id: 3,
    question: 'What does「ありがとう」mean?',
    options: ['Good morning', 'Goodbye', 'Thank you', 'Excuse me'],
    correctIndex: 2,
    explanation: '「ありがとう」means "thank you". The polite form is「ありがとうございます」.',
  },
  {
    id: 4,
    question: 'What number does this kanji represent? → 三',
    options: ['1', '2', '3', '4'],
    correctIndex: 2,
    explanation: '「三」means "three". The basic numbers are 一(1)、二(2)、三(3)、四(4)、五(5).',
  },
  {
    id: 5,
    question: 'How do you say "Good morning" in Japanese?',
    options: ['こんばんは', 'おはようございます', 'こんにちは', 'さようなら'],
    correctIndex: 1,
    explanation: '「おはようございます」is the polite way to say "good morning" in Japanese.',
  },
];

export type LevelCheckResult = 'beginner' | 'n5' | 'n4plus';

export function evaluateLevel(correctCount: number): LevelCheckResult {
  if (correctCount <= 1) return 'beginner';
  if (correctCount <= 3) return 'n5';
  return 'n4plus';
}

export const LEVEL_RESULT_TEXT: Record<LevelCheckResult, { title: string; message: string; action: string; path: string }> = {
  beginner: {
    title: 'Start with the Basics!',
    message: "Let's start by learning Hiragana. It's the foundation of Japanese!",
    action: 'Learn Hiragana',
    path: '/beginner/hiragana',
  },
  n5: {
    title: 'Ready for N5 Stories!',
    message: 'You know some basics. Try the N5 beginner stories!',
    action: 'Start N5 Stories',
    path: '/stories',
  },
  n4plus: {
    title: 'Great Knowledge!',
    message: 'You have solid Japanese foundations. Challenge yourself with N4-N3 stories!',
    action: 'Explore Stories',
    path: '/stories',
  },
};
