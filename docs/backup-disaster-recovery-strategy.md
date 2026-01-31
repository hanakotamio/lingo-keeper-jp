# Neon PostgreSQL Backup & Disaster Recovery Strategy

**Project:** Lingo Keeper JP
**Database:** Neon PostgreSQL (Serverless)
**Date:** 2026-01-24
**Version:** 1.0

---

## Executive Summary

This document outlines the comprehensive backup and disaster recovery strategy for the Lingo Keeper JP application using Neon PostgreSQL. The strategy combines Neon's native features with external backup solutions to achieve robust data protection.

### Key Metrics
- **RPO (Recovery Point Objective):** 24 hours (Free Plan) / 1 hour (with external backups)
- **RTO (Recovery Time Objective):** 15 minutes (with automated scripts)
- **Backup Retention:** 7 days (Free Plan PITR) / 30 days (external backups)

---

## 1. Neon Native Backup Features

### 1.1 Point-in-Time Recovery (PITR)

Neon provides automatic continuous backup through its built-in PITR feature.

#### Free Plan Capabilities
- **History Retention:** Up to 24 hours of restore history
- **Storage Limit:** 1 GB of data changes (whichever comes first)
- **Granularity:** LSN-level (Log Sequence Number) precision
- **Restore Time:** Seconds (instant restore)
- **Cost:** Free

#### Paid Plan Capabilities
- **Launch Plan:** 0-7 days retention ($0.20/GB-month)
- **Enterprise Plan:** Up to 30 days retention ($0.20/GB-month)
- **Automated:** No manual intervention required

#### How to Use PITR
1. Access Neon Console: https://console.neon.tech
2. Navigate to your project
3. Go to "Backups" tab
4. Select "Restore to Point in Time"
5. Choose specific timestamp (to the second)
6. Click "Restore"

**Current Status for Lingo Keeper JP:**
- ✅ Enabled by default on Free Plan
- ✅ 24-hour recovery window
- ⚠️ Limited to 1 GB of changes

---

### 1.2 Snapshots Feature (Beta)

Neon's Snapshots feature provides manual and automated snapshot creation.

#### Capabilities
- **Manual Snapshots:** Create on-demand snapshots of root branches
- **Automated Schedules:** Daily, weekly, or monthly snapshots
- **Snapshot Limits:** 1 on Free Plan / 10 on Paid Plans
- **Expiration:** Each snapshot shows expiration date
- **Cost:** Free during beta / GB-month storage after GA

#### Scheduling Automated Snapshots
```bash
# Via Neon API (requires API key)
curl -X POST \
  https://console.neon.tech/api/v2/projects/{project_id}/branches/{branch_id}/snapshots \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "daily-backup-$(date +%Y%m%d)",
    "schedule": "daily",
    "retention_days": 30
  }'
```

#### Restore from Snapshot
1. Navigate to project in Neon Console
2. Go to "Branches" tab
3. Select snapshot to restore
4. Click "Restore Snapshot"
5. Choose target branch (or create new)
6. Set `finalize_restore: true` for production

**Current Status for Lingo Keeper JP:**
- ⚠️ Not yet configured
- 📋 Recommendation: Enable daily snapshots for root branch

---

### 1.3 Database Branching

Neon's unique branching feature enables instant database copies.

#### Use Cases
- **Development/Staging:** Clone production data instantly
- **Testing:** Create isolated environments
- **Pre-deployment Testing:** Validate migrations safely
- **Disaster Recovery:** Quick failover to known-good state

#### Creating a Branch
```bash
# Via Neon CLI
neon branches create --name backup-$(date +%Y%m%d) --parent main

# Via API
curl -X POST \
  https://console.neon.tech/api/v2/projects/{project_id}/branches \
  -H "Authorization: Bearer $NEON_API_KEY" \
  -d '{
    "name": "backup-2026-01-24",
    "parent_id": "main"
  }'
```

#### Branch Management Best Practices
- Keep max 3-5 branches to avoid quota limits
- Delete old branches after 7 days
- Use naming convention: `backup-YYYYMMDD` or `staging-feature-X`

---

## 2. External Backup Solution (pg_dump)

While Neon provides excellent native features, external backups add an extra layer of protection for:
- Long-term retention (30+ days)
- Compliance requirements
- Multi-cloud redundancy
- Offline disaster recovery

