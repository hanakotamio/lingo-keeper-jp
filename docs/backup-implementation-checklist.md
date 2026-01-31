# Neon PostgreSQL Backup Implementation Checklist

**Project:** Lingo Keeper JP
**Date Created:** 2026-01-24
**Status:** In Progress

---

## Phase 1: Immediate Setup (This Week)

### 1.1 Documentation Review
- [x] Review full backup strategy document
- [x] Review quick reference guide
- [x] Understand RPO/RTO objectives
- [ ] Share documentation with team members

### 1.2 Google Cloud Storage Setup
- [ ] Run GCS bucket setup script:
  ```bash
  ./scripts/setup-gcs-backup-bucket.sh
  ```
- [ ] Verify bucket created: `gs://lingo-keeper-jp-backups`
- [ ] Confirm lifecycle policy (30-day auto-deletion)
- [ ] Verify encryption enabled
- [ ] Check uniform bucket-level access enabled

### 1.3 Service Account Setup
- [ ] Create GitHub Actions service account:
  ```bash
  gcloud iam service-accounts create github-actions-backup \
    --display-name="GitHub Actions Backup Service Account" \
    --project=lingo-keeper-jp
  ```

- [ ] Grant storage permissions:
  ```bash
  gsutil iam ch \
    serviceAccount:github-actions-backup@lingo-keeper-jp.iam.gserviceaccount.com:roles/storage.objectAdmin \
    gs://lingo-keeper-jp-backups
  ```

- [ ] Create service account key:
  ```bash
  gcloud iam service-accounts keys create github-sa-key.json \
    --iam-account=github-actions-backup@lingo-keeper-jp.iam.gserviceaccount.com
  ```

### 1.4 GitHub Secrets Configuration
- [ ] Add `NEON_DATABASE_URL` secret:
  - Go to: Repository → Settings → Secrets and variables → Actions
  - Click: "New repository secret"
  - Name: `NEON_DATABASE_URL`
  - Value: Full Neon connection string (get from Neon Console)

- [ ] Add `GCP_SERVICE_ACCOUNT_KEY` secret:
  - Name: `GCP_SERVICE_ACCOUNT_KEY`
  - Value: Entire contents of `github-sa-key.json` file

- [ ] Add `GCS_BACKUP_BUCKET` secret (optional):
  - Name: `GCS_BACKUP_BUCKET`
  - Value: `lingo-keeper-jp-backups`

- [ ] Delete local service account key file:
  ```bash
  rm github-sa-key.json  # Important for security!
  ```

### 1.5 GitHub Actions Workflow Verification
- [ ] Verify workflow file exists: `.github/workflows/neon-backup.yml`
- [ ] Commit and push workflow to main branch
- [ ] Check workflow appears in GitHub Actions tab
- [ ] Verify workflow has proper permissions

### 1.6 First Manual Backup Test
- [ ] Trigger manual backup via GitHub Actions:
  - Go to: Actions → Neon PostgreSQL Automated Backup → Run workflow
  - Click: "Run workflow" button

- [ ] Monitor workflow execution (should take 2-5 minutes)

- [ ] Verify backup created successfully:
  - Check GitHub Actions run completed ✅
  - Download artifact from workflow run
  - Check GCS: `gsutil ls gs://lingo-keeper-jp-backups/`

- [ ] Validate backup file:
  ```bash
  pg_restore --list backup-[DATE].dump > /dev/null 2>&1 && echo "✅ Valid"
  ```

- [ ] Document backup file size and object count

---

## Phase 2: Testing & Validation (Week 2)

### 2.1 Test Environment Setup
- [ ] Create test Neon branch:
  ```bash
  neonctl branches create --name backup-test
  ```

- [ ] Get test connection string:
  ```bash
  neonctl connection-string backup-test
  ```

- [ ] Set environment variable:
  ```bash
  export NEON_DATABASE_URL_TEST="[test-connection-string]"
  ```

### 2.2 Restore Testing
- [ ] Download latest backup from GCS:
  ```bash
  gsutil cp gs://lingo-keeper-jp-backups/backup-[DATE].dump ./
  ```

- [ ] Test restore script:
  ```bash
  chmod +x scripts/restore-database.sh
  ./scripts/restore-database.sh backup-[DATE].dump test
  ```

- [ ] Verify restoration completed successfully

- [ ] Check data integrity:
  ```bash
  psql "$NEON_DATABASE_URL_TEST" -c "
    SELECT 'stories' AS table_name, COUNT(*) FROM stories
    UNION ALL SELECT 'chapters', COUNT(*) FROM chapters
    UNION ALL SELECT 'quizzes', COUNT(*) FROM quizzes
    UNION ALL SELECT 'quiz_choices', COUNT(*) FROM quiz_choices;
  "
  ```

