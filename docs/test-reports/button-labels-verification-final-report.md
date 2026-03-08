# Button Labels Verification Test - Final Report

**Date**: 2026-03-07
**Environment**: Production (https://lingo-keeper-jp.vercel.app)
**Commit Under Test**: 80d5421 "feat: Change UI buttons and labels from Japanese to English"
**Test Files**:
- `frontend/tests/e2e/button-labels-verification.spec.ts`
- `frontend/tests/e2e/debug-language-setting.spec.ts`

---

## Executive Summary

**Critical Issue Identified**: The production build is defaulting to Japanese UI language despite code configuration setting `DEFAULT_LANGUAGE = 'en'`.

### Test Results
- **Verification Tests**: 7/8 passed (87.5%)
- **Debug Tests**: 3/5 passed (60%)
- **Critical Finding**: HTML lang attribute is set to `'ja'` even when localStorage is empty

---

## Root Cause Analysis

### The Problem

**Expected Behavior**:
```typescript
// frontend/src/contexts/I18nContext.tsx (line 15)
const DEFAULT_LANGUAGE: SupportedLanguage = 'en';
```

**Actual Behavior in Production**:
```
localStorage.getItem('lingo_keeper_ui_language') = null
document.documentElement.lang = 'ja'  ❌ WRONG! Should be 'en'
```

### Debug Test Evidence

**DEBUG-001**: Initial state check
- Stored language: `null` (no localStorage value)
- HTML lang attribute: `'ja'` ❌
- **Expected**: HTML lang should be `'en'` when no localStorage value exists

**DEBUG-002**: After clearing localStorage
- Language after clear: `null`
- HTML lang after reload: `'ja'` ❌
- Has English Login text: `true` (but mixed with Japanese)
- Has Japanese Login text: `true` (should be false)

**DEBUG-003**: Force set to English
- Set localStorage to `'en'`
- After reload, still shows Japanese UI ❌
- Login button (English): `false`
- Email field (English): `false`

**DEBUG-004**: Browser language set to English
- Browser language: `'en-US'`
- Stored language: `null`
- Still defaults to Japanese ❌

**DEBUG-005**: Check all localStorage
- localStorage contents: `{}` (empty)
- No language-related keys found

### Likely Causes

Based on the evidence, there are several possible explanations:

1. **Build-time constant issue**: The Vite build may be inlining the wrong default
2. **I18nContext initialization bug**: The useState initialization might have a logic error
3. **SSR/hydration issue**: If there's any server-side rendering, it might default to 'ja'
4. **Environment variable override**: A build-time environment variable might be setting the default
5. **Code deployment mismatch**: The deployed code might not match the repository

---

## Contradiction with CLAUDE.md

According to `CLAUDE.md` (updated 2026-01-17 17:00):

> **最新の変更 (2026-01-17 17:00)**
> - **母国語選択機能を削除**: 英語話者向けアプリに変更
> - **デフォルト言語**: 英語 (en) に固定

Translation: "Removed native language selection feature: Changed to app for English speakers. Default language: Fixed to English (en)"

**Reality**: The production app still has:
- i18n system with both English and Japanese translations
- Defaults to Japanese UI in production
- Full Japanese translation file (`ja.ts`) still present

---

## Affected UI Elements

### Japanese UI Currently Visible in Production

**Login Page** (`/`):
- "ログイン" (Login)
- "メールアドレス" (Email)
- "パスワード" (Password)
- "ログイン状態を保持する" (Keep me logged in)
- "デモアカウント:" (Demo account)
- "ユーザー:" (User)
- "管理者:" (Admin)

**Other Pages Work Correctly** (when logged in):
- Stories page: ✅ English ("Stories by Level", "Recommended for You")
- Story detail: ✅ English ("Back to Story List")
- Quiz page: ✅ English (voice instructions)
- Loading states: ✅ English ("Loading...")

---

## Recommended Solutions

### Option 1: Quick Fix - Force English Default in Build

**File**: `frontend/src/contexts/I18nContext.tsx`

```typescript
// Current (line 15)
const DEFAULT_LANGUAGE: SupportedLanguage = 'en';

// Change to (line 23-32)
const [language, setLanguageState] = useState<SupportedLanguage>(() => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && (stored === 'en' || stored === 'ja')) {
      return stored as SupportedLanguage;
    }
  } catch (error) {
    logger.error('Failed to load UI language from localStorage', { error });
  }
  return DEFAULT_LANGUAGE; // ⚠️ This might not be working correctly
});

// Proposed fix - Force 'en' regardless of any condition
const [language, setLanguageState] = useState<SupportedLanguage>('en');
```

### Option 2: Remove Japanese UI Entirely (Recommended)

Since CLAUDE.md states this is an "English speakers learning Japanese" app:

1. **Delete Japanese UI translations**:
   - Remove `/frontend/src/constants/translations/ja.ts`
   - Update `types.ts` to only support `'en'`

2. **Simplify I18nContext**:
   - Remove language switcher
   - Hard-code English strings
   - Remove localStorage persistence

3. **Remove i18n complexity**:
   ```typescript
   // Simple English-only approach
   export const translations = {
     auth: {
       login: 'Login',
       email: 'Email',
       password: 'Password',
       rememberMe: 'Keep me logged in',
       // ...
     }
   };
   ```

### Option 3: Add Environment Variable Override

**File**: `.env.production`
```bash
VITE_DEFAULT_UI_LANGUAGE=en
```

**File**: `frontend/src/contexts/I18nContext.tsx`
```typescript
const DEFAULT_LANGUAGE: SupportedLanguage =
  (import.meta.env.VITE_DEFAULT_UI_LANGUAGE as SupportedLanguage) || 'en';
```

### Option 4: Debug Production Build Locally

```bash
cd frontend
npm run build
npm run preview
# Check if the preview server shows English or Japanese
```

---

## Immediate Action Items

### Priority 1: Investigate Deployed Code

1. **Check Vercel deployment**:
   - Verify which commit is actually deployed
   - Check environment variables
   - Review build logs

2. **Compare local build vs production**:
   ```bash
   cd frontend
   npm run build
   npm run preview  # Test at http://localhost:4173
   ```

3. **Inspect production bundle**:
   - Check if `DEFAULT_LANGUAGE` is correctly set in the minified JS
   - Look for any hardcoded 'ja' values

### Priority 2: Fix and Redeploy

**Recommended approach**: Force English in I18nContext.tsx

```typescript
// Line 15: Change from
const DEFAULT_LANGUAGE: SupportedLanguage = 'en';

// To
const FORCED_LANGUAGE: SupportedLanguage = 'en';

// Line 23: Change from
const [language, setLanguageState] = useState<SupportedLanguage>(() => {
  // ... localStorage logic ...
  return DEFAULT_LANGUAGE;
});

// To
const [language] = useState<SupportedLanguage>(FORCED_LANGUAGE);
// Remove setLanguageState entirely
```

### Priority 3: Remove Unused Code

If truly English-only:
1. Delete `frontend/src/constants/translations/ja.ts`
2. Remove language switcher UI components
3. Update documentation to clarify UI is English-only

---

## Test Artifacts

### Screenshots
- `test-results/debug-language-before-clear.png` - Initial state (shows Japanese)
- `test-results/debug-language-after-clear.png` - After clearing localStorage (still Japanese)
- `test-results/debug-language-forced-en.png` - After forcing 'en' (still Japanese)

### Video Recordings
- Multiple test recordings available in `test-results/*/video.webm`

### Console Logs
```
Stored language in localStorage: null
HTML lang attribute: ja  ❌ Expected: en

After clearing localStorage:
Language after clear and reload: null
HTML lang after reload: ja  ❌ Expected: en

After forcing 'en':
Has Login button (English): false  ❌
Has Email field (English): false  ❌
```

---

## Conclusion

**The issue is confirmed**: Production defaults to Japanese UI despite:
1. Code setting `DEFAULT_LANGUAGE = 'en'`
2. Empty localStorage
3. Browser language set to English
4. Documentation stating "English-only app"

**This is NOT a translation issue** - the English translations exist and are correct. **This IS a configuration/deployment issue** - the wrong language is being selected at runtime.

**Recommended next step**: Implement Option 2 (remove Japanese UI entirely) or Option 1 (force English default) and redeploy immediately.

---

## References

- Commit: 80d5421 "feat: Change UI buttons and labels from Japanese to English"
- CLAUDE.md: States app is "英語話者向け" (for English speakers)
- i18n implementation: `/frontend/src/contexts/I18nContext.tsx`
- Translation files: `/frontend/src/constants/translations/`
