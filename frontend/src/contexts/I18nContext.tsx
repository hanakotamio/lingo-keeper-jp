import React, { createContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { SupportedLanguage, TranslationKey } from '@/constants/translations/types';
import { translations } from '@/constants/translations';
import { logger } from '@/lib/logger';

interface I18nContextType {
  language: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
  t: (key: TranslationKey) => string;
}

export const I18nContext = createContext<I18nContextType | undefined>(undefined);

const FORCED_UI_LANGUAGE: SupportedLanguage = 'en'; // Force English for all users

interface I18nProviderProps {
  children: ReactNode;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  const [language] = useState<SupportedLanguage>(() => {
    // Always return 'en' - this is an English-only UI app
    return FORCED_UI_LANGUAGE;
  });

  const t = useCallback(
    (key: TranslationKey): string => {
      try {
        const keys = key.split('.');
        let value: any = translations[language];

        for (const k of keys) {
          if (value && typeof value === 'object' && k in value) {
            value = value[k];
          } else {
            logger.warn(`Translation missing for key: ${key}`, { language });
            return key; // Fallback to key itself
          }
        }

        return typeof value === 'string' ? value : key;
      } catch (error) {
        logger.error('Translation error', { key, error });
        return key;
      }
    },
    [language]
  );

  const setLanguage = useCallback((newLanguage: SupportedLanguage) => {
    // Language switching disabled - English-only UI
    logger.warn('Language switching is disabled in this version', { attemptedLanguage: newLanguage });
    return;
  }, []);

  // Update document.documentElement.lang when language changes
  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};
