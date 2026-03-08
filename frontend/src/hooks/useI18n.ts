import { useContext } from 'react';
import { I18nContext } from '@/contexts/I18nContext';

/**
 * Custom hook to access i18n translation context
 *
 * @returns {object} Object containing:
 *   - t: Translation function that accepts a translation key and returns translated string
 *
 * @throws {Error} If used outside of I18nProvider
 *
 * @example
 * const { t } = useI18n();
 *
 * return (
 *   <>
 *     <h1>{t('dashboard.title')}</h1>
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
