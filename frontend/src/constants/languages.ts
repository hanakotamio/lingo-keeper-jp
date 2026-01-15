import type { LanguageInfo, SupportedLanguage } from '@/types';

/**
 * サポートされている言語の一覧
 * ユーザーが選択できる母国語のリスト
 */
export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  {
    code: 'en',
    name: 'English',
    englishName: 'English',
    flag: '🇺🇸',
  },
  {
    code: 'zh',
    name: '中文',
    englishName: 'Chinese',
    flag: '🇨🇳',
  },
  {
    code: 'ko',
    name: '한국어',
    englishName: 'Korean',
    flag: '🇰🇷',
  },
  {
    code: 'es',
    name: 'Español',
    englishName: 'Spanish',
    flag: '🇪🇸',
  },
  {
    code: 'fr',
    name: 'Français',
    englishName: 'French',
    flag: '🇫🇷',
  },
  {
    code: 'de',
    name: 'Deutsch',
    englishName: 'German',
    flag: '🇩🇪',
  },
  {
    code: 'pt',
    name: 'Português',
    englishName: 'Portuguese',
    flag: '🇵🇹',
  },
  {
    code: 'ru',
    name: 'Русский',
    englishName: 'Russian',
    flag: '🇷🇺',
  },
  {
    code: 'ar',
    name: 'العربية',
    englishName: 'Arabic',
    flag: '🇸🇦',
  },
  {
    code: 'hi',
    name: 'हिन्दी',
    englishName: 'Hindi',
    flag: '🇮🇳',
  },
];

/**
 * 言語コードから言語情報を取得
 */
export const getLanguageInfo = (code: SupportedLanguage): LanguageInfo | undefined => {
  return SUPPORTED_LANGUAGES.find(lang => lang.code === code);
};
