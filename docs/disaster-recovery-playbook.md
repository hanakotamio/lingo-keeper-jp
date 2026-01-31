# Disaster Recovery Playbook

**Project:** Lingo Keeper JP
**Database:** Neon PostgreSQL
**Version:** 1.0
**Last Updated:** 2026-01-24

---

## Table of Contents

1. [Emergency Contacts](#emergency-contacts)
2. [Recovery Scenarios](#recovery-scenarios)
3. [Incident Response Procedures](#incident-response-procedures)
4. [Recovery Time Objectives](#recovery-time-objectives)
5. [Step-by-Step Recovery Procedures](#step-by-step-recovery-procedures)
6. [Verification Checklist](#verification-checklist)
7. [Post-Incident Review](#post-incident-review)

---

## Emergency Contacts

### Primary Contacts
- **Database Administrator:** [Your Email]
- **DevOps Lead:** [Your Email]
- **On-Call Engineer:** [PagerDuty/Slack Channel]

### Vendor Support
- **Neon Support:** support@neon.tech
- **Neon Status Page:** https://status.neon.tech
- **Google Cloud Support:** https://cloud.google.com/support
- **Vercel Support:** https://vercel.com/support

### Documentation
- **Backup Strategy:** `/docs/backup-disaster-recovery-strategy.md`
- **Quick Reference:** `/docs/backup-quick-reference.md`
- **Implementation Checklist:** `/docs/backup-implementation-checklist.md`

---

## Recovery Scenarios

### Scenario Classification

| Severity | Description | Max Downtime | Response Time |
|----------|-------------|--------------|---------------|
| **P0 - Critical** | Complete database loss, production down | 30 minutes | Immediate |
| **P1 - High** | Data corruption, partial data loss | 2 hours | < 15 minutes |
| **P2 - Medium** | Accidental deletion, recoverable via PITR | 4 hours | < 1 hour |
| **P3 - Low** | Non-critical data loss, test environment | 24 hours | < 4 hours |

---

## Incident Response Procedures

### Initial Assessment (First 5 Minutes)

1. **Confirm the incident:**
   - What happened? (data loss, corruption, outage)
   - When was it first noticed?
   - What is the scope? (specific tables, entire database)
   - Is production impacted?

2. **Classify severity:**
   - Use the table above to determine P0/P1/P2/P3
   - P0/P1: Escalate immediately to on-call engineer
   - P2/P3: Follow standard recovery procedures

3. **Communicate:**
   - Notify team via Slack/Teams
   - Create incident ticket (GitHub issue)
   - Update status page if customer-facing

4. **Document:**
   - Start incident log (timestamp all actions)
   - Record current database state
   - Take screenshots if applicable

### Decision Tree

```
Data Loss Detected
    │
    ├─── Loss < 24 hours ago?
    │    ├─── YES → Use Neon PITR (Scenario 1)
    │    └─── NO  → Continue below
    │
    ├─── Loss 1-30 days ago?
    │    ├─── YES → Use external backup (Scenario 2)
    │    └─── NO  → Continue below
    │
    └─── Complete database corruption/loss?
         └─── YES → Full recovery (Scenario 3)
```

---

## Recovery Time Objectives

### RTO/RPO Targets

| Scenario | RTO (Recovery Time) | RPO (Data Loss) | Method |
|----------|---------------------|-----------------|--------|
| Scenario 1: PITR | 5 minutes | Minutes | Neon Point-in-Time Recovery |
| Scenario 2: External Backup | 15 minutes | 24 hours | pg_restore from GCS |
| Scenario 3: Full Recovery | 30 minutes | 24 hours | New branch + restore |

---

## Step-by-Step Recovery Procedures

### Scenario 1: Recent Data Loss (< 24 Hours) - PITR Recovery

**Use Case:** Accidental DELETE/DROP, bad migration, user error
**RTO:** 5 minutes | **RPO:** Minutes | **Severity:** P2

#### Prerequisites
- Neon Console access
- Data loss occurred within last 24 hours (Free Plan)

#### Recovery Steps

**Step 1: Identify exact timestamp (2 minutes)**

```bash
# Review application logs to identify when issue occurred
# Example: Check last known good state
psql "$NEON_DATABASE_URL" -c "
  SELECT MAX(created_at) FROM quiz_results;
"

# Note the timestamp just before data loss
# Example: 2026-01-24 10:30:00 UTC
```

**Step 2: Access Neon Console (1 minute)**

1. Navigate to: https://console.neon.tech
2. Select project: `lingo-keeper-jp`
3. Click on **Branches** tab
4. Select your main branch

**Step 3: Initiate Point-in-Time Recovery (2 minutes)**

1. Click **Restore** button (top right)
2. Select **Point in Time**
3. Enter timestamp: `2026-01-24T10:30:00Z`
4. Choose restoration method:
   - **Option A (No downtime):** Restore to new branch
   - **Option B (Faster):** Restore to current branch (requires downtime)

**Recommended:** Use Option A for production

5. Click **Restore** button

**Step 4: Verify restored data (2 minutes)**

```bash
# Get connection string for new branch
export RESTORED_DB_URL="<new-branch-connection-string>"

# Verify data is present
psql "$RESTORED_DB_URL" -c "
  SELECT COUNT(*) FROM stories;
  SELECT COUNT(*) FROM quizzes;
  SELECT COUNT(*) FROM quiz_results;
"

# Compare with production
psql "$NEON_DATABASE_URL" -c "
  SELECT COUNT(*) FROM stories;
"
```

**Step 5: Switch to restored branch (1 minute)**

If verification passes:

```bash
# Update environment variables in Vercel
vercel env rm DATABASE_URL production
vercel env add DATABASE_URL production
# Paste new connection string

# Update Cloud Run
gcloud run services update lingo-keeper-jp-backend \
  --update-env-vars DATABASE_URL="$RESTORED_DB_URL" \
  --region asia-northeast1

# Redeploy (optional, Cloud Run will pick up new env var)
```

**Step 6: Verify application functionality (1 minute)**

```bash
# Test health endpoint
curl https://lingo-keeper-jp-backend-*.run.app/api/health

# Test frontend
curl https://frontend-*.vercel.app/

# Manual verification: Open app in browser
```

**Total Time:** ~5-8 minutes
**Downtime:** 0 minutes (Option A) or 2-3 minutes (Option B)

---

### Scenario 2: Older Data Loss (1-30 Days) - External Backup Recovery

**Use Case:** Data loss beyond PITR window, need older backup
**RTO:** 15 minutes | **RPO:** 24 hours | **Severity:** P1

#### Prerequisites
- gcloud CLI authenticated
- Access to GCS bucket: `gs://lingo-keeper-jp-backups`
- `restore-database.sh` script

#### Recovery Steps

**Step 1: Identify target backup (2 minutes)**

```bash
# List available backups
gsutil ls -l gs://lingo-keeper-jp-backups/backup-*.dump | sort -k2

# Download backup from specific date
# Example: Restore data from 2026-01-20
BACKUP_FILE="backup-20260120-030000.dump"

gsutil cp "gs://lingo-keeper-jp-backups/$BACKUP_FILE" ./
```

**Step 2: Validate backup integrity (1 minute)**

```bash
# Verify backup is not corrupted
./scripts/verify-backup.sh "$BACKUP_FILE"

# Expected output: "✓ BACKUP VERIFICATION PASSED"
```

**Step 3: Create test branch for verification (2 minutes)**

```bash
# Create test branch in Neon
neonctl branches create --name restore-test-$(date +%Y%m%d)

# Get connection string
export TEST_DB_URL=$(neonctl connection-string restore-test-$(date +%Y%m%d))
```

**Step 4: Restore to test branch (3 minutes)**

```bash
# Set environment variable
export NEON_DATABASE_URL_TEST="$TEST_DB_URL"

# Execute restore
./scripts/restore-database.sh "$BACKUP_FILE" test

# Expected output: "DATABASE RESTORE COMPLETED SUCCESSFULLY"
```

**Step 5: Verify restored data (2 minutes)**

```bash
# Check table counts
psql "$TEST_DB_URL" -c "
  SELECT
    'stories' AS table_name, COUNT(*) FROM stories
    UNION ALL SELECT 'chapters', COUNT(*) FROM chapters
    UNION ALL SELECT 'quizzes', COUNT(*) FROM quizzes
    UNION ALL SELECT 'quiz_results', COUNT(*) FROM quiz_results;
"

# Verify specific data that was lost
psql "$TEST_DB_URL" -c "
  SELECT * FROM stories WHERE story_id = 'specific-story-id' LIMIT 1;
"
```

**Step 6: If verified, restore to production (5 minutes)**

**⚠️ WARNING: This will DELETE all current production data!**

```bash
# Set production database URL
export NEON_DATABASE_URL_PROD="$NEON_DATABASE_URL"

# Execute production restore (requires confirmation)
./scripts/restore-database.sh "$BACKUP_FILE" prod

# Type 'YES' when prompted

# Expected output: "DATABASE RESTORE COMPLETED SUCCESSFULLY"
```

**Step 7: Update application and verify (2 minutes)**

```bash
# Application should automatically reconnect
# Test health endpoint
curl https://lingo-keeper-jp-backend-*.run.app/api/health

# Test data retrieval
curl https://lingo-keeper-jp-backend-*.run.app/api/stories | jq length

# Manual verification in browser
```

**Total Time:** ~15-17 minutes
**Downtime:** ~5-7 minutes (during Step 6)

---

### Scenario 3: Complete Database Loss/Corruption - Full Recovery

**Use Case:** Neon outage, complete data corruption, catastrophic failure
**RTO:** 30 minutes | **RPO:** 24 hours | **Severity:** P0

#### Prerequisites
- Access to latest backup (GCS or GitHub Artifacts)
- Neon Console access or ability to create new database
- All environment variable access (Vercel, Cloud Run)

#### Recovery Steps

**Step 1: Assess the situation (5 minutes)**

```bash
# Check Neon status page
curl https://status.neon.tech

# Attempt database connection
psql "$NEON_DATABASE_URL" -c "SELECT 1;" || echo "Connection failed"

# Check if data is corrupted or completely unavailable
psql "$NEON_DATABASE_URL" -c "SELECT COUNT(*) FROM stories;" || echo "Query failed"
```

**Step 2: Download latest backup (3 minutes)**

```bash
# Option A: From GCS (recommended)
gsutil ls -l gs://lingo-keeper-jp-backups/backup-*.dump | sort -k2 | tail -1

# Download latest
gsutil cp gs://lingo-keeper-jp-backups/backup-20260123-030000.dump ./latest-backup.dump

# Option B: From GitHub Artifacts (if GCS unavailable)
# Go to: https://github.com/[REPO]/actions
# Download latest backup artifact
```

**Step 3: Validate backup (2 minutes)**

```bash
# Verify backup integrity
./scripts/verify-backup.sh latest-backup.dump

# Check backup date and size
ls -lh latest-backup.dump
pg_restore --list latest-backup.dump | head -20
```

**Step 4: Create new Neon branch (3 minutes)**

```bash
# Option A: Create recovery branch (if main branch accessible)
neonctl branches create --name recovery-$(date +%Y%m%d)

# Option B: If Neon main branch is completely lost
# Contact Neon support immediately: support@neon.tech
# Meanwhile, provision temporary PostgreSQL:
#   - Cloud SQL (Google Cloud)
#   - RDS (AWS)
#   - Heroku Postgres
```

**Step 5: Restore to new branch (7 minutes)**

```bash
# Get new connection string
export NEW_DB_URL=$(neonctl connection-string recovery-$(date +%Y%m%d))

# Restore backup
pg_restore \
  --verbose \
  --clean \
  --if-exists \
  --no-owner \
  --no-acl \
  --single-transaction \
  --dbname="$NEW_DB_URL" \
  latest-backup.dump

# Expected output: "COPY 1234" (rows copied for each table)
```

**Step 6: Verify restoration (3 minutes)**

```bash
# Check table counts
psql "$NEW_DB_URL" -c "
  SELECT schemaname || '.' || tablename AS table_name,
         n_live_tup AS row_count
  FROM pg_stat_user_tables
  ORDER BY n_live_tup DESC;
"

# Verify foreign key constraints
psql "$NEW_DB_URL" -c "
  SELECT COUNT(*) FROM information_schema.table_constraints
  WHERE constraint_type = 'FOREIGN KEY';
"

# Verify indexes
psql "$NEW_DB_URL" -c "
  SELECT COUNT(*) FROM pg_indexes WHERE schemaname = 'public';
"
```

**Step 7: Update application configuration (5 minutes)**

```bash
# Update Vercel (Frontend)
vercel env rm VITE_API_URL production  # No change needed if backend URL same
vercel env ls production

# Update Cloud Run (Backend)
gcloud run services update lingo-keeper-jp-backend \
  --update-env-vars DATABASE_URL="$NEW_DB_URL" \
  --region asia-northeast1

# Alternative: Update via Google Cloud Console
# Secret Manager → DATABASE_URL → New version → $NEW_DB_URL
```

**Step 8: Deploy and test (5 minutes)**

```bash
# Backend should auto-restart with new env var
# Wait 30 seconds for deployment

# Test backend health
curl https://lingo-keeper-jp-backend-*.run.app/api/health
# Expected: {"status":"healthy","database":"connected"}

# Test data retrieval
curl https://lingo-keeper-jp-backend-*.run.app/api/stories

# Test frontend
open https://frontend-*.vercel.app

# Manual verification:
# 1. Load story list
# 2. Select a story
# 3. Complete a quiz
# 4. Check results are saved
```

**Step 9: Monitor and document (2 minutes)**

```bash
# Monitor application logs
gcloud run services logs read lingo-keeper-jp-backend --region asia-northeast1 --limit 50

# Monitor error rate
# Check Vercel logs for frontend errors

# Document incident
# Create post-incident report (see section below)
```

**Total Time:** ~30-35 minutes
**Downtime:** ~10-15 minutes (during Steps 7-8)

---

## Verification Checklist

After any recovery, verify ALL of the following:

### Database Integrity

```bash
# ✓ All tables exist
psql "$DATABASE_URL" -c "\dt" | grep -E "stories|chapters|quizzes"

# ✓ Row counts are reasonable
psql "$DATABASE_URL" -c "
  SELECT 'stories', COUNT(*) FROM stories UNION ALL
  SELECT 'chapters', COUNT(*) FROM chapters UNION ALL
  SELECT 'quizzes', COUNT(*) FROM quizzes;
"

# ✓ Foreign key constraints intact
psql "$DATABASE_URL" -c "
  SELECT COUNT(*) FROM information_schema.table_constraints
  WHERE constraint_type = 'FOREIGN KEY';
"

# ✓ Indexes rebuilt
psql "$DATABASE_URL" -c "
  SELECT tablename, indexname FROM pg_indexes
  WHERE schemaname = 'public';
"

# ✓ Sequences are correct
psql "$DATABASE_URL" -c "
  SELECT sequence_name, last_value FROM information_schema.sequences;
"
```

### Application Functionality

- [ ] Backend health endpoint returns 200 OK
- [ ] Frontend loads without errors
- [ ] Story list displays correctly
- [ ] Individual stories load with chapters
- [ ] Quiz questions display
- [ ] Quiz answers can be submitted
- [ ] Results are saved and displayed
- [ ] User progress is tracked
- [ ] Audio playback works (TTS)
- [ ] No console errors in browser

### Performance

- [ ] API response time < 500ms
- [ ] Database query time < 100ms
- [ ] Frontend page load < 2 seconds
- [ ] No N+1 query issues

### Monitoring

- [ ] Application logs show no errors
- [ ] Database connection pool is healthy
- [ ] No memory leaks detected
- [ ] CPU usage is normal

---

## Post-Incident Review

### Immediate Actions (Within 1 Hour)

1. **Document the incident:**
   - Create GitHub issue with label `incident`
   - Record timeline of events
   - Document root cause
   - List recovery steps taken

2. **Communicate resolution:**
   - Notify team that incident is resolved
   - Update status page if applicable
   - Send summary to stakeholders

3. **Create backups:**
   - Immediately create manual backup of recovered database
   - Store in multiple locations (GCS + local)

### Post-Incident Report Template

```markdown
# Incident Report: [Title]

**Date:** YYYY-MM-DD
**Severity:** P0 / P1 / P2 / P3
**Duration:** XX minutes
**Impact:** Production / Staging / Test

## Summary
[Brief description of what happened]

## Timeline
- HH:MM - Incident detected
- HH:MM - Team notified
- HH:MM - Root cause identified
- HH:MM - Recovery initiated
- HH:MM - Service restored
- HH:MM - Verification completed

## Root Cause
[What caused the incident]

## Impact
- Users affected: XX
- Data loss: [None / XX records / XX GB]
- Downtime: XX minutes
- Financial impact: $XX (estimated)

## Recovery Actions
1. [Step 1]
2. [Step 2]
...

## What Went Well
- [Positive aspects]

## What Went Wrong
- [Areas for improvement]

## Action Items
- [ ] [Action 1] - Owner: [Name] - Due: [Date]
- [ ] [Action 2] - Owner: [Name] - Due: [Date]

## Lessons Learned
[Key takeaways]

## Follow-up
- Next review date: [Date]
- Post-mortem scheduled: [Date/Time]
```

### Follow-up Actions (Within 1 Week)

1. **Conduct post-mortem:**
   - Schedule team meeting (1 hour)
   - Review incident timeline
   - Identify improvement areas
   - Create action items with owners

2. **Update documentation:**
   - Update this playbook with lessons learned
   - Improve runbooks based on experience
   - Add new troubleshooting steps

3. **Improve monitoring:**
   - Add alerts for identified gaps
   - Improve detection time
   - Reduce false positives

4. **Test recovery procedures:**
   - Schedule disaster recovery drill
   - Test all scenarios
   - Document actual vs. expected RTO

---

## Common Issues and Troubleshooting

### Issue: Cannot connect to Neon database

**Symptoms:**
```
psql: error: connection failed: timeout
```

**Diagnosis:**
```bash
# Check Neon status
curl https://status.neon.tech

# Test DNS resolution
nslookup [neon-hostname]

# Test network connectivity
ping [neon-hostname]

# Check firewall rules
curl -v telnet://[neon-hostname]:5432
```

**Solutions:**
1. Check Neon status page for outages
2. Verify IP whitelist in Neon Console
3. Check local firewall/VPN settings
4. Try alternative connection string (e.g., pooler)

---

### Issue: Restore fails with "duplicate key value"

**Symptoms:**
```
ERROR:  duplicate key value violates unique constraint
```

**Solutions:**
```bash
# Solution 1: Use --clean flag (drops existing objects first)
pg_restore --clean --if-exists --dbname="$DB_URL" backup.dump

# Solution 2: Manually drop conflicting constraints
psql "$DB_URL" -c "
  ALTER TABLE stories DROP CONSTRAINT IF EXISTS stories_pkey CASCADE;
"

# Solution 3: Restore to empty database
# Create new branch and restore there
```

---

### Issue: Backup file is corrupted

**Symptoms:**
```
pg_restore: error: unrecognized file header
```

**Solutions:**
1. Download backup again (network corruption)
2. Try previous day's backup
3. Use Neon PITR if within 24 hours
4. Contact Neon support for branch restore

---

### Issue: Restore is taking too long

**Symptoms:**
- Restore runs for > 30 minutes
- Process appears hung

**Solutions:**
```bash
# Use parallel restore (4 jobs)
pg_restore -j 4 --dbname="$DB_URL" backup.dump

# Monitor progress
ps aux | grep pg_restore

# Check database logs
psql "$DB_URL" -c "
  SELECT pid, query, state, wait_event_type
  FROM pg_stat_activity
  WHERE query LIKE '%pg_restore%';
"
```

---

## Testing and Validation

### Monthly Disaster Recovery Drill

**Schedule:** Last Friday of each month
**Duration:** 30 minutes
**Participants:** Database Admin, DevOps Engineer

**Procedure:**
1. Download latest production backup
2. Restore to test environment
3. Verify data integrity
4. Measure actual RTO
5. Document any issues
6. Update playbook if needed

**Success Criteria:**
- [ ] Restore completes successfully
- [ ] RTO < 15 minutes
- [ ] All data verified
- [ ] Zero data loss
- [ ] Application fully functional

---

## Appendix: Command Reference

### Quick Recovery Commands

```bash
# List available backups
gsutil ls -l gs://lingo-keeper-jp-backups/backup-*.dump | sort -k2

# Download latest backup
gsutil ls -l gs://lingo-keeper-jp-backups/backup-*.dump | \
  sort -k2 | tail -1 | awk '{print $3}' | \
  xargs gsutil cp - ./latest-backup.dump

# Validate backup
pg_restore --list latest-backup.dump > /dev/null 2>&1 && echo "✓ Valid"

# Restore to test
./scripts/restore-database.sh latest-backup.dump test

# Restore to production (requires confirmation)
./scripts/restore-database.sh latest-backup.dump prod

# Create new Neon branch
neonctl branches create --name recovery-$(date +%Y%m%d)

# Get connection string
neonctl connection-string recovery-$(date +%Y%m%d)
```

---

## Document Metadata

**Version:** 1.0
**Created:** 2026-01-24
**Last Updated:** 2026-01-24
**Next Review:** 2026-02-24
**Owner:** DevOps Team
**Status:** Active

---

## Change Log

| Date | Version | Changes | Author |
|------|---------|---------|--------|
| 2026-01-24 | 1.0 | Initial playbook created | DevOps Team |

---

**This is a living document. Update after every incident and quarterly reviews.**
