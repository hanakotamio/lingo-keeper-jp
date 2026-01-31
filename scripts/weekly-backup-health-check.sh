#!/bin/bash

################################################################################
# Weekly Backup Health Check Script
#
# This script performs a comprehensive health check of the backup system,
# including GitHub Actions workflow status, GCS storage, backup files,
# and Neon database health.
#
# Usage:
#   ./weekly-backup-health-check.sh
#
# Schedule (crontab):
#   0 9 * * 1 /path/to/weekly-backup-health-check.sh
#   (Runs every Monday at 9:00 AM)
#
# Prerequisites:
#   - gcloud CLI installed and authenticated
#   - gh CLI installed (GitHub CLI) - optional
#   - PostgreSQL client tools installed
#   - Environment variables: NEON_DATABASE_URL
#
# Author: DevOps Team
# Date: 2026-01-24
################################################################################

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
HEALTH_CHECK_LOG="health-check-$(date +%Y%m%d-%H%M%S).log"
REPORT_FILE="backup-health-report-$(date +%Y%m%d).txt"

# Settings
GCS_BUCKET="${GCS_BACKUP_BUCKET:-lingo-keeper-jp-backups}"
EXPECTED_DAILY_BACKUPS=7  # Expect at least 7 daily backups
MIN_BACKUP_SIZE_KB=10     # Minimum expected backup size (10 KB)
MAX_DAYS_SINCE_BACKUP=2   # Alert if last backup is older than 2 days

################################################################################
# Helper Functions
################################################################################

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1" | tee -a "$HEALTH_CHECK_LOG"
}

log_success() {
    echo -e "${GREEN}[✓ PASS]${NC} $1" | tee -a "$HEALTH_CHECK_LOG"
}

log_warning() {
    echo -e "${YELLOW}[⚠ WARN]${NC} $1" | tee -a "$HEALTH_CHECK_LOG"
}

log_error() {
    echo -e "${RED}[✗ FAIL]${NC} $1" | tee -a "$HEALTH_CHECK_LOG"
}

log_section() {
    echo -e "${CYAN}═══ $1 ═══${NC}" | tee -a "$HEALTH_CHECK_LOG"
}

print_separator() {
    echo "───────────────────────────────────────────────────────────" | tee -a "$HEALTH_CHECK_LOG"
}

################################################################################
# Health Check Functions
################################################################################

check_prerequisites() {
    log_section "Checking Prerequisites"
    local all_ok=true

    # Check gcloud CLI
    if command -v gcloud &> /dev/null; then
        log_success "gcloud CLI installed: $(gcloud --version | head -1)"
    else
        log_warning "gcloud CLI not installed (GCS checks will be skipped)"
        all_ok=false
    fi

    # Check gh CLI (optional)
    if command -v gh &> /dev/null; then
        log_success "GitHub CLI installed: $(gh --version | head -1)"
    else
        log_warning "GitHub CLI not installed (workflow checks will be limited)"
    fi

    # Check PostgreSQL client
    if command -v pg_restore &> /dev/null; then
        log_success "PostgreSQL client installed: $(pg_restore --version | head -1)"
    else
        log_error "PostgreSQL client not installed (backup validation will fail)"
        all_ok=false
    fi

    # Check database connectivity
    if [ -n "${NEON_DATABASE_URL:-}" ]; then
        log_success "NEON_DATABASE_URL is set"
    else
        log_warning "NEON_DATABASE_URL not set (database checks will be skipped)"
    fi

    if [ "$all_ok" = true ]; then
        log_success "All critical prerequisites met"
        return 0
    else
        log_warning "Some prerequisites missing (see warnings above)"
        return 1
    fi
}

check_gcs_bucket() {
    log_section "Checking Google Cloud Storage Bucket"

    if ! command -v gsutil &> /dev/null; then
        log_warning "gsutil not available, skipping GCS checks"
        return 1
    fi

    # Check if bucket exists
    if gsutil ls -b "gs://${GCS_BUCKET}" &> /dev/null; then
        log_success "GCS bucket exists: gs://${GCS_BUCKET}"
    else
        log_error "GCS bucket not found: gs://${GCS_BUCKET}"
        return 1
    fi

    # Check bucket versioning
    local versioning=$(gsutil versioning get "gs://${GCS_BUCKET}" 2>&1 | grep -o "Enabled\|Suspended" || echo "Unknown")
    if [ "$versioning" = "Enabled" ]; then
        log_success "Bucket versioning: Enabled"
    else
        log_warning "Bucket versioning: $versioning"
    fi

    # Check lifecycle policy
    if gsutil lifecycle get "gs://${GCS_BUCKET}" &> /dev/null; then
        log_success "Lifecycle policy is configured"
    else
        log_warning "Lifecycle policy not found"
    fi

    return 0
}

