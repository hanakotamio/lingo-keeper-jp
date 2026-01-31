# Database Migration Implementation Checklist

## Overview

This checklist guides you through implementing Prisma Migrate for Lingo Keeper JP, from initial setup to production deployment.

**Status**: Ready for implementation
**Created**: 2026-01-24
**Priority**: High (Required for production-safe database changes)

---

## Phase 1: Initial Setup (1-2 hours)

### Prerequisites

- [ ] Node.js 18+ installed
- [ ] Prisma CLI installed (`npm install -g prisma`)
- [ ] Neon CLI installed (`npm install -g neonctl`)
- [ ] Access to Neon production database
- [ ] Access to GitHub repository with admin permissions

### Environment Configuration

- [ ] Review `backend/.env.example` for required variables
- [ ] Create `backend/.env.staging` with staging database URL
- [ ] Create `backend/.env.production` with production database URL
- [ ] Verify `backend/.env.local` has development database URL
- [ ] Test database connectivity for all environments

```bash
# Test connections
cd backend
DATABASE_URL=$(grep DATABASE_URL .env.local | cut -d= -f2) npx prisma db execute --stdin <<< "SELECT 1;"
```

### GitHub Secrets Setup

- [ ] Add `STAGING_DATABASE_URL` to GitHub Secrets
- [ ] Add `PRODUCTION_DATABASE_URL` to GitHub Secrets
- [ ] Add `NEON_API_KEY` to GitHub Secrets (get from Neon console)
- [ ] Add `NEON_PROJECT_ID` to GitHub Secrets
- [ ] Add `SLACK_WEBHOOK_URL` to GitHub Secrets (optional, for notifications)

### Script Permissions

- [ ] Make migration scripts executable

```bash
chmod +x scripts/db-migrate-check.sh
chmod +x scripts/db-migrate-prod.sh
```

- [ ] Test script execution

```bash
./scripts/db-migrate-check.sh development
```

---

## Phase 2: Baseline Existing Database (30 minutes)

### Create Initial Migration

- [ ] Review current `prisma/schema.prisma`
- [ ] Ensure schema matches production database
- [ ] Create baseline migration

```bash
cd backend
npx prisma migrate dev --name initial_baseline --create-only
```

- [ ] Review generated migration SQL

```bash
cat prisma/migrations/*/migration.sql
```

- [ ] Apply to local development database

```bash
npx prisma migrate dev
```

### Mark Production as Baselined

- [ ] Set production DATABASE_URL

```bash
export DATABASE_URL="<production-database-url>"
```

- [ ] Check current migration status

```bash
npx prisma migrate status
```

- [ ] Mark baseline as applied (DO NOT run migrate deploy yet)

```bash
# Get the migration name
MIGRATION_NAME=$(ls -1 prisma/migrations | head -1)

# Mark as applied
npx prisma migrate resolve --applied "$MIGRATION_NAME"
```

- [ ] Verify status shows "up to date"

```bash
npx prisma migrate status
# Expected: "Database schema is up to date!"
```

### Commit Migration Files

- [ ] Review migration files

```bash
git status
git diff prisma/migrations/
```

- [ ] Commit to repository

```bash
git add prisma/migrations/
git add backend/package.json
git commit -m "Add initial Prisma Migrate baseline

- Initialize migration system for production database
- Baseline existing schema to enable future migrations
- Add migration scripts and documentation"
```

- [ ] Push to repository

```bash
git push origin main
```

---

## Phase 3: Test Migration Workflow (1 hour)

### Create Test Migration

- [ ] Make a small, safe schema change (e.g., add index)

```prisma
// In prisma/schema.prisma
model Story {
  // ... existing fields ...

  @@index([level_jlpt, level_cefr])  // Add this line if not exists
}
```

- [ ] Create migration

```bash
npx prisma migrate dev --name add_story_level_index
```

- [ ] Review generated SQL

```bash
cat prisma/migrations/*/migration.sql
```

- [ ] Test locally

```bash
npm run dev
npm run test:integration
```

### Deploy to Staging

- [ ] Commit migration

