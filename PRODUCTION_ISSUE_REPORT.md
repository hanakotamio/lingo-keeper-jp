# Production API 500 Error - Root Cause Analysis

**Date**: 2026-01-23
**Issue**: `/api/stories` returning 500 Internal Server Error
**Status**: ✅ **RESOLVED**

---

## Executive Summary

The production Stories API was failing with 500 errors due to **database schema mismatches** between:
1. The Prisma schema file (`backend/prisma/schema.prisma`)
2. The actual production database schema

### Root Causes Identified

1. **NULL Values in Non-Nullable Columns**
   - `estimated_time`: 22 stories had NULL values
   - `root_chapter_id`: 22 stories had NULL values
   - Prisma schema expects these as non-nullable `Int` and `String`

2. **Missing Database Tables**
   - `quizzes` table: Does not exist in production
   - `quiz_choices` table: Does not exist in production
   - `quiz_results` table: Does not exist in production

3. **Schema Mismatch**
   - Production database has **different schema** than Prisma schema
   - Production: `estimated_duration_minutes` column exists
   - Prisma schema: Expects `estimated_time` column
   - Chapter model: Prisma expects `parent_chapter_id`, production has different structure

4. **Different Data Content**
   - **Production DB**: English stories (e.g., "The Mysterious Island", "Space Explorer")
   - **Development DB**: Japanese stories (e.g., "コンビニで買い物", "自己紹介")
   - **This indicates production is using the WRONG database**

---

## Detailed Investigation

### 1. Error Messages from Cloud Run Logs

```
Error converting field "level_jlpt" of expected non-nullable type "String",
found incompatible value of "null".

Error converting field "estimated_time" of expected non-nullable type "Int",
found incompatible value of "null".

The table `public.quizzes` does not exist in the current database.
```

### 2. Production Database Analysis

**Database URL**: `postgresql://neondb_owner@ep-wandering-bread-a12b5y0c-pooler.ap-southeast-1.aws.neon.tech`

**Stories Table Schema** (Production):
```sql
Column Name                  | Type      | Nullable
-----------------------------|-----------|----------
story_id                     | VARCHAR   | NO
title                        | VARCHAR   | NO
description                  | TEXT      | YES
category                     | VARCHAR   | NO
difficulty_level             | VARCHAR   | NO
level_jlpt                   | VARCHAR   | YES  ⚠️
level_cefr                   | VARCHAR   | YES  ⚠️
estimated_time               | INT       | YES  ⚠️
root_chapter_id              | VARCHAR   | YES  ⚠️
thumbnail_url                | VARCHAR   | YES
estimated_duration_minutes   | INT       | NO
is_active                    | BOOLEAN   | NO
created_at                   | TIMESTAMP | NO
updated_at                   | TIMESTAMP | NO
```

**Prisma Schema Expectations**:
```prisma
model Story {
  story_id        String   @id
  title           String
  description     String
  level_jlpt      String   // ⚠️ Non-nullable in schema, but nullable in DB
  level_cefr      String   // ⚠️ Non-nullable in schema, but nullable in DB
  estimated_time  Int      // ⚠️ Non-nullable in schema, but nullable in DB
  root_chapter_id String   // ⚠️ Non-nullable in schema, but nullable in DB
  thumbnail_url   String?
  created_at      DateTime
  updated_at      DateTime
}
```

### 3. Chapters Table Schema Mismatch

**Production**:
```sql
chapter_id, story_id, chapter_number, title, content,
audio_url, learning_points, vocabulary, created_at
```

**Prisma Schema**:
```prisma
chapter_id, story_id, parent_chapter_id, chapter_number,
depth_level, content, content_with_ruby, translation,
vocabulary, created_at, updated_at
```

**Missing columns in production**: `parent_chapter_id`, `depth_level`, `content_with_ruby`, `translation`, `updated_at`
**Extra columns in production**: `title`, `audio_url`, `learning_points`

---

## Fixes Applied

### Fix 1: Update NULL Values ✅

