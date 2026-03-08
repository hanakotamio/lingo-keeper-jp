# Suggested Fix: Force English UI Language

**Issue**: Production environment defaults to Japanese UI despite code configuration
**Solution**: Force English language in I18nContext

---

## Option 1: Minimal Change (Recommended for Quick Fix)

**File**: `/frontend/src/contexts/I18nContext.tsx`

### Change 1: Force 'en' as default

```diff
- const DEFAULT_LANGUAGE: SupportedLanguage = 'en';
+ const FORCED_UI_LANGUAGE: SupportedLanguage = 'en'; // Force English for all users

  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
-   try {
-     const stored = localStorage.getItem(STORAGE_KEY);
-     if (stored && (stored === 'en' || stored === 'ja')) {
-       return stored as SupportedLanguage;
-     }
-   } catch (error) {
-     logger.error('Failed to load UI language from localStorage', { error });
-   }
-   return DEFAULT_LANGUAGE;
+   // Always return 'en' - this is an English-only UI app
+   return FORCED_UI_LANGUAGE;
  });
```

### Change 2: Disable language switching

```diff
  const setLanguage = useCallback((newLanguage: SupportedLanguage) => {
+   // Language switching disabled - English-only UI
+   logger.warn('Language switching is disabled in this version');
+   return;
-   try {
-     setLanguageState(newLanguage);
-     localStorage.setItem(STORAGE_KEY, newLanguage);
-     logger.info('UI language changed', { language: newLanguage });
-   } catch (error) {
-     logger.error('Failed to save UI language to localStorage', { error });
-   }
  }, []);
```

---

## Option 2: Complete Removal of i18n System

If you want to fully commit to English-only UI:

### Step 1: Delete Japanese translations

```bash
rm /frontend/src/constants/translations/ja.ts
```

### Step 2: Update types

**File**: `/frontend/src/constants/translations/types.ts`

```diff
- export type SupportedLanguage = 'en' | 'ja';
+ export type SupportedLanguage = 'en';
```

### Step 3: Simplify index

**File**: `/frontend/src/constants/translations/index.ts`

```diff
  import { en } from './en';
- import { ja } from './ja';
  import type { SupportedLanguage, Translations } from './types';

  export const translations: Record<SupportedLanguage, Translations> = {
    en,
-   ja,
  };
```

### Step 4: Simplify I18nContext

**File**: `/frontend/src/contexts/I18nContext.tsx`

```typescript
export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  // Always use English
  const language: SupportedLanguage = 'en';

  const t = useCallback(
    (key: TranslationKey): string => {
      try {
        const keys = key.split('.');
        let value: any = translations['en']; // Always use English

        for (const k of keys) {
          if (value && typeof value === 'object' && k in value) {
            value = value[k];
          } else {
            logger.warn(`Translation missing for key: ${key}`);
            return key;
          }
        }

        return typeof value === 'string' ? value : key;
      } catch (error) {
        logger.error('Translation error', { key, error });
        return key;
      }
    },
    []
  );

  const setLanguage = useCallback(() => {
    logger.warn('Language switching is not available in this version');
  }, []);

  useEffect(() => {
    document.documentElement.lang = 'en';
  }, []);

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};
```

---

## Option 3: Environment Variable Override

### Step 1: Add environment variable

**File**: `/frontend/.env.production`

```bash
VITE_DEFAULT_UI_LANGUAGE=en
VITE_FORCE_ENGLISH_UI=true
```

### Step 2: Use in code

**File**: `/frontend/src/contexts/I18nContext.tsx`

```typescript
const DEFAULT_LANGUAGE: SupportedLanguage =
  (import.meta.env.VITE_DEFAULT_UI_LANGUAGE as SupportedLanguage) || 'en';

const FORCE_ENGLISH = import.meta.env.VITE_FORCE_ENGLISH_UI === 'true';

const [language, setLanguageState] = useState<SupportedLanguage>(() => {
  if (FORCE_ENGLISH) {
    return 'en';
  }
  // ... existing logic ...
});
```

### Step 3: Update Vercel environment variables

In Vercel dashboard:
1. Go to Settings → Environment Variables
2. Add:
   - Key: `VITE_DEFAULT_UI_LANGUAGE`, Value: `en`
   - Key: `VITE_FORCE_ENGLISH_UI`, Value: `true`
3. Redeploy

---

## Testing After Fix

### Test locally first

```bash
cd frontend
npm run build
npm run preview
# Open http://localhost:4173 and check if login page is in English
```

### Test in production

```bash
cd frontend
npx playwright test --config=playwright.config.production.ts button-labels-verification.spec.ts
```

Should see:
```
✅ 8/8 tests passed
```

---

## Recommended Approach

**For immediate fix**: Use **Option 1** (minimal change)
- Fastest to implement
- Low risk
- Can be deployed immediately

**For long-term**: Use **Option 2** (complete removal)
- Cleaner codebase
- No unused code
- Aligns with CLAUDE.md documentation
- But requires more testing

---

## Deployment Steps

1. Make the code changes
2. Commit: `git commit -m "fix: Force English UI language in production"`
3. Test locally: `npm run build && npm run preview`
4. Deploy to Vercel: `git push origin main`
5. Wait for deployment
6. Run verification tests: `npx playwright test --config=playwright.config.production.ts button-labels-verification.spec.ts`
7. Verify manually: Visit https://lingo-keeper-jp.vercel.app

---

## Rollback Plan

If something goes wrong:

```bash
# Revert the commit
git revert HEAD

# Push to trigger redeployment
git push origin main
```
