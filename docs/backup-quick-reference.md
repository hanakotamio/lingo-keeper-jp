# Neon PostgreSQL Backup - Quick Reference Guide

**Last Updated:** 2026-01-24

---

## Quick Command Reference

### Manual Backup
```bash
# Create manual backup
pg_dump -Fc -Z9 "$DATABASE_URL" > backup-$(date +%Y%m%d).dump

# With verbose output
pg_dump -Fc -Z9 -v "$DATABASE_URL" > backup-$(date +%Y%m%d).dump
```

### Manual Restore
```bash
# Restore to test environment
./scripts/restore-database.sh backup-20260124.dump test

# Restore to production (requires confirmation)
./scripts/restore-database.sh backup-20260124.dump prod
```

### Neon Point-in-Time Recovery (PITR)
```bash
# Via Neon Console (recommended)
1. Go to https://console.neon.tech
2. Select project → Backups → Point-in-Time Recovery
3. Choose timestamp
4. Click "Restore"

# Via Neon CLI
neonctl branches create --name restore-$(date +%Y%m%d) --timestamp "2026-01-24T12:00:00Z"
```

### Neon Snapshots
```bash
# Create manual snapshot (Neon Console only)
1. Go to Neon Console → Branches
2. Select branch → Create Snapshot
3. Name: backup-YYYYMMDD

# Restore from snapshot
1. Neon Console → Branches → Snapshots
2. Select snapshot → Restore
```

### Google Cloud Storage Operations
```bash
# List backups
gsutil ls gs://lingo-keeper-jp-backups/

# Download specific backup
gsutil cp gs://lingo-keeper-jp-backups/backup-20260124-030000.dump ./

# Download latest backup
gsutil ls -l gs://lingo-keeper-jp-backups/backup-*.dump | sort -k2 | tail -1 | awk '{print $3}' | xargs gsutil cp - ./

# Check backup metadata
gsutil ls -L gs://lingo-keeper-jp-backups/backup-20260124-030000.dump

# Delete old backup (manual)
gsutil rm gs://lingo-keeper-jp-backups/backup-20251224.dump
```

### Validation Commands
```bash
# Validate backup integrity
pg_restore --list backup-20260124.dump > /dev/null 2>&1 && echo "✅ Valid" || echo "❌ Invalid"

# Count objects in backup
pg_restore --list backup-20260124.dump | wc -l

# Show backup contents
pg_restore --list backup-20260124.dump | head -20

# Check backup file size
du -h backup-20260124.dump
```

### Database Information
```bash
# Get table row counts
psql "$DATABASE_URL" -c "
SELECT
  'stories: ' || COUNT(*) FROM stories
  UNION ALL SELECT 'chapters: ' || COUNT(*) FROM chapters
  UNION ALL SELECT 'quizzes: ' || COUNT(*) FROM quizzes;
"

# Get database size
psql "$DATABASE_URL" -c "
SELECT pg_size_pretty(pg_database_size(current_database()));
"

# List all tables
psql "$DATABASE_URL" -c "\dt"

# Check for foreign key constraints
psql "$DATABASE_URL" -c "
SELECT COUNT(*) FROM information_schema.table_constraints
WHERE constraint_type = 'FOREIGN KEY';
"
```

---

## Emergency Recovery Procedures

### Scenario 1: Data Loss < 24 Hours Ago
**Recovery Method:** Neon PITR (Point-in-Time Recovery)
**Estimated Time:** 5 minutes

1. Access Neon Console: https://console.neon.tech
2. Navigate to Backups tab
3. Click "Point-in-Time Recovery"
4. Select timestamp before data loss
5. Click "Restore"
6. Verify data in application

**No downtime required** - Restore to new branch, test, then switch connection string

---

### Scenario 2: Data Loss 1-30 Days Ago
**Recovery Method:** External pg_dump backup
**Estimated Time:** 15 minutes

