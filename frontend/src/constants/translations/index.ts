// Central export for all translation files
import { en } from './en';
import type { SupportedLanguage, Translations } from './types';

export const translations: Record<SupportedLanguage, Translations> = {
  en,
};

export type { SupportedLanguage, Translations, TranslationKey } from './types';