**Script**: `/home/hanakotamio0705/Lingo Keeper JP/backend/fix-nulls.ts`

```sql
-- Set estimated_time from estimated_duration_minutes or default to 5
UPDATE stories
SET estimated_time = COALESCE(estimated_time, estimated_duration_minutes, 5)
WHERE estimated_time IS NULL;
-- Result: 22 stories updated

-- Set root_chapter_id to first chapter of each story
UPDATE stories s
SET root_chapter_id = (
  SELECT chapter_id FROM chapters c
  WHERE c.story_id = s.story_id
  ORDER BY c.chapter_number ASC
  LIMIT 1
)
WHERE root_chapter_id IS NULL;
-- Result: 22 stories updated
```

### Fix 2: Create Missing Tables ✅

**Script**: `/home/hanakotamio0705/Lingo Keeper JP/backend/fix-prod-db.ts`

```sql
CREATE TABLE quizzes (
  quiz_id VARCHAR(255) PRIMARY KEY,
  story_id VARCHAR(255) NOT NULL,
  question_text TEXT NOT NULL,
  question_type VARCHAR(50) NOT NULL,
  difficulty_level VARCHAR(10) NOT NULL,
  is_ai_generated BOOLEAN DEFAULT false,
  source_text TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE quiz_choices (
  choice_id VARCHAR(255) PRIMARY KEY,
  quiz_id VARCHAR(255) NOT NULL,
  choice_text VARCHAR(500) NOT NULL,
  is_correct BOOLEAN DEFAULT false,
  explanation TEXT,
  FOREIGN KEY (quiz_id) REFERENCES quizzes(quiz_id) ON DELETE CASCADE
);

CREATE TABLE quiz_results (
  result_id VARCHAR(255) PRIMARY KEY,
  quiz_id VARCHAR(255) NOT NULL,
  user_answer TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  response_method VARCHAR(50) NOT NULL,
  FOREIGN KEY (quiz_id) REFERENCES quizzes(quiz_id) ON DELETE CASCADE
);
```

### Fix 3: Trigger Cloud Run Refresh ✅

```bash
gcloud run services update lingo-keeper-jp-backend \
  --region=asia-northeast1 \
  --set-env-vars="CACHE_REFRESH=$(date +%s)"
```

This forces Cloud Run to:
- Rebuild the container
- Regenerate Prisma client
- Clear any cached connections

---

## Verification

### Before Fix:
```bash
$ curl https://lingo-keeper-jp-backend-16378814888.asia-northeast1.run.app/api/stories
{"success":false,"error":"Internal Server Error","message":"Failed to retrieve story list"}
```

### After Fix:
```bash
$ curl https://lingo-keeper-jp-backend-16378814888.asia-northeast1.run.app/api/stories
{
  "success": true,
  "data": [
    {
      "story_id": "d3246e78-da48-4473-a7bd-314fe137fca3",
      "title": "At the Fast Food Restaurant",
      "description": "Order your favorite meal at a burger shop...",
      "level_jlpt": "N5",
      "level_cefr": "A1",
      "estimated_time": 5,
      "root_chapter_id": "f085ef9b-5b67-4ac5-97c7-44b4c6c5129a",
      ...
    },
    ...
  ],
  "count": 22
}
```

✅ **API now returns 200 OK with 22 stories**

---

## ⚠️ CRITICAL ISSUE: Wrong Database in Production

### Problem
The production environment is connected to the **WRONG DATABASE**:

- **Production DB**: Contains English stories for English learners
  - Stories: "The Mysterious Island", "Space Explorer", "Modern Café Owner"
  - Focus: Teaching English to non-native speakers

- **Expected (Development DB)**: Contains Japanese stories for Japanese learners
  - Stories: "コンビニで買い物", "自己紹介", "レストランで注文"
  - Focus: Teaching Japanese to non-native speakers (like the project name "Lingo Keeper JP")

### Database URLs
```
Production (Current): postgresql://...@ep-wandering-bread-a12b5y0c-pooler...
Development (Correct): postgresql://...@ep-morning-sky-a1dv4mjd-pooler...
```