```bash
git add prisma/
git commit -m "Add index on story levels"
git push origin main
```

- [ ] Verify GitHub Actions workflow runs
- [ ] Check staging deployment logs
- [ ] Verify staging database updated

```bash
npm run migrate:status:staging
```

- [ ] Test staging application

### Rollback Test (Optional)

- [ ] Create down migration

```bash
npx prisma migrate diff \
  --from-schema-datamodel prisma/schema.prisma \
  --to-schema-datasource prisma/schema.prisma \
  --script > rollback.sql
```

- [ ] Review rollback SQL
- [ ] Mark migration as rolled back (on dev)

```bash
npx prisma migrate resolve --rolled-back <migration_name>
```

- [ ] Re-apply migration

```bash
npx prisma migrate deploy
```

---

## Phase 4: Production Readiness (30 minutes)

### Pre-Production Checks

- [ ] Review migration strategy document
- [ ] Confirm backup strategy is in place
- [ ] Test Neon branch creation

```bash
neonctl branches create --name test-backup
neonctl branches list
neonctl branches delete test-backup
```

- [ ] Run production pre-checks

```bash
./scripts/db-migrate-check.sh production
```

- [ ] Verify all checks pass

### Team Preparation

- [ ] Share migration strategy doc with team
- [ ] Schedule migration maintenance window (if needed)
- [ ] Prepare rollback plan
- [ ] Set up monitoring dashboard
- [ ] Notify stakeholders of migration timeline

### Documentation Review

