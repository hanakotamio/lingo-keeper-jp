import { useContext } from 'react';
import { I18nContext } from '@/contexts/I18nContext';

/**
 * Custom hook to access i18n translation context
 *
 * @returns {object} Object containing:
 *   - language: Current UI language ('en' | 'ja')
 *   - setLanguage: Function to change UI language
 *   - t: Translation function that accepts a translation key and returns translated string
 *
 * @throws {Error} If used outside of I18nProvider
 *
 * @example
 * const { t, language, setLanguage } = useI18n();
 *
 * return (
 *   <>
 *     <h1>{t('dashboard.title')}</h1>
 *     <Button onClick={() => setLanguage('ja')}>
 *       {t('header.languageSwitcher')}
 *     </Button>
 *   </>
 * );
 */
export const useI18n = () => {
  const context = useContext(I18nContext);

  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }

  return context;
};