check_backup_files() {
    log_section "Checking Backup Files in GCS"

    if ! command -v gsutil &> /dev/null; then
        log_warning "gsutil not available, skipping backup file checks"
        return 1
    fi

    # List backup files
    local backup_count=$(gsutil ls "gs://${GCS_BUCKET}/backup-*.dump" 2>/dev/null | wc -l || echo "0")

    if [ "$backup_count" -eq 0 ]; then
        log_error "No backup files found in GCS bucket"
        return 1
    fi

    log_info "Found $backup_count backup file(s) in GCS"

    if [ "$backup_count" -lt "$EXPECTED_DAILY_BACKUPS" ]; then
        log_warning "Expected at least $EXPECTED_DAILY_BACKUPS backups, found only $backup_count"
    else
        log_success "Sufficient backup files found ($backup_count >= $EXPECTED_DAILY_BACKUPS)"
    fi

    # Get latest backup
    local latest_backup=$(gsutil ls -l "gs://${GCS_BUCKET}/backup-*.dump" 2>/dev/null | sort -k2 | tail -2 | head -1)

    if [ -n "$latest_backup" ]; then
        local backup_size=$(echo "$latest_backup" | awk '{print $1}')
        local backup_date=$(echo "$latest_backup" | awk '{print $2}')
        local backup_name=$(echo "$latest_backup" | awk '{print $3}')

        log_info "Latest backup:"
        log_info "  • Name: $(basename "$backup_name")"
        log_info "  • Size: $(numfmt --to=iec-i --suffix=B "$backup_size" 2>/dev/null || echo "$backup_size bytes")"
        log_info "  • Date: $backup_date"

        # Check if backup size is reasonable
        local size_kb=$((backup_size / 1024))
        if [ "$size_kb" -lt "$MIN_BACKUP_SIZE_KB" ]; then
            log_error "Latest backup size is too small ($size_kb KB < $MIN_BACKUP_SIZE_KB KB)"
        else
            log_success "Latest backup size is reasonable: $size_kb KB"
        fi

        # Check backup age
        local backup_timestamp=$(echo "$backup_date" | cut -d'T' -f1)
        local current_timestamp=$(date +%Y-%m-%d)
        local days_diff=$(( ( $(date -d "$current_timestamp" +%s) - $(date -d "$backup_timestamp" +%s) ) / 86400 ))

        if [ "$days_diff" -gt "$MAX_DAYS_SINCE_BACKUP" ]; then
            log_error "Latest backup is $days_diff days old (threshold: $MAX_DAYS_SINCE_BACKUP days)"
        else
            log_success "Latest backup is recent ($days_diff days old)"
        fi
    else
        log_error "Could not retrieve latest backup information"
        return 1
    fi

    return 0
}

check_github_actions_workflow() {
    log_section "Checking GitHub Actions Workflow"

    # Check if workflow file exists
    local workflow_file="$PROJECT_ROOT/.github/workflows/neon-backup.yml"

    if [ -f "$workflow_file" ]; then
        log_success "Workflow file exists: .github/workflows/neon-backup.yml"
    else
        log_error "Workflow file not found: $workflow_file"
        return 1
    fi

    # Check workflow syntax (basic YAML validation)
    if grep -q "name: Neon PostgreSQL Automated Backup" "$workflow_file"; then
        log_success "Workflow file appears valid"
    else
        log_warning "Workflow file may have incorrect format"
    fi

    # Check if gh CLI is available for detailed workflow checks
    if command -v gh &> /dev/null; then
        # Check recent workflow runs
        log_info "Checking recent workflow runs..."

        if gh run list --workflow=neon-backup.yml --limit 5 --json conclusion,createdAt,status 2>/dev/null | grep -q "success"; then
            log_success "Recent workflow runs found"

            # Get latest run status
            local latest_status=$(gh run list --workflow=neon-backup.yml --limit 1 --json conclusion --jq '.[0].conclusion' 2>/dev/null || echo "unknown")

            if [ "$latest_status" = "success" ]; then
                log_success "Latest workflow run: SUCCESS"
            elif [ "$latest_status" = "failure" ]; then
                log_error "Latest workflow run: FAILED"
            else
                log_warning "Latest workflow run status: $latest_status"
            fi
        else
            log_warning "Could not retrieve workflow run history (check GitHub authentication)"
        fi
    else
        log_warning "GitHub CLI not available, skipping detailed workflow checks"
    fi

    return 0
}