- [ ] Compare row counts with production database

- [ ] Test application connectivity to restored database

- [ ] Document restore time (target: < 15 minutes)

### 2.3 Neon PITR Testing
- [ ] Access Neon Console: https://console.neon.tech
- [ ] Navigate to Backups tab
- [ ] Verify PITR history window (should show 24 hours for Free Plan)
- [ ] Test Time Travel Assist feature (read-only queries)
- [ ] Create test PITR restore to new branch
- [ ] Verify restored data
- [ ] Delete test branch after verification

### 2.4 Snapshot Configuration
- [ ] Enable manual snapshots in Neon Console
- [ ] Create first manual snapshot:
  - Name: `manual-snapshot-$(date +%Y%m%d)`
  - Note expiration date

- [ ] Document snapshot creation process
- [ ] Test snapshot restore (to test branch)
- [ ] Set reminder to delete snapshot before expiration

### 2.5 Backup Validation Automation
- [ ] Verify GitHub Actions workflow includes validation step
- [ ] Test backup validation failure scenario (corrupt file)
- [ ] Confirm workflow fails if backup is invalid
- [ ] Test artifact upload and download

---

## Phase 3: Monitoring & Alerts (Week 3)

### 3.1 Monitoring Setup
- [ ] Create monitoring dashboard (Grafana/Datadog/custom)
- [ ] Add metrics:
  - Backup success/failure count
  - Backup file size over time
  - Backup duration
  - GCS storage usage
  - Last successful backup timestamp

### 3.2 Alert Configuration
- [ ] Set up Slack webhook (optional):
  - Create Slack app
  - Generate incoming webhook URL
  - Add to GitHub Secrets as `SLACK_WEBHOOK_URL`
  - Uncomment Slack notification steps in workflow

- [ ] Set up email notifications:
  - Configure GitHub Actions email notifications
  - Test failure notification

- [ ] Configure PagerDuty integration (optional for production)

### 3.3 Scheduled Backup Verification
- [ ] Verify cron schedule is correct (3:00 AM UTC = 12:00 PM JST)
- [ ] Wait for first automated backup to run
- [ ] Verify automated backup completed successfully
- [ ] Check backup appears in GCS
- [ ] Download and validate automated backup

### 3.4 Weekly Check Automation
- [ ] Create weekly check script:
  ```bash
  scripts/weekly-backup-health-check.sh
  ```
- [ ] Schedule weekly check (e.g., every Monday)
- [ ] Verify checks run successfully
- [ ] Document results

---

## Phase 4: Documentation & Training (Week 4)

### 4.1 Runbook Creation
- [ ] Create detailed runbook for disaster recovery
- [ ] Include step-by-step procedures for each scenario
- [ ] Add screenshots from Neon Console
- [ ] Add common troubleshooting steps
- [ ] Review runbook with team

### 4.2 Team Training
- [ ] Schedule backup/restore training session
- [ ] Demo Neon PITR in Neon Console
- [ ] Demo manual backup trigger via GitHub Actions
- [ ] Demo restore process (to test environment)
- [ ] Practice disaster recovery drill
- [ ] Assign on-call rotation for backup monitoring

### 4.3 Access Control Review
- [ ] Audit who has access to:
  - Neon Console (production database)
  - GCS backup bucket
  - GitHub repository secrets
  - Service account keys

- [ ] Implement principle of least privilege
- [ ] Document access control policy
- [ ] Set up quarterly access review

### 4.4 Compliance & Security
- [ ] Review data retention policy (GDPR/CCPA)
- [ ] Implement automated backup deletion after 30 days
- [ ] Enable audit logging for GCS bucket
- [ ] Review backup encryption settings
- [ ] Document compliance requirements
- [ ] Schedule quarterly security review

---

## Phase 5: Production Hardening (Month 2)

### 5.1 Multi-Region Strategy (Optional)
- [ ] Evaluate need for multi-region backups
- [ ] Create GCS bucket in secondary region
- [ ] Update workflow to upload to both regions
- [ ] Test cross-region restore
- [ ] Document multi-region procedures

### 5.2 Backup Retention Optimization
- [ ] Review actual backup usage patterns
- [ ] Adjust retention period if needed
- [ ] Implement tiered retention:
  - Daily backups: 7 days
  - Weekly backups: 30 days
  - Monthly backups: 90 days (optional)

- [ ] Update lifecycle policy in GCS
- [ ] Update workflow to tag backups by type