```bash
# 1. Download backup from GCS
gsutil cp gs://lingo-keeper-jp-backups/backup-YYYYMMDD-HHMMSS.dump ./

# 2. Validate backup
pg_restore --list backup-YYYYMMDD-HHMMSS.dump > /dev/null 2>&1

# 3. Restore to test environment first
./scripts/restore-database.sh backup-YYYYMMDD-HHMMSS.dump test

# 4. Verify data
psql "$NEON_DATABASE_URL_TEST" -c "SELECT COUNT(*) FROM stories;"

# 5. If verified, restore to production
./scripts/restore-database.sh backup-YYYYMMDD-HHMMSS.dump prod
```

**Downtime:** 5-10 minutes (during final restore step)

---

### Scenario 3: Complete Database Corruption
**Recovery Method:** Full database rebuild
**Estimated Time:** 30 minutes

```bash
# 1. Create new Neon branch
neonctl branches create --name recovery-$(date +%Y%m%d)

# 2. Get new connection string
export NEW_DATABASE_URL=$(neonctl connection-string recovery-$(date +%Y%m%d))

# 3. Download latest backup
gsutil ls -l gs://lingo-keeper-jp-backups/backup-*.dump | sort -k2 | tail -1 | awk '{print $3}' | xargs gsutil cp - ./latest-backup.dump

# 4. Restore to new branch
pg_restore --clean --if-exists --no-owner --no-acl -d "$NEW_DATABASE_URL" latest-backup.dump

# 5. Verify data integrity
psql "$NEW_DATABASE_URL" -c "
  SELECT 'stories' AS table_name, COUNT(*) FROM stories
  UNION ALL SELECT 'chapters', COUNT(*) FROM chapters
  UNION ALL SELECT 'quizzes', COUNT(*) FROM quizzes;
"

# 6. Update application to use new connection string
# Update Vercel environment variable: VITE_API_URL
# Update Cloud Run environment variable: DATABASE_URL

# 7. Deploy application
vercel --prod  # Frontend
gcloud run deploy lingo-keeper-jp-backend --update-env-vars DATABASE_URL="$NEW_DATABASE_URL"  # Backend
```

---

## Backup Schedule & Retention

### Automated Backups (GitHub Actions)
- **Frequency:** Daily at 3:00 AM UTC (12:00 PM JST)
- **Method:** pg_dump (custom format, compression level 9)
- **Storage:**
  - GitHub Artifacts: 90 days
  - Google Cloud Storage: 30 days (auto-deleted)
- **Manual Trigger:** Available via GitHub Actions UI

### Neon Native Backups
- **PITR (Point-in-Time Recovery):** 24 hours (Free Plan)
- **Snapshots:** Manual creation, 1 snapshot on Free Plan
- **Retention:** Configurable per snapshot

---

## GitHub Actions Backup Workflow

### Manual Trigger
1. Go to: https://github.com/[YOUR_REPO]/actions/workflows/neon-backup.yml
2. Click "Run workflow"
3. Optionally provide custom backup name
4. Click green "Run workflow" button

### View Backup Results
1. Go to Actions tab
2. Click on latest "Neon PostgreSQL Automated Backup" run
3. Download artifacts:
   - Backup file (.dump)
   - Backup report (.txt)

### Check Backup Status
```bash
# Using GitHub CLI (gh)
gh run list --workflow=neon-backup.yml --limit 5

# View latest run
gh run view --log

# Download artifact
gh run download [RUN_ID]
```

---

## Environment Variables Required

### For GitHub Actions
Add these secrets in GitHub repository settings (Settings → Secrets and variables → Actions):

```
NEON_DATABASE_URL          # Full Neon connection string (postgres://...)
GCP_SERVICE_ACCOUNT_KEY    # JSON key for GCS access
GCS_BACKUP_BUCKET          # Bucket name (e.g., lingo-keeper-jp-backups)
```

### For Local Restore Script
Set these in your shell environment:

```bash
export NEON_DATABASE_URL_TEST="postgres://user:pass@host/db-test"
export NEON_DATABASE_URL_PROD="postgres://user:pass@host/db-prod"
```

---

## Monitoring & Alerts