check_database_health() {
    log_section "Checking Neon Database Health"

    if [ -z "${NEON_DATABASE_URL:-}" ]; then
        log_warning "NEON_DATABASE_URL not set, skipping database checks"
        return 1
    fi

    # Test database connectivity
    log_info "Testing database connection..."

    if psql "$NEON_DATABASE_URL" -c "SELECT 1;" &> /dev/null; then
        log_success "Database connection successful"
    else
        log_error "Failed to connect to database"
        return 1
    fi

    # Get database size
    local db_size=$(psql "$NEON_DATABASE_URL" -t -c "SELECT pg_size_pretty(pg_database_size(current_database()));" 2>/dev/null | xargs || echo "unknown")
    log_info "Database size: $db_size"

    # Get table counts
    log_info "Checking table row counts..."

    local table_info=$(psql "$NEON_DATABASE_URL" -t -c "
        SELECT
            'stories: ' || COUNT(*) FROM stories
        UNION ALL SELECT 'chapters: ' || COUNT(*) FROM chapters
        UNION ALL SELECT 'quizzes: ' || COUNT(*) FROM quizzes
        UNION ALL SELECT 'quiz_choices: ' || COUNT(*) FROM quiz_choices
        UNION ALL SELECT 'quiz_results: ' || COUNT(*) FROM quiz_results;
    " 2>/dev/null | xargs)

    if [ -n "$table_info" ]; then
        echo "$table_info" | while read -r line; do
            log_info "  • $line"
        done
        log_success "Database tables are accessible"
    else
        log_warning "Could not retrieve table counts"
    fi

    # Check for recent activity
    log_info "Checking for recent database activity..."

    local recent_results=$(psql "$NEON_DATABASE_URL" -t -c "
        SELECT COUNT(*) FROM quiz_results
        WHERE created_at > NOW() - INTERVAL '7 days';
    " 2>/dev/null | xargs || echo "0")

    log_info "Quiz results in last 7 days: $recent_results"

    return 0
}

check_storage_costs() {
    log_section "Estimating Storage Costs"

    if ! command -v gsutil &> /dev/null; then
        log_warning "gsutil not available, skipping cost estimation"
        return 1
    fi

    # Calculate total storage used
    local total_bytes=$(gsutil du -s "gs://${GCS_BUCKET}" 2>/dev/null | awk '{print $1}' || echo "0")
    local total_gb=$(echo "scale=2; $total_bytes / 1024 / 1024 / 1024" | bc 2>/dev/null || echo "0")

    log_info "Total GCS storage used: ${total_gb} GB"

    # Estimate monthly cost (Standard Storage in asia-northeast1: $0.020/GB/month)
    local estimated_cost=$(echo "scale=2; $total_gb * 0.020" | bc 2>/dev/null || echo "0")

    log_info "Estimated monthly storage cost: \$${estimated_cost}"

    if (( $(echo "$total_gb > 50" | bc -l 2>/dev/null || echo "0") )); then
        log_warning "Storage usage is high (> 50 GB), consider reviewing retention policy"
    else
        log_success "Storage usage is within reasonable limits"
    fi

    return 0
}

validate_latest_backup() {
    log_section "Validating Latest Backup"

    if ! command -v gsutil &> /dev/null || ! command -v pg_restore &> /dev/null; then
        log_warning "Required tools not available, skipping backup validation"
        return 1
    fi

    # Download latest backup
    log_info "Downloading latest backup for validation..."

    local latest_backup=$(gsutil ls -l "gs://${GCS_BUCKET}/backup-*.dump" 2>/dev/null | sort -k2 | tail -2 | head -1 | awk '{print $3}')

    if [ -z "$latest_backup" ]; then
        log_error "Could not identify latest backup file"
        return 1
    fi

    local temp_backup="/tmp/latest-backup-validation-$$.dump"

    if gsutil cp "$latest_backup" "$temp_backup" &> /dev/null; then
        log_success "Downloaded latest backup: $(basename "$latest_backup")"
    else
        log_error "Failed to download latest backup"
        return 1
    fi

    # Validate backup
    log_info "Validating backup integrity..."

    if pg_restore --list "$temp_backup" > /dev/null 2>&1; then
        local object_count=$(pg_restore --list "$temp_backup" | wc -l)
        log_success "Backup validation passed ($object_count objects)"
    else
        log_error "Backup validation failed (corrupted file)"
        rm -f "$temp_backup"
        return 1
    fi

    # Cleanup
    rm -f "$temp_backup"

    return 0
}

################################################################################
# Report Generation
################################################################################

generate_report() {
    local pass_count=$1
    local fail_count=$2
    local warn_count=$3

    log_section "Generating Health Check Report"

    cat > "$REPORT_FILE" <<EOF
═══════════════════════════════════════════════════════════
LINGO KEEPER JP - WEEKLY BACKUP HEALTH CHECK REPORT
═══════════════════════════════════════════════════════════

Generated: $(date)
Log File: $HEALTH_CHECK_LOG

SUMMARY
───────────────────────────────────────────────────────────
✓ Passed Checks: $pass_count
✗ Failed Checks: $fail_count
⚠ Warnings: $warn_count

$(if [ $fail_count -eq 0 ]; then
    echo "Overall Status: ✓ HEALTHY"
elif [ $fail_count -le 2 ]; then
    echo "Overall Status: ⚠ NEEDS ATTENTION"
else
    echo "Overall Status: ✗ UNHEALTHY"
fi)

RECOMMENDATIONS
───────────────────────────────────────────────────────────
$(if [ $fail_count -gt 0 ]; then
    echo "• Review failed checks in log file: $HEALTH_CHECK_LOG"
    echo "• Fix critical issues immediately"
    echo "• Run manual backup if automated backups are failing"
fi)

$(if [ $warn_count -gt 0 ]; then
    echo "• Address warnings to improve backup system reliability"
    echo "• Consider upgrading Neon plan for longer PITR retention"
fi)

$(if [ $fail_count -eq 0 ] && [ $warn_count -eq 0 ]; then
    echo "• No action required, backup system is healthy"
    echo "• Continue monitoring weekly"
fi)

NEXT STEPS
───────────────────────────────────────────────────────────
1. Review this report and take necessary actions
2. Schedule monthly disaster recovery drill
3. Update documentation if any procedures have changed
4. Archive this report for compliance purposes

CONTACT INFORMATION
───────────────────────────────────────────────────────────
Database Admin: [Your Email]
On-call Engineer: [PagerDuty/Slack]
Documentation: /docs/backup-quick-reference.md

═══════════════════════════════════════════════════════════
Report saved to: $REPORT_FILE
═══════════════════════════════════════════════════════════
EOF

    cat "$REPORT_FILE" | tee -a "$HEALTH_CHECK_LOG"

    log_success "Report saved to: $REPORT_FILE"
}

################################################################################
# Main Function
################################################################################

main() {
    echo ""
    echo "═══════════════════════════════════════════════════════════"
    echo "  LINGO KEEPER JP - WEEKLY BACKUP HEALTH CHECK"
    echo "═══════════════════════════════════════════════════════════"
    echo "" | tee -a "$HEALTH_CHECK_LOG"

    log_info "Starting health check at $(date)"
    log_info "Log file: $HEALTH_CHECK_LOG"
    print_separator

    local pass_count=0
    local fail_count=0
    local warn_count=0

    # Run all health checks
    echo "" | tee -a "$HEALTH_CHECK_LOG"
    check_prerequisites && pass_count=$((pass_count + 1)) || fail_count=$((fail_count + 1))

    echo "" | tee -a "$HEALTH_CHECK_LOG"
    check_gcs_bucket && pass_count=$((pass_count + 1)) || fail_count=$((fail_count + 1))

    echo "" | tee -a "$HEALTH_CHECK_LOG"
    check_backup_files && pass_count=$((pass_count + 1)) || fail_count=$((fail_count + 1))

    echo "" | tee -a "$HEALTH_CHECK_LOG"
    check_github_actions_workflow && pass_count=$((pass_count + 1)) || fail_count=$((fail_count + 1))

    echo "" | tee -a "$HEALTH_CHECK_LOG"
    check_database_health && pass_count=$((pass_count + 1)) || fail_count=$((fail_count + 1))

    echo "" | tee -a "$HEALTH_CHECK_LOG"
    check_storage_costs && pass_count=$((pass_count + 1)) || fail_count=$((fail_count + 1))

    echo "" | tee -a "$HEALTH_CHECK_LOG"
    validate_latest_backup && pass_count=$((pass_count + 1)) || fail_count=$((fail_count + 1))

    # Generate report
    echo "" | tee -a "$HEALTH_CHECK_LOG"
    generate_report "$pass_count" "$fail_count" "$warn_count"

    echo "" | tee -a "$HEALTH_CHECK_LOG"
    log_info "Health check completed at $(date)"
    echo ""

    # Exit with appropriate code
    if [ $fail_count -eq 0 ]; then
        exit 0
    else
        exit 1
    fi
}

# Run main function
main "$@"