- [ ] Read [Database Migration Strategy](./database-migration-strategy.md)
- [ ] Read [Migration Quick Start](./migration-quick-start.md)
- [ ] Bookmark [Emergency Procedures](./database-migration-strategy.md#emergency-procedures)
- [ ] Review [Troubleshooting Guide](./migration-quick-start.md#troubleshooting)

---

## Phase 5: First Production Migration (1 hour)

### Pre-Migration

- [ ] Verify no pending code deployments
- [ ] Check application health

```bash
curl https://lingo-keeper-jp-backend-16378814888.asia-northeast1.run.app/api/health
```

- [ ] Run pre-checks

```bash
./scripts/db-migrate-check.sh production
```

- [ ] Create manual backup

```bash
neonctl branches create --name pre-first-migration-$(date +%Y%m%d)
```

### Execute Migration

**Option A: Using Script (Recommended)**

- [ ] Run migration script

```bash
./scripts/db-migrate-prod.sh
```

- [ ] Follow prompts and confirm each step
- [ ] Monitor output for errors
- [ ] Save backup name from output

**Option B: Using GitHub Actions**

- [ ] Go to GitHub Actions
- [ ] Select "Database Migration" workflow
- [ ] Click "Run workflow"
- [ ] Select environment: `production`
- [ ] Monitor workflow execution
- [ ] Check workflow logs

**Option C: Manual Execution**

- [ ] Set DATABASE_URL

```bash
export DATABASE_URL="<production-url>"
```

- [ ] Deploy migrations

```bash
cd backend
npx prisma migrate deploy
```

- [ ] Verify status

```bash
npx prisma migrate status
```

### Post-Migration Verification

- [ ] Check migration status

```bash
npm run migrate:status:production
```

- [ ] Test application health

```bash
curl https://lingo-keeper-jp-backend-16378814888.asia-northeast1.run.app/api/health
```

- [ ] Verify critical features
  - [ ] Story list loads
  - [ ] Story detail page works
  - [ ] Quiz functionality works
  - [ ] No errors in logs

- [ ] Monitor for 30 minutes
  - [ ] Check error rates
  - [ ] Check database connections
  - [ ] Check query performance

### Post-Migration Cleanup

- [ ] Document any issues encountered
- [ ] Update team on success
- [ ] Schedule backup deletion (after 24-48 hours)

```bash
# After confirming stability
neonctl branches delete pre-first-migration-20260124
```

---

## Phase 6: CI/CD Integration (30 minutes)

### GitHub Actions Setup

- [ ] Review `.github/workflows/db-migration.yml`
- [ ] Test manual workflow trigger
- [ ] Verify staging auto-deployment
- [ ] Test production deployment via workflow
- [ ] Configure Slack notifications (optional)

### Monitoring Setup

- [ ] Set up alerts for migration failures
- [ ] Add migration metrics to dashboard
- [ ] Configure backup age alerts
- [ ] Test alert notifications

---

## Phase 7: Team Training (1 hour)

### Developer Training

- [ ] Share migration quick start guide
- [ ] Demonstrate local migration workflow

```bash
# Example workflow
1. Edit schema.prisma
2. npm run migrate:dev
3. Review migration.sql
4. Test locally
5. Commit and push
```

- [ ] Show how to check migration status
- [ ] Demonstrate rollback procedure
- [ ] Practice emergency procedures

### Documentation

- [ ] Add migration workflow to onboarding docs
- [ ] Create migration runbook
- [ ] Document common issues and solutions
- [ ] Update CLAUDE.md with migration guidelines

---

## Ongoing Maintenance Checklist

### Before Each Migration

- [ ] Review schema changes
- [ ] Check for breaking changes
- [ ] Plan multi-step approach if needed
- [ ] Test on staging first
- [ ] Run pre-migration checks
- [ ] Create backup
- [ ] Notify team

### After Each Migration

- [ ] Verify migration status
- [ ] Check application health
- [ ] Monitor error logs
- [ ] Document any issues
- [ ] Update team
- [ ] Clean up old backups

### Monthly Reviews

- [ ] Review migration history
- [ ] Check backup retention
- [ ] Audit migration logs
- [ ] Update documentation
- [ ] Review rollback procedures
- [ ] Test disaster recovery

---

## Success Criteria

### Implementation Complete When

- [x] All Phase 1-6 tasks completed
- [x] Production database baselined
- [x] Test migration deployed to staging
- [x] First production migration successful
- [x] CI/CD workflows operational
- [x] Team trained on workflow
- [x] Documentation complete

### Validation Tests

- [ ] Can create migration locally
- [ ] Can deploy to staging automatically
- [ ] Can deploy to production safely
- [ ] Can rollback if needed
- [ ] Backups created automatically
- [ ] Health checks pass after migration
- [ ] Team understands workflow

---

## Troubleshooting Reference

### Common Issues

**"Database is not managed by Prisma Migrate"**
- Solution: Complete Phase 2 (Baseline) first

**"Migration already applied"**
- Solution: Use `prisma migrate resolve --applied <name>`

**"Schema drift detected"**
- Solution: Sync schema.prisma with database, create migration

**"Cannot connect to database"**
- Solution: Check DATABASE_URL, verify Neon database is running

**"Migration failed"**
- Solution: Review error logs, fix schema, create new migration (fix-forward)

### Emergency Contacts

- Database Admin: [Your Email]
- DevOps Lead: [Team Lead Email]
- Neon Support: support@neon.tech
- On-Call Engineer: [Phone Number]

---

## Related Documentation

- [Database Migration Strategy](./database-migration-strategy.md) - Comprehensive strategy
- [Migration Quick Start](./migration-quick-start.md) - Quick reference
- [Backup Strategy](./backup-disaster-recovery-strategy.md) - Backup procedures
- [CLAUDE.md](../CLAUDE.md) - Project guidelines

---

## Appendix: NPM Scripts Reference

```json
{
  "migrate:dev": "Create and apply migration (development)",
  "migrate:deploy": "Apply migrations (production)",
  "migrate:deploy:staging": "Deploy to staging",
  "migrate:deploy:production": "Deploy to production",
  "migrate:status": "Check migration status",
  "migrate:status:staging": "Check staging status",
  "migrate:status:production": "Check production status",
  "migrate:resolve": "Fix migration history",
  "migrate:diff": "Generate SQL diff",
  "migrate:check": "Run pre-migration checks",
  "migrate:check:staging": "Staging pre-checks",
  "migrate:check:production": "Production pre-checks"
}
```

---

**Last Updated**: 2026-01-24
**Status**: Ready for Implementation
**Next Review**: After first production migration
