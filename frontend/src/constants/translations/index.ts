// Central export for all translation files
import { en } from './en';
import { ja } from './ja';
import type { SupportedLanguage, Translations } from './types';

export const translations: Record<SupportedLanguage, Translations> = {
  en,
  ja,
};

export type { SupportedLanguage, Translations, TranslationKey } from './types';
