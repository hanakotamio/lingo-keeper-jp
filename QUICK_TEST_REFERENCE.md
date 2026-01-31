# Quick E2E Test Reference

## Last Test Run: 2026-01-24

### Results at a Glance
```
✅ PASSED: 24/44 (54.5%)
❌ FAILED: 20/44 (45.5%)
⏱️  TIME:   3m 54s
```

### Status by Category
| Category | Passed | Failed | Status |
|----------|--------|--------|--------|
| Login Tests | 8 | 0 | ✅ All Pass |
| Layout Tests | 5 | 0 | ✅ All Pass |
| Visual QA | 2 | 0 | ✅ All Pass |
| Dashboard | 0 | 4 | ❌ Backend Required |
| Quiz Tests | 0 | 8 | ❌ Backend Required |
| Story Tests | 0 | 8 | ❌ Backend Required |

---

## 🚨 Current Issue

**Backend API server is not running!**

All failures are due to:
- API calls timing out
- Pages stuck on "Loading..." (読み込み中...)
- "Story ID is required" errors

---

## 🔧 How to Fix

### Step 1: Start Backend
```bash
cd /home/hanakotamio0705/Lingo\ Keeper\ JP/backend
python -m uvicorn src.main:app --host 0.0.0.0 --port 8534 --reload
```

### Step 2: Verify Backend
```bash
curl http://localhost:8534/api/health
# Should return: {"status": "healthy", "database": "connected"}
```

### Step 3: Run Tests
```bash
cd /home/hanakotamio0705/Lingo\ Keeper\ JP/frontend
npm run test:e2e
```

### Step 4: View Report
```bash
npx playwright show-report
```

---

## 📊 Expected Results After Fix

With backend running:
- ✅ **44/44 tests passing (100%)**
- ✅ All story cards load
- ✅ Quiz pages work
- ✅ Dashboard displays data
- ✅ No timeout errors

---

## 📁 Report Files

| File | Description |
|------|-------------|
| `E2E_TEST_RESULTS_2026-01-24.md` | Detailed analysis |
| `E2E_TEST_SUMMARY.txt` | Visual summary |
| `frontend/playwright-report/index.html` | Interactive HTML report |
| `frontend/test-results/` | Screenshots & error logs |

---

## 🎯 Quick Commands

```bash
# Start backend
cd backend && python -m uvicorn src.main:app --port 8534 --reload

# Run all E2E tests
cd frontend && npm run test:e2e

# Run specific test file
cd frontend && npx playwright test tests/e2e/login.spec.ts

# Run tests in UI mode (interactive)
cd frontend && npx playwright test --ui

# Show last test report
cd frontend && npx playwright show-report

# Debug mode (opens browser)
cd frontend && npx playwright test --debug

# Run only failed tests
cd frontend && npx playwright test --last-failed
```

---

## 🐛 Debugging Tips

### If tests still fail after starting backend:

1. **Check backend logs for errors**
2. **Verify database connection**
   ```bash
   curl http://localhost:8534/api/health
   ```
3. **Check if data exists**
   ```bash
   curl http://localhost:8534/api/stories
   ```
4. **Clear browser cache**
   ```bash
   cd frontend && npx playwright test --clear-cache
   ```

### Common Issues:

| Issue | Solution |
|-------|----------|
| Port 8534 already in use | `lsof -ti:8534 \| xargs kill -9` |
| Port 3847 already in use | `lsof -ti:3847 \| xargs kill -9` |
| Database connection error | Check DATABASE_URL in .env |
| Tests timeout | Increase timeout in playwright.config.ts |

---

## 📞 Test Infrastructure

### Playwright Config
- **Base URL:** `http://localhost:3847`
- **Timeout:** 30s per test
- **Retries:** 0 (local), 2 (CI)
- **Workers:** 4 (parallel)
- **Browser:** Chromium

### Test Helpers
- **Auth:** `tests/e2e/helpers/auth.helper.ts`
- **Test Users:** 
  - Demo: `demo@example.com` / `demo123`
  - Admin: `admin@example.com` / `admin123`

---

**Last Updated:** 2026-01-24 16:53 UTC
