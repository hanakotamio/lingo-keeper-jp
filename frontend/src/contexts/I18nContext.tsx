import React, { createContext, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { TranslationKey } from '@/constants/translations/types';
import { translations } from '@/constants/translations';
import { logger } from '@/lib/logger';

interface I18nContextType {
  t: (key: TranslationKey) => string;
}

export const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface I18nProviderProps {
  children: ReactNode;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  const t = useCallback((key: TranslationKey): string => {
    try {
      const keys = key.split('.');
      let value: any = translations.en;

      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k];
        } else {
          logger.warn(`Translation missing for key: ${key}`);
          return key; // Fallback to key itself
        }
      }

      return typeof value === 'string' ? value : key;
    } catch (error) {
      logger.error('Translation error', { key, error });
      return key;
    }
  }, []);

  return (
    <I18nContext.Provider value={{ t }}>
      {children}
    </I18nContext.Provider>
  );
};
