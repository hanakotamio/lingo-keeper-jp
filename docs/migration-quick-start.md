# Database Migration Quick Start Guide

## Overview

This guide provides step-by-step instructions for managing database migrations in Lingo Keeper JP using Prisma Migrate.

---

## Table of Contents

1. [Initial Setup (Baselining)](#initial-setup-baselining)
2. [Development Workflow](#development-workflow)
3. [Deployment Workflow](#deployment-workflow)
4. [Common Tasks](#common-tasks)
5. [Troubleshooting](#troubleshooting)
6. [Emergency Procedures](#emergency-procedures)

---

## Initial Setup (Baselining)

Since the production database already exists but isn't managed by Prisma Migrate, we need to baseline it first.

### Step 1: Create Initial Migration

```bash
cd backend

# Create a migration that matches the current database schema
npx prisma migrate dev --name initial_baseline
```

This will:
- Generate a migration file based on your current `schema.prisma`
- Apply it to your local development database

### Step 2: Mark Production as Baselined

```bash
# Set production DATABASE_URL
export DATABASE_URL="postgresql://..."

# Mark the baseline migration as already applied
npx prisma migrate resolve --applied $(ls -1 prisma/migrations | head -1)

# Verify status
npx prisma migrate status
```

Expected output: `Database schema is up to date!`

### Step 3: Commit Migration Files

```bash
git add prisma/migrations/
git commit -m "Add initial database baseline migration"
git push
```

**Important**: Once baselined, NEVER use `prisma db push` for schema changes. Always use `prisma migrate dev`.

---

## Development Workflow

### Making Schema Changes

1. **Edit the schema**

```bash
cd backend
vim prisma/schema.prisma
```

2. **Create and apply migration**

```bash
npm run migrate:dev

# This will prompt you for a migration name
# Example: add_quiz_difficulty_index
```

3. **Review generated SQL**

```bash
cat prisma/migrations/YYYYMMDDHHMMSS_add_quiz_difficulty_index/migration.sql
```

4. **Test the changes**

```bash
npm run dev
npm run test:integration
```

5. **Commit the migration**

```bash
git add prisma/migrations/
git add prisma/schema.prisma
git commit -m "Add migration: add quiz difficulty index"
git push
```

### Testing Migrations Locally

```bash
# Reset database and replay all migrations
npx prisma migrate reset

# This will:
# 1. Drop the database
# 2. Create a new database
# 3. Apply all migrations
# 4. Run seed script
```

---

## Deployment Workflow

### Staging Deployment (Automatic)

Staging migrations are automatically applied when you push to `main` or `develop` branch.

**Manual deployment** (if needed):

```bash
cd backend

# Check what will be applied
npm run migrate:status:staging

# Deploy migrations
npm run migrate:deploy:staging
```

### Production Deployment (Manual Only)

**Option 1: Using GitHub Actions (Recommended)**

1. Go to GitHub Actions
2. Select "Database Migration" workflow
3. Click "Run workflow"
4. Select environment: `production`
5. Confirm and monitor

**Option 2: Using CLI Script**

```bash
cd /path/to/Lingo-Keeper-JP

# Run pre-checks
./scripts/db-migrate-check.sh production

# Review the output, then deploy
./scripts/db-migrate-prod.sh
```

The script will:
1. Confirm you want to proceed
2. Run pre-migration checks
3. Create a Neon branch backup
4. Apply migrations
5. Verify success
6. Show rollback instructions if needed

**Option 3: Manual Steps**

```bash
cd backend

# Set production DATABASE_URL
export DATABASE_URL="postgresql://..."

# 1. Check migration status
npx prisma migrate status

# 2. Review pending migrations
cat prisma/migrations/LATEST_MIGRATION/migration.sql

# 3. Create backup (using Neon CLI)
neonctl branches create --name pre-migration-$(date +%Y%m%d)

# 4. Deploy migrations
npx prisma migrate deploy

# 5. Verify
npx prisma migrate status
```

---

## Common Tasks

### Check Migration Status

```bash
cd backend

# Development
npm run migrate:status

# Staging
npm run migrate:status:staging

# Production
npm run migrate:status:production
```

### Generate Down Migration (Rollback)

```bash
cd backend

# Generate SQL to undo the last migration
npx prisma migrate diff \
  --from-schema-datamodel prisma/schema.prisma \
  --to-schema-datasource prisma/schema.prisma \
  --script > rollback.sql

# Review the rollback SQL
cat rollback.sql

# Apply it (if absolutely necessary)
npx prisma db execute --file rollback.sql
```

### Mark Migration as Rolled Back

```bash
# If you need to re-apply a migration
npx prisma migrate resolve --rolled-back 20260124000000_migration_name

# Then you can re-apply it
npx prisma migrate deploy
```

### Mark Migration as Applied

```bash
# If a migration was applied manually outside Prisma Migrate
npx prisma migrate resolve --applied 20260124000000_migration_name
```

### Create Empty Migration (for raw SQL)

```bash
# Create migration file without auto-generating SQL
npx prisma migrate dev --name custom_indexes --create-only

# Edit the generated migration.sql file
vim prisma/migrations/YYYYMMDDHHMMSS_custom_indexes/migration.sql

# Add your custom SQL
# Example: CREATE INDEX CONCURRENTLY ...

# Apply the migration
npx prisma migrate dev
```

---

## Troubleshooting

### Problem: "Database schema is not up to date"

**Solution**:

```bash
# Check what's out of sync
npx prisma migrate status

# Apply pending migrations
npx prisma migrate deploy
```

### Problem: "Migration failed with database error"

**Causes**:
- Database lock
- Constraint violation
- Syntax error

**Solution**:

```bash
# 1. Check database logs (Neon console)

# 2. Mark migration as rolled back
npx prisma migrate resolve --rolled-back 20260124000000_failed_migration

# 3. Fix the schema or migration SQL

# 4. Create new migration
npx prisma migrate dev --name fix_previous_migration
```

### Problem: "Schema drift detected"

**Cause**: Manual changes were made to the database outside Prisma Migrate

**Solution**:

```bash
# 1. Generate diff to see what changed
npx prisma migrate diff \
  --from-schema-datasource prisma/schema.prisma \
  --to-schema-datamodel prisma/schema.prisma

# 2. Update schema.prisma to match database

# 3. Create migration
npx prisma migrate dev --name sync_manual_changes
```

### Problem: "Cannot connect to database"

**Solution**:

```bash
# 1. Check DATABASE_URL is correct
echo $DATABASE_URL

# 2. Test connection
npx prisma db execute --stdin <<< "SELECT 1;"

# 3. Check Neon dashboard for database status
```

### Problem: "Prisma Client is not up to date"

**Solution**:

```bash
# Regenerate Prisma Client
npx prisma generate

# Restart your development server
npm run dev
```

---

## Emergency Procedures

### Rollback Production Migration

**Method 1: Restore from Neon Branch (Fastest)**

```bash
# List available backups
neonctl branches list

# Restore from backup
neonctl branches restore --branch pre-migration-20260124
```

**Method 2: Apply Down Migration**

```bash
cd backend

# Generate rollback SQL
npx prisma migrate diff \
  --from-schema-datamodel prisma/schema.prisma \
  --to-schema-datasource prisma/schema.prisma \
  --script > rollback.sql

# Apply rollback
npx prisma db execute --file rollback.sql

# Mark migration as rolled back
npx prisma migrate resolve --rolled-back 20260124000000_migration_name
```

### Fix Failed Migration

**Fix-Forward Approach** (Recommended):

```bash
# 1. Don't rollback, instead create a new migration that fixes the issue
npx prisma migrate dev --name fix_column_constraint

# 2. Deploy the fix
npx prisma migrate deploy
```

### Database Locked During Migration

```bash
# 1. Find blocking queries
npx prisma db execute --stdin <<< "
SELECT pid, usename, query_start, query
FROM pg_stat_activity
WHERE state != 'idle' AND pid != pg_backend_pid();
"

# 2. Kill blocking queries (if safe)
# Get the PID from above, then:
npx prisma db execute --stdin <<< "
SELECT pg_terminate_backend(12345);
"

# 3. Retry migration
npx prisma migrate deploy
```

---

## Best Practices Checklist

### Before Creating a Migration

- [ ] Schema changes are reviewed
- [ ] Breaking changes are avoided (or multi-step approach planned)
- [ ] Indexes are added where needed
- [ ] Default values are provided for new NOT NULL columns
- [ ] Migration is tested on development database

### Before Deploying to Staging

- [ ] Migration files are committed to git
- [ ] Code changes are compatible with schema
- [ ] Tests are passing
- [ ] Migration name is descriptive

### Before Deploying to Production

- [ ] Migration tested on staging
- [ ] Backup plan is ready (Neon branch created)
- [ ] Team is notified
- [ ] No long-running queries active
- [ ] Off-peak hours scheduled (if possible)
- [ ] Rollback procedure documented
- [ ] Monitoring dashboard open

### After Production Deployment

- [ ] Migration status verified
- [ ] Application health checked
- [ ] No error spikes in logs
- [ ] Critical features tested
- [ ] Team notified of success
- [ ] Backup can be deleted (after 24-48 hours)

---

## Quick Reference

### NPM Scripts

```bash
# Development
npm run migrate:dev              # Create and apply migration
npm run migrate:status           # Check migration status

# Staging
npm run migrate:deploy:staging   # Deploy to staging
npm run migrate:status:staging   # Check staging status

# Production
npm run migrate:deploy:production  # Deploy to production (rarely used)
npm run migrate:status:production  # Check production status

# Utilities
npm run migrate:check              # Run pre-migration checks
npm run migrate:check:production   # Production pre-checks
```

### Shell Scripts

```bash
# Pre-migration checks
./scripts/db-migrate-check.sh [environment]

# Production deployment
./scripts/db-migrate-prod.sh [--skip-backup] [--auto-approve]
```

### Prisma Commands

```bash
npx prisma migrate dev          # Create migration (dev)
npx prisma migrate deploy       # Apply migrations (prod)
npx prisma migrate status       # Check status
npx prisma migrate resolve      # Fix migration history
npx prisma migrate diff         # Generate SQL diff
npx prisma db execute           # Run raw SQL
npx prisma migrate reset        # Reset dev database
```

---

## Additional Resources

- [Full Migration Strategy Document](./database-migration-strategy.md)
- [Prisma Migrate Documentation](https://www.prisma.io/docs/orm/prisma-migrate)
- [Neon Branching Guide](https://neon.com/docs/guides/branching)
- [Project CLAUDE.md](../CLAUDE.md) - Development guidelines

---

**Last Updated**: 2026-01-24
**Maintained By**: Lingo Keeper JP Team