### Daily Checks (Automated)
- ✅ GitHub Actions workflow completed successfully
- ✅ Backup uploaded to GCS
- ✅ Backup validation passed
- ✅ Backup size is reasonable (not 0 bytes)

### Weekly Checks (Manual)
- Check GitHub Actions history for failures
- Verify GCS storage usage
- Review Neon PITR status in console
- Check for any database performance issues

### Monthly Recovery Drill
**Last Friday of each month:**
1. Download latest backup
2. Restore to test environment
3. Verify all tables present
4. Check row counts match expectations
5. Document restoration time
6. Update disaster recovery documentation

**Test Checklist:**
```bash
# 1. Download latest backup
gsutil ls -l gs://lingo-keeper-jp-backups/backup-*.dump | sort -k2 | tail -1

# 2. Restore to test
./scripts/restore-database.sh [backup_file] test

# 3. Verify tables
psql "$NEON_DATABASE_URL_TEST" -c "\dt"

# 4. Check row counts
psql "$NEON_DATABASE_URL_TEST" -c "
  SELECT schemaname || '.' || tablename AS table_name,
         n_live_tup AS row_count
  FROM pg_stat_user_tables
  ORDER BY n_live_tup DESC;
"

# 5. Test application connectivity
curl https://[frontend-url]/api/health
```

---

## Troubleshooting

### Backup Fails with "Permission Denied"
**Solution:** Check DATABASE_URL has correct password and IP is whitelisted in Neon

### GCS Upload Fails
**Solution:** Verify GCP_SERVICE_ACCOUNT_KEY secret is valid:
```bash
echo "$GCP_SERVICE_ACCOUNT_KEY" | gcloud auth activate-service-account --key-file=-
```

### Restore Takes Too Long
**Solution:** Use `--jobs` flag for parallel restore:
```bash
pg_restore -j 4 --dbname="$DATABASE_URL" backup.dump
```

### Backup File Corrupted
**Solutions:**
1. Try downloading again from GCS (network issue)
2. Use Neon PITR if within 24 hours
3. Use previous day's backup
4. Check GitHub Actions logs for errors during backup creation

### Connection String Changes After Restore
**Solution:** Neon may change connection string for new branches. Always:
1. Get new connection string: `neonctl connection-string [branch-name]`
2. Update environment variables in Vercel and Cloud Run
3. Redeploy application

---

## Cost Optimization Tips

1. **Disable PITR for dev databases** (not needed for non-production)
2. **Reduce GCS retention** if 30 days not required (edit lifecycle policy)
3. **Use GitHub Artifacts only** for short-term backups (free, 90 days)
4. **Compress backups** (already using `-Z9` max compression)
5. **Delete old snapshots** in Neon Console manually if not using auto-deletion

---

## Support & Resources

### Documentation
- Full Strategy: `/docs/backup-disaster-recovery-strategy.md`
- Neon Docs: https://neon.com/docs
- PostgreSQL Backup: https://www.postgresql.org/docs/16/backup.html

### Scripts
- Restore Script: `/scripts/restore-database.sh`
- GCS Setup: `/scripts/setup-gcs-backup-bucket.sh`
- Backup Workflow: `/.github/workflows/neon-backup.yml`

### Emergency Contacts
- Database Admin: [Your Email]
- On-call: [PagerDuty/Slack Channel]
- Neon Support: support@neon.tech

---

## Quick Decision Tree

**Do you need to recover data?**

→ **Yes, lost data < 24 hours ago**
  - Use Neon PITR (5 min, no downtime)

→ **Yes, lost data 1-30 days ago**
  - Use external backup from GCS (15 min, minimal downtime)

→ **Yes, complete database corruption**
  - Create new branch + restore latest backup (30 min)

→ **No, just testing backup/restore**
  - Restore to test environment first

→ **No, setting up automated backups**
  - Run GCS setup script → Add GitHub secrets → Enable workflow

---

**Document Version:** 1.0
**Last Tested:** 2026-01-24
**Next Review:** 2026-02-24