### 2.1 Automated pg_dump via GitHub Actions

#### Advantages
- ✅ Free (within GitHub Actions limits)
- ✅ Encrypted storage in private repository
- ✅ Version-controlled backup scripts
- ✅ Email notifications on failure
- ✅ Easy manual triggering

#### Backup Schedule
- **Frequency:** Daily at 3:00 AM UTC (12:00 PM JST)
- **Retention:** 30 days (automated cleanup)
- **Format:** Custom compressed format (.dump)
- **Storage:** GitHub repository artifacts + Google Cloud Storage

---

### 2.2 Backup Script Components

#### GitHub Actions Workflow
See `.github/workflows/neon-backup.yml` (created separately)

Key Features:
- Runs on schedule (cron)
- Manual trigger via workflow_dispatch
- Installs PostgreSQL 16 client tools
- Executes pg_dump with optimal settings
- Uploads to GitHub Artifacts (90-day retention)
- Uploads to Google Cloud Storage (30-day retention)
- Sends Slack/email notification on failure

#### Backup Command
```bash
pg_dump \
  --format=custom \
  --compress=9 \
  --no-owner \
  --no-acl \
  --verbose \
  --file=backup-$(date +%Y%m%d-%H%M%S).dump \
  "$DATABASE_URL"
```

**Compression:** ~70-80% size reduction
**Encryption:** AES-256-GCM (Google Cloud Storage)
**Transfer:** TLS 1.3 encrypted connection

---

### 2.3 Google Cloud Storage Integration

#### Storage Bucket Setup
```bash
# Create backup bucket
gsutil mb -p lingo-keeper-jp -l asia-northeast1 gs://lingo-keeper-jp-backups

# Enable versioning
gsutil versioning set on gs://lingo-keeper-jp-backups

# Set lifecycle policy (delete after 30 days)
cat > lifecycle.json <<EOF
{
  "lifecycle": {
    "rule": [
      {
        "action": {"type": "Delete"},
        "condition": {"age": 30}
      }
    ]
  }
}
EOF
gsutil lifecycle set lifecycle.json gs://lingo-keeper-jp-backups

# Set encryption (customer-managed or Google-managed)
gsutil encryption set -k projects/lingo-keeper-jp/locations/global/keyRings/backup-keys/cryptoKeys/db-backup gs://lingo-keeper-jp-backups
```

#### Upload Automation
```bash
# Upload with metadata
gsutil -h "Content-Type:application/octet-stream" \
  -h "x-goog-meta-backup-date:$(date -Iseconds)" \
  -h "x-goog-meta-database:lingo_keeper_jp_dev" \
  cp backup-*.dump gs://lingo-keeper-jp-backups/
```

---

## 3. Disaster Recovery Procedures

### 3.1 Recovery Scenarios

#### Scenario 1: Recent Data Loss (< 24 hours)
**Use:** Neon PITR
**RPO:** Minutes
**RTO:** 2-5 minutes

**Steps:**
1. Log in to Neon Console
2. Navigate to Backups → Point-in-Time Recovery
3. Select timestamp before data loss
4. Click "Restore"
5. Verify data integrity
6. Update application connection string if needed

---

#### Scenario 2: Older Data Loss (24 hours - 30 days)
**Use:** External pg_dump backup
**RPO:** 24 hours (daily backup)
**RTO:** 10-15 minutes

**Steps:**
1. Download backup from Google Cloud Storage:
   ```bash
   gsutil cp gs://lingo-keeper-jp-backups/backup-20260120.dump ./
   ```

2. Verify backup integrity:
   ```bash
   pg_restore --list backup-20260120.dump | head -20
   ```

3. Create new Neon branch for testing:
   ```bash
   neon branches create --name restore-test-$(date +%Y%m%d)
   ```

4. Restore to test branch:
   ```bash
   pg_restore \
     --verbose \
     --clean \
     --no-owner \
     --no-acl \
     --dbname="$TEST_DATABASE_URL" \
     backup-20260120.dump
   ```

5. Verify data:
   ```bash
   psql "$TEST_DATABASE_URL" -c "SELECT COUNT(*) FROM stories;"
   psql "$TEST_DATABASE_URL" -c "SELECT COUNT(*) FROM chapters;"
   psql "$TEST_DATABASE_URL" -c "SELECT COUNT(*) FROM quizzes;"
   ```

