# Database Migration Strategy - Lingo Keeper JP

## Overview

This document outlines the comprehensive database migration strategy for Lingo Keeper JP using Prisma Migrate with Neon PostgreSQL. The strategy ensures safe, zero-downtime deployments with proper rollback capabilities.

**Last Updated**: 2026-01-24

---

## Table of Contents

1. [Current State Analysis](#current-state-analysis)
2. [Migration Architecture](#migration-architecture)
3. [Environment Strategy](#environment-strategy)
4. [Zero-Downtime Migration Patterns](#zero-downtime-migration-patterns)
5. [Rollback Strategy](#rollback-strategy)
6. [CI/CD Integration](#cicd-integration)
7. [Migration Workflow](#migration-workflow)
8. [Monitoring & Safety Checks](#monitoring--safety-checks)
9. [Emergency Procedures](#emergency-procedures)
10. [Best Practices](#best-practices)

---

## Current State Analysis

### Database Status

- **Provider**: Neon PostgreSQL (serverless)
- **Current State**: Database exists but not managed by Prisma Migrate
- **Schema Management**: Currently using `prisma db push` (development-only approach)
- **Migration History**: No migration files exist (`prisma/migrations/` directory missing)

### Action Required

We need to **baseline** the existing production database to start using Prisma Migrate properly.

---

## Migration Architecture

### Prisma Migrate Commands

| Command | Purpose | Environment | Use Case |
|---------|---------|-------------|----------|
| `prisma migrate dev` | Create and apply migrations | Development | Local development, creates migration files |
| `prisma migrate deploy` | Apply pending migrations | Production/Staging | CI/CD pipelines, production deployments |
| `prisma migrate resolve` | Mark migrations as applied/rolled back | Any | Fixing migration history issues |
| `prisma migrate status` | Check migration status | Any | Pre-deployment verification |
| `prisma migrate diff` | Generate migration SQL | Any | Creating down migrations |
| `prisma db execute` | Execute raw SQL | Any | Applying down migrations |

### Connection String Strategy (Neon-Specific)

Neon now supports schema migrations via pooled connections. We use a single connection string strategy:

```bash
# Production/Staging - Pooled connection (default)
DATABASE_URL="postgresql://user:pass@ep-name-pooler.region.aws.neon.tech/neondb"

# Development - Direct connection (optional, for better performance)
DATABASE_URL="postgresql://user:pass@ep-name.region.aws.neon.tech/neondb"
```

**Note**: No need for `pgbouncer=true` parameter or separate `directUrl` in modern Neon setup (2026).

---

## Environment Strategy

### Environment Separation

We maintain three database environments:

```yaml
Development:
  Database: lingo_keeper_jp_dev
  Branch: main (Neon branch feature)
  Connection: Direct or Pooled
  Migrations: Created with migrate dev

Staging:
  Database: lingo_keeper_jp_staging
  Branch: staging (Neon branch)
  Connection: Pooled
  Migrations: Applied with migrate deploy
  Purpose: Pre-production testing

Production:
  Database: lingo_keeper_jp_prod (current neondb)
  Branch: production (Neon branch)
  Connection: Pooled
  Migrations: Applied with migrate deploy via CI/CD
  Purpose: Live application data
```

### Environment Variables

```bash
# .env.development
DATABASE_URL="postgresql://..."
NODE_ENV="development"

# .env.staging (CI/CD secret)
DATABASE_URL="postgresql://..."
NODE_ENV="staging"

# .env.production (CI/CD secret)
DATABASE_URL="postgresql://..."
NODE_ENV="production"
```

---

## Zero-Downtime Migration Patterns

### 1. Expand and Contract Pattern

The safest approach for production migrations:

**Phase 1: Expand** (Add new schema elements)
- Add new columns/tables without removing old ones
- Deploy application code that writes to both old and new schema
- No breaking changes for running applications

**Phase 2: Migrate** (Data migration)
- Backfill data from old to new schema
- Verify data integrity
- Monitor application behavior

**Phase 3: Contract** (Remove old schema elements)
- Deploy application code that only uses new schema
- Remove old columns/tables
- Clean up deprecated code

### 2. Multi-Step Column Changes

**Example: Renaming a column**

```sql
-- Step 1: Add new column (expand)
ALTER TABLE stories ADD COLUMN new_title VARCHAR(200);

-- Deploy app version that writes to both columns

-- Step 2: Backfill data
UPDATE stories SET new_title = title WHERE new_title IS NULL;

-- Step 3: Make new column NOT NULL
ALTER TABLE stories ALTER COLUMN new_title SET NOT NULL;

-- Deploy app version that only uses new_title

-- Step 4: Drop old column (contract)
ALTER TABLE stories DROP COLUMN title;
```

### 3. Safe Migration Practices

**Always Safe**:
- Adding nullable columns
- Adding new tables
- Adding indexes (with `CONCURRENTLY` in PostgreSQL)
- Adding new enum values (at the end)

**Requires Downtime or Multi-Step**:
- Dropping columns
- Renaming columns
- Changing column types
- Adding NOT NULL constraints
- Removing enum values

**Example: Adding Index Without Blocking**

```sql
-- Prisma doesn't support CONCURRENTLY directly
-- Use raw SQL migration
CREATE INDEX CONCURRENTLY idx_stories_level
ON stories(level_jlpt, level_cefr);
```

---

## Rollback Strategy

### 1. Fix-Forward Approach (Recommended)

In production, always prefer fixing forward:

```bash
# Instead of rolling back, create a new migration that fixes the issue
npx prisma migrate dev --name fix_column_issue
npx prisma migrate deploy
```

### 2. Down Migrations (Emergency Only)

For critical issues requiring immediate rollback:

```bash
# Generate down migration
npx prisma migrate diff \
  --from-schema-datamodel prisma/schema.prisma \
  --to-schema-datasource prisma/schema.prisma \
  --script > rollback.sql

# Review the rollback SQL
cat rollback.sql

# Apply rollback (use with extreme caution)
npx prisma db execute --file rollback.sql --schema prisma/schema.prisma
```

### 3. Mark Migration as Rolled Back

```bash
# If migration was applied but needs to be re-applied
npx prisma migrate resolve --rolled-back 20260124000000_migration_name
```

### 4. Database Backup Before Migration

**Always take a backup before production migrations**:

```bash
# Automated backup via our backup script
./scripts/backup-database.sh production pre-migration

# Or use Neon's branch feature (instant snapshot)
neonctl branches create --name pre-migration-backup --parent production
```

---

## CI/CD Integration

### GitHub Actions Workflow

See `.github/workflows/db-migration.yml` for the complete workflow.

**Key Steps**:

1. **Pre-Migration Check**
   - Run `prisma migrate status`
   - Verify pending migrations
   - Check database connectivity

2. **Automated Backup**
   - Create Neon branch snapshot
   - Or trigger GCS backup

3. **Migration Deployment**
   - Run `prisma migrate deploy`
   - Verify success

4. **Post-Migration Verification**
   - Run health checks
   - Verify schema integrity
   - Test critical queries

5. **Notification**
   - Slack/Discord notification on success/failure

### Manual Production Deployment

For critical migrations requiring manual oversight:

```bash
# 1. Verify migrations locally
npm run migrate:check

# 2. Create backup
./scripts/db-migrate-check.sh production

# 3. Deploy migrations
./scripts/db-migrate-prod.sh

# 4. Verify deployment
npm run migrate:status:prod
```

---

## Migration Workflow

### Development Workflow

```bash
# 1. Make schema changes in prisma/schema.prisma
vim prisma/schema.prisma

# 2. Create migration
npm run migrate:dev

# 3. Test locally
npm run dev

# 4. Commit migration files
git add prisma/migrations/
git commit -m "Add migration: description"
```

### Staging Deployment

```bash
# Automatically triggered by CI/CD on merge to staging branch
# Or manually:
npm run migrate:deploy:staging
```

### Production Deployment

```bash
# Option 1: Automated via CI/CD (recommended)
git tag -a v1.0.0 -m "Release v1.0.0 with migration"
git push origin v1.0.0

# Option 2: Manual deployment (emergency only)
./scripts/db-migrate-prod.sh
```

---

## Monitoring & Safety Checks

### Pre-Migration Checks

The `scripts/db-migrate-check.sh` script performs:

1. **Connection Test**: Verify database connectivity
2. **Migration Status**: Check pending migrations
3. **Schema Drift**: Detect manual schema changes
4. **Backup Verification**: Ensure recent backup exists
5. **Application Health**: Verify app is healthy before migration
6. **Lock Check**: Ensure no long-running queries

### Post-Migration Verification

```bash
# 1. Schema integrity
npx prisma migrate status

# 2. Application health
curl https://your-app.com/api/health

# 3. Critical queries test
npm run test:integration

# 4. Performance check
# Verify no slow queries introduced
```

### Monitoring Metrics

Track these metrics during and after migration:

- **Migration Duration**: Should complete within expected time
- **Database Locks**: Monitor for blocking queries
- **Error Rate**: Watch application error logs
- **Query Performance**: Check for slow queries
- **Connection Pool**: Monitor connection usage

---

## Emergency Procedures

### Migration Failure During Deployment

```bash
# 1. Check migration status
npx prisma migrate status

# 2. Check database logs
# Via Neon console or CLI

# 3. If migration partially applied
# Mark as rolled back and fix schema manually
npx prisma migrate resolve --rolled-back 20260124000000_failed_migration

# 4. Fix the issue and create new migration
npx prisma migrate dev --name fix_failed_migration

# 5. Deploy fix
npx prisma migrate deploy
```

### Database Locked During Migration

```bash
# 1. Check for blocking queries
SELECT * FROM pg_stat_activity
WHERE state != 'idle'
ORDER BY query_start;

# 2. Kill blocking queries (if safe)
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE pid = <blocking_pid>;

# 3. Retry migration
npx prisma migrate deploy
```

### Restore from Backup

```bash
# Option 1: Neon branch restore (instant)
neonctl branches restore --branch pre-migration-backup

# Option 2: GCS backup restore (slower)
./scripts/restore-database.sh production <backup-timestamp>
```

---

## Best Practices

### 1. Migration Naming

Use descriptive names following this pattern:

```bash
# Good
npx prisma migrate dev --name add_quiz_difficulty_index
npx prisma migrate dev --name rename_story_title_column

# Bad
npx prisma migrate dev --name update
npx prisma migrate dev --name fix
```

### 2. Migration Size

- Keep migrations small and focused
- One logical change per migration
- Easier to review and rollback
- Faster deployment times

### 3. Testing

```bash
# Always test migrations on staging first
npm run migrate:deploy:staging
npm run test:integration:staging

# Then deploy to production
npm run migrate:deploy:production
```

### 4. Documentation

Document complex migrations:

```typescript
// In migration.sql, add comments
/*
  Migration: Add multi-language support to stories
  Author: Team Name
  Date: 2026-01-24

  Changes:
  - Add translations JSON column to stories table
  - Add default English translation for existing stories
  - Index on translations for search performance

  Rollback Plan:
  - Remove translations column
  - Restore original content field
*/
```

### 5. Review Process

- All migrations must be reviewed by another developer
- Check for destructive operations
- Verify backwards compatibility
- Ensure proper indexing

### 6. Neon-Specific Optimizations

```bash
# Use Neon's branch feature for testing
neonctl branches create --name test-migration

# Test migration on branch
DATABASE_URL="<branch-url>" npx prisma migrate deploy

# If successful, apply to production
# If failed, delete branch
neonctl branches delete test-migration
```

---

## References

### Official Documentation

- [Prisma Migrate Production Guide](https://www.prisma.io/docs/orm/prisma-migrate/workflows/development-and-production)
- [Neon Prisma Migrations](https://neon.com/docs/guides/prisma-migrations)
- [Deploying Database Changes](https://www.prisma.io/docs/orm/prisma-client/deployment/deploy-database-changes-with-prisma-migrate)
- [Zero Downtime Migrations](https://www.prisma.io/dataguide/types/relational/expand-and-contract-pattern)

### Internal Documentation

- `docs/backup-disaster-recovery-strategy.md` - Backup procedures
- `scripts/db-migrate-prod.sh` - Production migration script
- `scripts/db-migrate-check.sh` - Pre-migration verification
- `.github/workflows/db-migration.yml` - CI/CD pipeline

---

## Appendix: Baselining Existing Database

Since our production database currently exists without Prisma migrations, we need to baseline it:

### Step 1: Create Initial Migration

```bash
# This creates a migration that matches current database state
npx prisma migrate dev --name initial_baseline --create-only

# Review the generated SQL
cat prisma/migrations/YYYYMMDDHHMMSS_initial_baseline/migration.sql

# Apply to local dev database
npx prisma migrate dev
```

### Step 2: Mark Production as Baselined

```bash
# Mark the baseline migration as already applied in production
# This tells Prisma "production DB already has this schema"
npx prisma migrate resolve --applied 20260124000000_initial_baseline
```

### Step 3: Verify

```bash
# Check status - should show "Database schema is up to date"
npx prisma migrate status
```

Now future migrations will be tracked properly!

---

**Document Version**: 1.0.0
**Maintained By**: Lingo Keeper JP Team
**Next Review**: 2026-04-24
