// Translation type definitions for i18n system
// This file defines all supported languages and translation key types

export type SupportedLanguage = 'en';

// Translation structure interface
export interface Translations {
  common: {
    buttons: {
      submit: string;
      cancel: string;
      save: string;
      back: string;
      next: string;
      close: string;
      confirm: string;
      delete: string;
      edit: string;
      add: string;
    };
    labels: {
      loading: string;
      error: string;
      success: string;
      warning: string;
      info: string;
      completed: string;
      recommended: string;
      all: string;
    };
    navigation: {
      dashboard: string;
      beginner: string;
      stories: string;
      quiz: string;
      profile: string;
      admin: string;
    };
  };
  auth: {
    login: string;
    logout: string;
    email: string;
    password: string;
    rememberMe: string;
    loggingIn: string;
    invalidCredentials: string;
    demoAccount: string;
    adminAccount: string;
  };
  dashboard: {
    title: string;
    welcomeBack: string;
    learningProgress: string;
    storiesCompleted: string;
    stories: string;
    quizPerformance: string;
    accuracy: string;
    answers: string;
    questions: string;
    currentLevel: string;
    jlpt: string;
    confidence: string;
    recommended: string;
  };
  story: {
    title: string;
    storiesByLevel: string;
    recommendedForYou: string;
    allStories: string;
    backToList: string;
    chapter: string;
    progress: string;
    furigana: string;
    translation: string;
    listen: string;
    playing: string;
    speechSpeed: string;
    slow: string;
    normal: string;
    fast: string;
    vocabularyHelp: string;
    vocabularyDescription: string;
    whatNext: string;
    takeQuiz: string;
    completed: string;
    completion: {
      title: string;
      quizAccuracy: string;
      recommendedNext: string;
      goToNext: string;
      backToList: string;
      excellent: string;
      wellDone: string;
      goodEffort: string;
      letsReview: string;
    };
  };
  quiz: {
    title: string;
    loading: string;
    question: string;
    of: string;
    submitAnswer: string;
    nextQuestion: string;
    completeQuiz: string;
    correct: string;
    incorrect: string;
    checkUnderstanding: string;
    comprehensionCheck: string;
    backToStories: string;
    notFound: string;
    voiceAnswer: string;
    listening: string;
    voiceInstructions: string;
    voiceNotMatched: string;
    microphoneAccessDenied: string;
    voiceRecognitionError: string;
    voiceNotSupported: string;
  };
  beginner: {
    title: string;
    subtitle: string;
    description: string;
    hiragana: string;
    hiraganaDescription: string;
    katakana: string;
    katakanaDescription: string;
    phrases: string;
    phrasesDescription: string;
    levelCheck: string;
    levelCheckDescription: string;
    hiraganaChart: string;
    hiraganaChartJp: string;
    katakanaChart: string;
    katakanaChartJp: string;
  };
  profile: {
    title: string;
    userInfo: string;
    username: string;
    email: string;
    role: string;
    admin: string;
    user: string;
    roleLabel: string;
  };
  admin: {
    title: string;
    description: string;
    phase4: string;
  };
  header: {
    appName: string;
    openMenu: string;
    userMenu: string;
    guest: string;
    profile: string;
    logout: string;
    languageSwitcher: string;
  };
  error: {
    general: string;
    network: string;
    auth: string;
    notFound: string;
    serverError: string;
  };
}

// Helper type to extract all translation keys as dot-notation strings
type PathsToStringProps<T> = T extends string
  ? []
  : {
      [K in Extract<keyof T, string>]: [K, ...PathsToStringProps<T[K]>];
    }[Extract<keyof T, string>];

type Join<T extends string[], D extends string> = T extends []
  ? never
  : T extends [infer F]
  ? F
  : T extends [infer F, ...infer R]
  ? F extends string
    ? `${F}${D}${Join<Extract<R, string[]>, D>}`
    : never
  : string;

export type TranslationKey = Join<PathsToStringProps<Translations>, '.'>;