6. If verified, restore to production:
   ```bash
   pg_restore \
     --verbose \
     --clean \
     --no-owner \
     --no-acl \
     --dbname="$PRODUCTION_DATABASE_URL" \
     backup-20260120.dump
   ```

---

#### Scenario 3: Complete Neon Service Outage
**Use:** Migration to new database provider
**RPO:** 24 hours
**RTO:** 2-4 hours

**Steps:**
1. Provision new PostgreSQL instance (Cloud SQL, RDS, etc.)
2. Download latest backup from GCS
3. Restore using pg_restore
4. Update DATABASE_URL in all environments
5. Deploy application with new connection string
6. Monitor application health

---

### 3.2 Recovery Testing Schedule

**Monthly Recovery Drill (Last Friday of each month):**
1. Download latest backup
2. Restore to test branch
3. Run validation queries
4. Document restoration time
5. Update this document with findings

**Test Checklist:**
- [ ] Backup file downloads successfully
- [ ] Backup file is not corrupted
- [ ] Restore completes without errors
- [ ] All tables are present
- [ ] Row counts match expected values
- [ ] Foreign key constraints are intact
- [ ] Indexes are rebuilt correctly
- [ ] Restoration time is within RTO

---

## 4. Backup Validation & Monitoring

### 4.1 Automated Validation

Every backup should be validated immediately after creation:

```bash
# Validate backup file integrity
pg_restore --list backup-20260124.dump > /dev/null 2>&1
if [ $? -eq 0 ]; then
  echo "✅ Backup validation successful"
else
  echo "❌ Backup validation failed"
  # Send alert to Slack/email
fi
```

### 4.2 Monitoring Checklist

**Daily Checks (Automated):**
- ✅ Backup job completed successfully
- ✅ Backup file size is reasonable (not 0 bytes)
- ✅ Backup uploaded to GCS
- ✅ GitHub Actions workflow passed

**Weekly Checks (Manual):**
- ✅ Neon PITR history window is active
- ✅ Snapshot quota not exceeded
- ✅ GCS storage costs within budget
- ✅ No backup failures in past 7 days

**Monthly Checks (Manual):**
- ✅ Complete test restore successful
- ✅ Review and update disaster recovery procedures
- ✅ Verify backup retention policies
- ✅ Audit access logs for GCS bucket

---

## 5. Security Considerations

### 5.1 Backup Encryption

**In Transit:**
- ✅ DATABASE_URL uses SSL/TLS (Neon enforces this)
- ✅ pg_dump connection encrypted via `sslmode=require`
- ✅ GCS upload via HTTPS

**At Rest:**
- ✅ GitHub Artifacts: AES-256 encryption (GitHub-managed)
- ✅ Google Cloud Storage: AES-256-GCM (Google-managed or CMEK)
- ✅ Neon storage: AES-256 encryption (Neon-managed)

### 5.2 Access Control

**Neon Database:**
- Restrict connection IPs if possible
- Use strong passwords (32+ characters)
- Rotate credentials quarterly
- Use read-only replicas for backups (if available)

**Google Cloud Storage:**
- Bucket-level IAM: Only allow GitHub Actions service account
- Object-level permissions: Private
- Enable uniform bucket-level access
- Audit logs enabled

**GitHub Secrets:**
- Never commit DATABASE_URL or credentials
- Use GitHub Secrets for sensitive values
- Rotate secrets every 90 days
- Enable secret scanning

### 5.3 Compliance

**Data Retention:**
- Backups contain personal data (quiz results, progress)
- Comply with GDPR/CCPA data retention policies
- Implement automated deletion after 30 days
- Document data handling in privacy policy

**Audit Trail:**
- Log all backup/restore operations
- Retain logs for 1 year
- Enable GCS access logging
- Review logs quarterly

---

## 6. Cost Analysis

### 6.1 Neon Costs

**Free Plan (Current):**
- PITR (24h): $0/month
- Snapshots (1): $0/month (beta)
- Storage (0.5 GB): $0/month

**If upgraded to Launch Plan:**
- PITR (7 days, ~2 GB): $0.40/month
- Snapshots (10): $0/month (beta) → ~$1-2/month after GA
- **Total:** ~$2-3/month

