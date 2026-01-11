# Test Infrastructure Documentation

This project uses a three-layer testing approach to ensure comprehensive test coverage.

## Testing Layers

### 1. Unit Tests (Vitest)
Unit tests verify individual functions and utilities in isolation.

**Location**: `tests/unit/`

**Run Commands**:
```bash
npm run test:unit          # Run unit tests once
npm run test:unit:watch    # Run unit tests in watch mode
```

**Example**: `tests/unit/utils/validation.test.ts` tests validation utility functions.

### 2. Component Tests (Storybook + Vitest)
Component tests verify React components in isolation using Storybook stories.

**Location**: `src/stories/`

**Run Commands**:
```bash
npm run storybook          # Start Storybook dev server (http://localhost:6006)
npm run test:storybook     # Run Storybook component tests
npm run build-storybook    # Build static Storybook
```

**Example**: `src/stories/LoginPage.stories.tsx` defines stories for the LoginPage component.

### 3. E2E Tests (Playwright)
End-to-end tests verify complete user workflows in a real browser.

**Location**: `tests/e2e/`

**Run Commands**:
```bash
npm run test:e2e           # Run E2E tests in headless mode
npm run test:e2e:ui        # Run E2E tests with Playwright UI
npm run test:e2e:headed    # Run E2E tests with browser visible
```

**Examples**:
- `tests/e2e/login.spec.ts` - Login flow tests
- `tests/e2e/dashboard.spec.ts` - Dashboard navigation tests

**Helper Utilities**:
- `tests/e2e/helpers/auth.helper.ts` - Authentication helper functions

## Configuration Files

- `vitest.config.ts` - Vitest configuration for unit and component tests
- `playwright.config.ts` - Playwright configuration for E2E tests
- `tests/setup.ts` - Vitest test setup file
- `.storybook/` - Storybook configuration directory

## Test Artifacts

Generated test artifacts are automatically ignored by Git:

- `test-results/` - Playwright test results
- `playwright-report/` - Playwright HTML reports
- `coverage/` - Code coverage reports
- `tests/screenshots/` - Test screenshots
- `tests/temp/` - Temporary test files

## Running All Tests

```bash
# Run all test types
npm run test:unit && npm run test:storybook && npm run test:e2e

# Run tests with UI
npm run test:ui           # Vitest UI
npm run test:e2e:ui      # Playwright UI
```

## Success Criteria

- **Unit Tests**: 8 tests passing in `validation.test.ts`
- **Component Tests**: Storybook stories render correctly
- **E2E Tests**: Login and dashboard flows work end-to-end

## Port Configuration

- **Frontend Dev Server**: http://localhost:3847
- **Storybook**: http://localhost:6006
- **Playwright** uses the dev server at port 3847

## Test Users

For E2E tests, use the following test accounts:

- **Demo User**: demo@example.com / demo123
- **Admin User**: admin@example.com / admin123

These credentials are defined in `tests/e2e/helpers/auth.helper.ts`.