### 5.3 Performance Optimization
- [ ] Measure backup duration
- [ ] Optimize backup compression level if needed
- [ ] Consider incremental backups (if database grows large)
- [ ] Evaluate pg_basebackup vs pg_dump for large databases
- [ ] Test parallel restore with `--jobs` flag

### 5.4 Disaster Recovery Drill
- [ ] Schedule full disaster recovery simulation
- [ ] Simulate complete database loss
- [ ] Practice full recovery procedure
- [ ] Measure actual RTO (target: 30 minutes)
- [ ] Document lessons learned
- [ ] Update procedures based on findings

### 5.5 Cost Review
- [ ] Review actual GCS storage costs
- [ ] Review GitHub Actions minutes usage
- [ ] Evaluate Neon plan (Free vs Launch vs Enterprise)
- [ ] Calculate total backup cost per month
- [ ] Optimize based on budget constraints

---

## Phase 6: Ongoing Maintenance (Monthly/Quarterly)

### 6.1 Monthly Tasks
- [ ] **Last Friday of each month:** Execute recovery drill
- [ ] Download latest backup and restore to test environment
- [ ] Verify all tables and data integrity
- [ ] Document restoration time
- [ ] Update disaster recovery documentation
- [ ] Review and cleanup old test branches
- [ ] Review GCS storage usage and costs
- [ ] Check for GitHub Actions workflow failures
- [ ] Verify Neon PITR is functioning

### 6.2 Quarterly Tasks
- [ ] Review and update backup strategy document
- [ ] Audit access controls and permissions
- [ ] Review security and encryption settings
- [ ] Evaluate backup retention policy
- [ ] Update cost estimates
- [ ] Review team training materials
- [ ] Conduct disaster recovery simulation
- [ ] Update contact information and on-call rotation

### 6.3 Annual Tasks
- [ ] Comprehensive backup strategy review
- [ ] Evaluate new Neon features
- [ ] Review competitive backup solutions
- [ ] Update compliance documentation
- [ ] Conduct full security audit
- [ ] Renew service account keys
- [ ] Review and update SLA/SLO objectives

---

## Success Criteria

### Immediate (Week 1)
- ✅ GCS bucket created and configured
- ✅ GitHub Actions workflow running successfully
- ✅ Daily automated backups executing
- ✅ Backups validated and stored in GCS

### Short-term (Month 1)
- ✅ Successful test restore completed
- ✅ Neon PITR tested and documented
- ✅ Team trained on backup/restore procedures
- ✅ Monitoring and alerts configured

### Long-term (Quarter 1)
- ✅ Monthly recovery drills established
- ✅ RTO < 30 minutes consistently achieved
- ✅ RPO < 24 hours maintained
- ✅ Zero data loss incidents
- ✅ Backup costs optimized and under budget

---

## Rollback Plan

If automated backup implementation fails or causes issues:

1. **Disable GitHub Actions workflow:**
   - Edit `.github/workflows/neon-backup.yml`
   - Comment out schedule trigger
   - Keep manual trigger available

2. **Continue using Neon PITR:**
   - Rely on Neon's built-in 24-hour PITR
   - Create manual snapshots weekly

3. **Manual backups:**
   - Run pg_dump manually on critical days:
   ```bash
   pg_dump -Fc -Z9 "$DATABASE_URL" > backup-manual-$(date +%Y%m%d).dump
   ```

4. **Document issues:**
   - Log all errors encountered
   - Report to team
   - Create GitHub issue for tracking
   - Revisit implementation after resolution

---

## Support & Escalation

### Level 1: Self-Service
- Review quick reference guide: `/docs/backup-quick-reference.md`
- Check GitHub Actions logs for errors
- Verify secrets are configured correctly
- Test database connectivity

### Level 2: Team Support
- Contact Database Admin: [Your Email]
- Post in Slack channel: #infrastructure
- Create GitHub issue with details

### Level 3: Vendor Support
- Neon Support: support@neon.tech (response time: 24 hours)
- Google Cloud Support: (if GCS issues)
- PostgreSQL Community: (for pg_dump/pg_restore issues)

### Emergency Escalation
- PagerDuty alert for production outages
- On-call engineer contact: [Phone/Slack]
- Escalation to CTO if data loss risk

---

## Completion Sign-off

**Phase 1 Completed By:** _________________ Date: _________

**Phase 2 Completed By:** _________________ Date: _________

**Phase 3 Completed By:** _________________ Date: _________

**Phase 4 Completed By:** _________________ Date: _________

**Phase 5 Completed By:** _________________ Date: _________

**Reviewed By:** _________________ Date: _________

**Approved By:** _________________ Date: _________

---

**Document Version:** 1.0
**Last Updated:** 2026-01-24
**Next Review:** 2026-02-24
