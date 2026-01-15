# Story Experience Page E2E Test Specification

Generation Date: 2026-01-12
Target Page: `/stories`
Permission Level: Guest (No authentication required)

---

## Test Environment

```yaml
URL: http://localhost:3847/stories
Authentication: Not required (PublicLayout)
Test Account: N/A (Guest access)
```

---

## Integration Tests Coverage Summary (E2E Exclusions)

The following items are already covered by backend integration tests and **MUST NOT** be included in E2E tests:

- ✅ 404 Error (Non-existent story): `backend/tests/integration/story/story.flow.test.ts`
- ✅ 404 Error (Non-existent chapter): `backend/tests/integration/story/story.flow.test.ts`
- ✅ Validation Error (Invalid level filter): `backend/tests/integration/story/story.flow.test.ts`
- ✅ API Response Structure Validation: `backend/tests/integration/story/story.flow.test.ts`
- ✅ Story Data Structure Validation: `backend/tests/integration/story/story.flow.test.ts`
- ✅ Chapter Data Structure Validation: `backend/tests/integration/story/story.flow.test.ts`
- ✅ Complete Story API Flow (List → Detail → Chapter): `backend/tests/integration/story/story.flow.test.ts`

---

## E2E Test Items (UI Flow Only: 8 Items)

| ID | Test Item | Expected Result |
|----|-----------|-----------------|
| E2E-STORY-001 | Story List Display | Navigate to /stories → Story cards are displayed with title, description, level chip, estimated time |
| E2E-STORY-002 | Level Filter Application | Select "N3-B1" filter → Only N3/B1 stories are displayed |
| E2E-STORY-003 | Story Card Click to Viewer | Click a story card → Story viewer displays with title, level chip, progress bar (0%) |
| E2E-STORY-004 | Chapter Content Display | In story viewer → Chapter content text is displayed → Progress bar shows 0% |
| E2E-STORY-005 | Ruby/Translation Toggle | Click "Ruby Display" button → Ruby text appears → Click "Translation Display" button → Translation section appears below content |
| E2E-STORY-006 | Audio Playback Trigger | Click "Play Audio" button → Button changes to "Playing..." state and is disabled |
| E2E-STORY-007 | Choice Selection Flow | View chapter with choices → Click a choice card → Card is highlighted → Progress bar updates (e.g., 0% → 20%) |
| E2E-STORY-008 | Back to List Navigation | In story viewer → Click "Back to Story List" button → Returns to story list page with filter preserved |

---

## Execution Commands

```bash
# Run all story E2E tests
npx playwright test tests/e2e/story.spec.ts

# Run a specific test
npx playwright test tests/e2e/story.spec.ts -g "E2E-STORY-001"

# Run in headed mode (view browser)
npx playwright test tests/e2e/story.spec.ts --headed

# Run with debugging
npx playwright test tests/e2e/story.spec.ts --debug
```

---

## Test Implementation Notes

### Test Data
- Use existing seed data from backend (story_id: "1", chapter_id: "ch-1-1")
- Story 1: "東京での新しい生活" (N5/A1)

### Key Selectors
```typescript
// Story List Page
const levelFilterButton = page.getByRole('button', { name: 'N3 / B1' });
const storyCard = page.getByRole('article').first();

// Story Viewer
const backButton = page.getByRole('button', { name: 'ストーリー一覧に戻る' });
const rubyToggle = page.getByRole('button', { name: 'ルビ表示' });
const translationToggle = page.getByRole('button', { name: '翻訳表示' });
const audioButton = page.getByRole('button', { name: /音声/ });
const choiceCard = page.getByRole('article').first();
const progressBar = page.locator('[role="progressbar"]');
```

### Common Assertions
```typescript
// Verify story card structure
await expect(storyCard).toContainText('東京での新しい生活');
await expect(storyCard).toContainText('N5 / A1');
await expect(storyCard).toContainText('約10分');

// Verify progress bar value
await expect(progressBar).toHaveAttribute('aria-valuenow', '0');
await expect(progressBar).toHaveAttribute('aria-valuenow', '20'); // After choice

// Verify button state changes
await expect(audioButton).toBeDisabled();
await expect(audioButton).toContainText('音声再生中...');
```

---

## Quality Checklist

| Verification Item | Status |
|-------------------|--------|
| E2E item count is 5-10? | ☑ (8 items) |
| Integration test coverage confirmed? | ☑ |
| 401/403 errors excluded? | ☑ (No auth required) |
| Validation errors excluded? | ☑ |
| Responsive tests excluded? | ☑ |
| Individual UI component tests excluded? | ☑ |
| Flow-based design? | ☑ |

---

## Implementation Status

| Test ID | Implementation | Status |
|---------|---------------|--------|
| E2E-STORY-001 | Story List Display | ⬜ Not Started |
| E2E-STORY-002 | Level Filter Application | ⬜ Not Started |
| E2E-STORY-003 | Story Card Click to Viewer | ⬜ Not Started |
| E2E-STORY-004 | Chapter Content Display | ⬜ Not Started |
| E2E-STORY-005 | Ruby/Translation Toggle | ⬜ Not Started |
| E2E-STORY-006 | Audio Playback Trigger | ⬜ Not Started |
| E2E-STORY-007 | Choice Selection Flow | ⬜ Not Started |
| E2E-STORY-008 | Back to List Navigation | ⬜ Not Started |

---

**Created**: 2026-01-12
**Last Updated**: 2026-01-12
**Status**: Design Complete - Ready for Implementation
