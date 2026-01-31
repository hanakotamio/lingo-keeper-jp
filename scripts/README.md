# Backup & Database Scripts

This directory contains scripts for managing Neon PostgreSQL database backups, restoration, and disaster recovery.

## Table of Contents

- [Scripts Overview](#scripts-overview)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Script Usage](#script-usage)
- [Automation](#automation)
- [Troubleshooting](#troubleshooting)

---

## Scripts Overview

| Script | Purpose | Frequency | Automation |
|--------|---------|-----------|------------|
| `backup-database.sh` | Create manual database backups | On-demand | Manual |
| `restore-database.sh` | Restore database from backup | On-demand | Manual |
| `verify-backup.sh` | Validate backup file integrity | After each backup | Automated |
| `weekly-backup-health-check.sh` | Comprehensive backup system health check | Weekly | Cron/GitHub Actions |
| `setup-gcs-backup-bucket.sh` | Initial GCS bucket setup | Once | Manual |
| `db-migrate-check.sh` | Pre-migration safety checks | Before migrations | Manual/CI |
| `db-migrate-prod.sh` | Production database migration deployment | On-demand | Manual |

---

## Prerequisites

### Required Tools

```bash
# PostgreSQL client tools (version 16 recommended)
sudo apt-get install postgresql-client-16

# Google Cloud SDK (for GCS operations)
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
gcloud init

# GitHub CLI (optional, for workflow monitoring)
brew install gh  # macOS
sudo apt install gh  # Ubuntu
```

### Environment Variables

Create a `.env` file or export these variables:

```bash
# Required for all scripts
export NEON_DATABASE_URL="postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require"

# Required for GCS operations
export GCS_BACKUP_BUCKET="lingo-keeper-jp-backups"
export GOOGLE_CLOUD_PROJECT_ID="lingo-keeper-jp"

# Optional: for restore script
export NEON_DATABASE_URL_TEST="postgresql://user:pass@ep-test.us-east-2.aws.neon.tech/dbname"
export NEON_DATABASE_URL_PROD="postgresql://user:pass@ep-prod.us-east-2.aws.neon.tech/dbname"
```

### Verify Installation

```bash
# Check PostgreSQL client
pg_dump --version
pg_restore --version

# Check Google Cloud SDK
gcloud --version
gsutil --version

# Check GitHub CLI (optional)
gh --version
```

---

## Quick Start

### 1. Initial Setup

```bash
# Navigate to scripts directory
cd /home/hanakotamio0705/Lingo\ Keeper\ JP/scripts

# Make all scripts executable (already done)
chmod +x *.sh

# Set up GCS bucket (one-time setup)
./setup-gcs-backup-bucket.sh
```

### 2. Create Your First Backup

```bash
# Manual backup (local only)
./backup-database.sh

# Manual backup with upload to GCS
./backup-database.sh --upload
```

### 3. Verify Backup

```bash
# Verify the backup file
./verify-backup.sh backup-YYYYMMDD-HHMMSS.dump
```

### 4. Test Restore (to test environment)

```bash
# Restore to test database
./restore-database.sh backup-YYYYMMDD-HHMMSS.dump test
```

---

## Script Usage

### backup-database.sh

**Purpose:** Create a manual backup of the Neon PostgreSQL database

**Usage:**
```bash
./backup-database.sh [OPTIONS]

Options:
  -n, --name NAME       Custom backup name (default: backup-YYYYMMDD-HHMMSS)
  -u, --upload          Upload backup to Google Cloud Storage
  -c, --compress LEVEL  Compression level 0-9 (default: 9)
  -h, --help            Show help message
```

**Examples:**
```bash
# Basic backup (local only)
./backup-database.sh

# Custom named backup
./backup-database.sh --name pre-migration-backup

# Backup and upload to GCS
./backup-database.sh --upload

# Emergency backup with upload
./backup-database.sh --name emergency-20260124 --upload

# Low compression for faster backup
./backup-database.sh --compress 5
```

**Output:**
- Creates `backup-YYYYMMDD-HHMMSS.dump` in current directory
- Optionally uploads to `gs://lingo-keeper-jp-backups/`
- Validates backup integrity automatically

---

### restore-database.sh

**Purpose:** Restore a database from a backup file

**Usage:**
```bash
./restore-database.sh <backup_file> <target_environment>

Arguments:
  backup_file          Path to backup file (e.g., backup-20260124.dump)
  target_environment   Target environment (test|prod)
```

**Examples:**
```bash
# Restore to test environment
./restore-database.sh backup-20260124.dump test

# Restore to production (requires confirmation)
./restore-database.sh backup-20260124.dump production

# Restore from GCS-downloaded backup
gsutil cp gs://lingo-keeper-jp-backups/backup-20260120.dump ./
./restore-database.sh backup-20260120.dump test
```

**Safety Features:**
- Creates pre-restore snapshot automatically
- Requires typing 'YES' for production restores
- Shows table counts before and after restore
- Validates backup before starting
- Generates detailed log file

---

### verify-backup.sh

**Purpose:** Validate backup file integrity and contents

**Usage:**
```bash
./verify-backup.sh <backup_file>
```

**Examples:**
```bash
# Verify local backup
./verify-backup.sh backup-20260124.dump

# Verify downloaded GCS backup
gsutil cp gs://lingo-keeper-jp-backups/backup-20260120.dump ./
./verify-backup.sh backup-20260120.dump
```

**Checks Performed:**
- File exists and is not empty
- File format is valid (PostgreSQL custom format)
- File is not corrupted
- Contains expected database objects
- Expected tables are present (stories, chapters, quizzes, etc.)
- Calculates SHA256 checksum
- Performs test restore (dry-run)

**Output:**
- Detailed verification report
- Pass/fail status for each check
- Log file: `verify-backup-YYYYMMDD-HHMMSS.log`

---

### weekly-backup-health-check.sh

**Purpose:** Comprehensive health check of backup system

**Usage:**
```bash
./weekly-backup-health-check.sh
```

**Checks Performed:**
- Prerequisites (tools installed)
- GCS bucket status and configuration
- Backup file count and age
- Latest backup size and integrity
- GitHub Actions workflow status
- Database connectivity and health
- Storage costs estimation
- Validates latest backup

**Output:**
- Detailed health report
- Summary with pass/fail counts
- Recommendations for improvements
- Report file: `backup-health-report-YYYYMMDD.txt`
- Log file: `health-check-YYYYMMDD-HHMMSS.log`

**Schedule (Recommended):**
```bash
# Add to crontab for weekly execution
crontab -e

# Run every Monday at 9:00 AM
0 9 * * 1 /path/to/scripts/weekly-backup-health-check.sh
```

---

### setup-gcs-backup-bucket.sh

**Purpose:** Initial setup of Google Cloud Storage bucket for backups

**Usage:**
```bash
./setup-gcs-backup-bucket.sh
```

**What It Does:**
- Creates GCS bucket in asia-northeast1
- Enables versioning
- Sets lifecycle policy (30-day auto-deletion)
- Configures uniform bucket-level access
- Sets default encryption (Google-managed)
- Creates logging bucket
- Adds labels for organization
- Tests bucket access

**Run Once:** This script only needs to be run once during initial setup

**Post-Setup Instructions:**
- Creates service account for GitHub Actions
- Generates service account key
- Provides instructions for GitHub Secrets

---

## Automation

### GitHub Actions (Automated Daily Backups)

The repository includes a GitHub Actions workflow that automatically:
- Runs daily at 3:00 AM UTC (12:00 PM JST)
- Creates backup using `pg_dump`
- Validates backup integrity
- Uploads to GitHub Artifacts (90-day retention)
- Uploads to Google Cloud Storage (30-day retention)
- Cleans up old backups
- Sends notifications on failure (optional)

**Workflow File:** `.github/workflows/neon-backup.yml`

**Manual Trigger:**
1. Go to GitHub → Actions tab
2. Select "Neon PostgreSQL Automated Backup"
3. Click "Run workflow"
4. Optionally provide custom backup name

### Cron Jobs (Weekly Health Check)

Set up weekly health check:

```bash
# Edit crontab
crontab -e

# Add this line (runs every Monday at 9:00 AM)
0 9 * * 1 cd /home/hanakotamio0705/Lingo\ Keeper\ JP/scripts && ./weekly-backup-health-check.sh >> /var/log/backup-health.log 2>&1
```

### Monthly Recovery Drill

Schedule a monthly disaster recovery drill:

```bash
# Last Friday of each month at 2:00 PM
0 14 28-31 * 5 [ $(date +\%d) -ge 25 ] && cd /home/hanakotamio0705/Lingo\ Keeper\ JP/scripts && ./monthly-recovery-drill.sh
```

---

## Troubleshooting

### Common Issues

#### 1. "pg_dump: command not found"

**Solution:**
```bash
# Install PostgreSQL client tools
# Ubuntu/Debian
sudo apt-get install postgresql-client-16

# macOS
brew install postgresql@16
```

---

#### 2. "gsutil: command not found"

**Solution:**
```bash
# Install Google Cloud SDK
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
gcloud init
```

---

#### 3. "Permission denied" when accessing GCS

**Solution:**
```bash
# Authenticate with Google Cloud
gcloud auth login

# Or use service account
gcloud auth activate-service-account --key-file=service-account-key.json
```

---

#### 4. "NEON_DATABASE_URL is not set"

**Solution:**
```bash
# Get connection string from Neon Console
# https://console.neon.tech → Select Project → Connection Details

# Set environment variable
export NEON_DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"

# Or add to ~/.bashrc or ~/.zshrc
echo 'export NEON_DATABASE_URL="postgresql://..."' >> ~/.bashrc
source ~/.bashrc
```

---

#### 5. Backup validation fails

**Solutions:**
```bash
# Option 1: Download backup again (may be network corruption)
gsutil cp gs://lingo-keeper-jp-backups/backup-20260124.dump ./

# Option 2: Try previous day's backup
gsutil ls gs://lingo-keeper-jp-backups/backup-*.dump

# Option 3: Use Neon PITR if within 24 hours
# Access Neon Console → Backups → Point-in-Time Recovery
```

---

#### 6. Restore is too slow

**Solution:**
```bash
# Use parallel restore (4 concurrent jobs)
pg_restore -j 4 --dbname="$DATABASE_URL" backup.dump

# Or edit restore-database.sh and add -j flag
```

---

## Database Migration Scripts

### db-migrate-check.sh

**Purpose:** Pre-migration verification script that checks database and environment safety before applying migrations.

**Usage:**

```bash
./db-migrate-check.sh [environment]

Arguments:
  environment   Target environment (development|staging|production)
                Default: development
```

**Examples:**

```bash
# Check development environment
./db-migrate-check.sh

# Check production before migration
./db-migrate-check.sh production
```

**What it checks:**
- Database connectivity
- Migration status and pending migrations
- Schema drift detection
- Migration file validation
- Disk space availability
- Backup availability (staging/production)
- Application health (staging/production)
- Long-running database queries (staging/production)

**Output:**
- Colored terminal output with status indicators
- Detailed log file in `logs/migration-check-TIMESTAMP.log`
- Checklist for production migrations

---

### db-migrate-prod.sh

**Purpose:** Production database migration deployment script with automated backup and verification.

**Usage:**

```bash
./db-migrate-prod.sh [--skip-backup] [--auto-approve]

Flags:
  --skip-backup     Skip automatic backup creation (NOT recommended)
  --auto-approve    Skip confirmation prompts (use in CI/CD only)
```

**Examples:**

```bash
# Interactive production migration (recommended)
./db-migrate-prod.sh

# Skip backup (not recommended)
./db-migrate-prod.sh --skip-backup

# Automated (CI/CD only)
./db-migrate-prod.sh --auto-approve
```

**What it does:**

1. **Confirmation**: Prompts for user confirmation (unless `--auto-approve`)
2. **Pre-checks**: Runs `db-migrate-check.sh` with production settings
3. **Backup**: Creates Neon branch snapshot (unless `--skip-backup`)
4. **Migration**: Applies pending Prisma migrations using `prisma migrate deploy`
5. **Verification**: Checks migration status and application health
6. **Logging**: Saves detailed logs and provides rollback instructions

**Safety Features:**
- Multiple confirmation prompts for production
- Automated Neon branch backup before migration
- Post-migration health verification
- Detailed logging for audit trail
- Rollback instructions provided on failure

**Output:**
- Step-by-step progress with colored indicators
- Backup name and rollback instructions
- Detailed log file in `logs/migration-prod-TIMESTAMP.log`

**Rollback:**

If migration fails, the script provides rollback commands:

```bash
# Restore from Neon branch backup
neonctl branches restore --branch pre-migration-TIMESTAMP
```

---

## Best Practices

### 1. Regular Testing
- Run `verify-backup.sh` after every backup
- Perform monthly restore drills to test environment
- Document restore time (target: < 15 minutes)

### 2. Multiple Storage Locations
- Keep backups in GCS (primary)
- Keep backups in GitHub Artifacts (secondary)
- Download critical backups to local storage

### 3. Backup Naming
- Use consistent naming: `backup-YYYYMMDD-HHMMSS.dump`
- Add descriptive names for important backups:
  - `pre-migration-20260124.dump`
  - `before-schema-change-20260124.dump`

### 4. Retention Policy
- Daily backups: 7 days (minimum)
- Weekly backups: 30 days
- Monthly backups: 90 days (optional)
- Keep critical backups indefinitely (e.g., before major releases)

### 5. Security
- Never commit `DATABASE_URL` to git
- Use environment variables or secret management
- Rotate database passwords quarterly
- Use read-only replicas for backups (if available)
- Encrypt backups at rest (GCS does this automatically)

### 6. Monitoring
- Monitor GitHub Actions for backup failures
- Check weekly health reports
- Set up alerts for backup age > 48 hours
- Review backup costs monthly

---

## Additional Resources

### Documentation
- [Backup Strategy](/docs/backup-disaster-recovery-strategy.md)
- [Quick Reference Guide](/docs/backup-quick-reference.md)
- [Disaster Recovery Playbook](/docs/disaster-recovery-playbook.md)
- [Implementation Checklist](/docs/backup-implementation-checklist.md)

### External Links
- [Neon Backups Documentation](https://neon.com/docs/manage/backups)
- [PostgreSQL pg_dump](https://www.postgresql.org/docs/16/app-pgdump.html)
- [PostgreSQL pg_restore](https://www.postgresql.org/docs/16/app-pgrestore.html)
- [Google Cloud Storage Lifecycle](https://cloud.google.com/storage/docs/lifecycle)

### Support
- Database Admin: [Your Email]
- Neon Support: support@neon.tech
- Emergency Contact: [On-call Engineer]

---

## License

These scripts are part of the Lingo Keeper JP project. Internal use only.

---

**Last Updated:** 2026-01-24
**Maintained By:** DevOps Team