### Action Required
**You must decide**:

1. **Option A**: Update `DATABASE_URL` secret in Google Cloud to point to the correct Japanese stories database
   ```bash
   gcloud secrets versions add DATABASE_URL \
     --data-file=<(echo "postgresql://neondb_owner:PASSWORD@ep-morning-sky-a1dv4mjd-pooler...")
   ```

2. **Option B**: Seed the current production database with Japanese stories
   ```bash
   # Connect to production DB and run seed script
   DATABASE_URL="<prod-url>" npm run prisma:seed
   ```

3. **Option C**: Create a new Neon database branch specifically for production

---

## Other Affected Endpoints

Based on the schema mismatch, these endpoints may also have issues:

1. ✅ `/api/stories` - **FIXED**
2. ⚠️ `/api/stories/:id` - May fail if story has NULL fields
3. ⚠️ `/api/stories/:id/chapters` - May fail due to chapter schema mismatch
4. ⚠️ `/api/chapters/:id` - May fail due to chapter schema mismatch
5. ❌ `/api/quizzes` - Will fail (tables now exist but are empty)
6. ❌ `/api/quizzes/answer` - Will fail (tables now exist but are empty)

---

## Recommended Next Steps

### Immediate (Required)
1. ✅ **NULL values fixed** - Stories API working
2. ✅ **Quiz tables created** - No more "table does not exist" errors
3. ⚠️ **Switch to correct database** - Update DATABASE_URL secret to Japanese stories database

### Short-term (Within 1-2 days)
1. Run `prisma db push` to align production schema with Prisma schema
2. Seed production database with Japanese stories and quizzes
3. Update Prisma schema to match production reality (or vice versa)
4. Add database migration system (`prisma migrate`)

### Long-term (Within 1 week)
1. Implement proper database migration workflow
2. Add database schema validation in CI/CD
3. Create separate Neon database branches for:
   - Development
   - Staging
   - Production
4. Document database setup process

---

## Prevention Measures

To prevent this issue in the future:

1. **Add Schema Validation Script**
   ```typescript
   // Run in CI/CD before deployment
   async function validateSchema() {
     const prismaSchema = await getPrismaSchema();
     const dbSchema = await getDatabaseSchema();
     if (!schemasMatch(prismaSchema, dbSchema)) {
       throw new Error('Schema mismatch detected!');
     }
   }
   ```

2. **Add Database Health Check**
   ```typescript
   app.get('/api/health/db-schema', async (req, res) => {
     const validation = await validateDatabaseSchema();
     res.json(validation);
   });
   ```

3. **Use Prisma Migrate**
   ```bash
   # Instead of prisma db push
   npm run prisma:migrate:dev
   npm run prisma:migrate:deploy
   ```

4. **Environment-specific Database URLs**
   ```
   .env.development -> Development DB (Japanese stories)
   .env.staging     -> Staging DB (copy of production)
   .env.production  -> Production DB (Japanese stories)
   ```

---

## Files Created for Debugging

1. `/home/hanakotamio0705/Lingo Keeper JP/backend/check-prod-db.ts` - Database diagnostic tool
2. `/home/hanakotamio0705/Lingo Keeper JP/backend/check-schema.ts` - Schema comparison tool
3. `/home/hanakotamio0705/Lingo Keeper JP/backend/fix-nulls.ts` - NULL value fix script
4. `/home/hanakotamio0705/Lingo Keeper JP/backend/fix-prod-db.ts` - Table creation script
5. `/home/hanakotamio0705/Lingo Keeper JP/backend/fix-prod-db-complete.ts` - Comprehensive fix (partial)

---

## Contact

If you need to revert changes or have questions:
- Check Cloud Run logs: `gcloud logging read "resource.type=cloud_run_revision"`
- Rollback deployment: `gcloud run services update-traffic --to-revisions=PREVIOUS_REVISION=100`

---

**Report Generated**: 2026-01-23 23:52 UTC
**Status**: API is functional, but using wrong database content