### 6.2 External Backup Costs

**GitHub Actions:**
- Workflow runs: Free (within public repo limits)
- Artifacts storage: Free (90-day retention)

**Google Cloud Storage:**
- Storage (30 days × 500 MB × 30 days = ~15 GB): $0.30/month
- Network egress (downloads): $0.12/GB (rare)
- Operations: Negligible
- **Total:** ~$0.30-0.50/month

### 6.3 Total Cost Estimate

**Current (Free Plan):** $0.30-0.50/month
**With Launch Plan:** $2.30-3.50/month
**With Enterprise Plan (30d PITR):** $6-10/month

**Recommendation:** Start with Free Plan + external backups ($0.50/month), upgrade to Launch if PITR > 24h needed.

---

## 7. Implementation Roadmap

### Phase 1: Immediate (This Week)
- [x] Document current backup capabilities
- [ ] Create GitHub Actions backup workflow
- [ ] Set up GCS bucket with lifecycle policy
- [ ] Test initial backup and restore
- [ ] Add DATABASE_URL to GitHub Secrets

### Phase 2: Short-term (Next 2 Weeks)
- [ ] Enable Neon snapshot scheduling (daily)
- [ ] Implement backup validation checks
- [ ] Set up Slack/email notifications
- [ ] Document restore procedures
- [ ] Perform first monthly recovery drill

### Phase 3: Mid-term (Next Month)
- [ ] Evaluate upgrade to Neon Launch Plan
- [ ] Implement automated restore testing
- [ ] Set up monitoring dashboard (Grafana/Datadog)
- [ ] Create runbook for on-call engineers
- [ ] Review and optimize backup costs

### Phase 4: Long-term (Quarterly)
- [ ] Conduct disaster recovery simulation
- [ ] Review and update RPO/RTO objectives
- [ ] Audit security and compliance
- [ ] Optimize backup retention policies
- [ ] Evaluate multi-region replication

---

## 8. Key Contacts & Resources

### Documentation
- Neon Backups: https://neon.com/docs/manage/backups
- Neon PITR: https://neon.com/docs/introduction/branch-restore
- Neon Snapshots: https://neon.com/docs/ai/ai-database-versioning
- PostgreSQL pg_dump: https://www.postgresql.org/docs/16/app-pgdump.html

### Support
- Neon Support: support@neon.tech
- Neon Console: https://console.neon.tech
- GitHub Actions Docs: https://docs.github.com/en/actions

### Emergency Contacts
- Database Admin: [Your Email]
- DevOps Lead: [Your Email]
- On-call Engineer: [PagerDuty/Slack]

---

## 9. Changelog

| Date       | Version | Changes                                      | Author |
|------------|---------|----------------------------------------------|--------|
| 2026-01-24 | 1.0     | Initial backup and disaster recovery strategy | Claude |

---

## Appendix A: Quick Reference Commands

### Backup Commands
```bash
# Manual backup
pg_dump -Fc -Z9 "$DATABASE_URL" > backup-$(date +%Y%m%d).dump

# List backup contents
pg_restore --list backup-20260124.dump

# Validate backup
pg_restore --list backup-20260124.dump > /dev/null 2>&1 && echo "Valid"
```

### Restore Commands
```bash
# Restore to new database
pg_restore -d "$NEW_DATABASE_URL" backup-20260124.dump

# Restore specific tables only
pg_restore -t stories -t chapters -d "$DATABASE_URL" backup.dump

# Restore with transaction rollback on error
pg_restore --single-transaction -d "$DATABASE_URL" backup.dump
```

### Neon CLI Commands
```bash
# Install Neon CLI
npm install -g neonctl

# List branches
neonctl branches list

# Create backup branch
neonctl branches create --name backup-$(date +%Y%m%d)

# Delete old branches
neonctl branches delete backup-20260101
```

### GCS Commands
```bash
# List backups
gsutil ls gs://lingo-keeper-jp-backups/

# Download backup
gsutil cp gs://lingo-keeper-jp-backups/backup-20260124.dump ./

# Delete old backups (manual)
gsutil rm gs://lingo-keeper-jp-backups/backup-20251224.dump
```

---

**Document Status:** ✅ Active
**Next Review Date:** 2026-02-24
**Owner:** DevOps Team
