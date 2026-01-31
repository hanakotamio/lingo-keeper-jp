#!/bin/bash

################################################################################
# Neon PostgreSQL Database Restore Script
#
# This script restores a Neon PostgreSQL database from a pg_dump backup file.
# It includes safety checks and validation steps to ensure data integrity.
#
# Usage:
#   ./restore-database.sh <backup_file> <target_environment>
#
# Examples:
#   ./restore-database.sh backup-20260124.dump test
#   ./restore-database.sh backup-20260124.dump production
#
# Prerequisites:
#   - PostgreSQL 16 client tools installed (pg_restore)
#   - Environment variables set: NEON_DATABASE_URL_TEST or NEON_DATABASE_URL_PROD
#   - Backup file in current directory or provide full path
#
# Author: DevOps Team
# Date: 2026-01-24
################################################################################

set -euo pipefail  # Exit on error, undefined variable, or pipe failure

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
RESTORE_LOG="restore-$(date +%Y%m%d-%H%M%S).log"

################################################################################
# Helper Functions
################################################################################

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1" | tee -a "$RESTORE_LOG"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1" | tee -a "$RESTORE_LOG"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$RESTORE_LOG"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$RESTORE_LOG"
}

print_banner() {
    echo ""
    echo "═══════════════════════════════════════════════════════════"
    echo "  NEON POSTGRESQL DATABASE RESTORE"
    echo "═══════════════════════════════════════════════════════════"
    echo ""
}

print_separator() {
    echo "───────────────────────────────────────────────────────────"
}

################################################################################
# Validation Functions
################################################################################

check_prerequisites() {
    log_info "Checking prerequisites..."

    # Check if pg_restore is installed
    if ! command -v pg_restore &> /dev/null; then
        log_error "pg_restore is not installed. Please install PostgreSQL client tools."
        exit 1
    fi

    # Check if psql is installed
    if ! command -v psql &> /dev/null; then
        log_error "psql is not installed. Please install PostgreSQL client tools."
        exit 1
    fi

    log_success "PostgreSQL client tools found (version: $(pg_restore --version | head -1))"
}

validate_backup_file() {
    local backup_file="$1"

    log_info "Validating backup file: $backup_file"

    # Check if file exists
    if [ ! -f "$backup_file" ]; then
        log_error "Backup file not found: $backup_file"
        exit 1
    fi

    # Check if file is not empty
    if [ ! -s "$backup_file" ]; then
        log_error "Backup file is empty: $backup_file"
        exit 1
    fi

    # Display file info
    local file_size=$(du -h "$backup_file" | cut -f1)
    log_info "Backup file size: $file_size"

    # Validate backup integrity
    log_info "Checking backup integrity..."
    if pg_restore --list "$backup_file" > /dev/null 2>&1; then
        local object_count=$(pg_restore --list "$backup_file" | wc -l)
        log_success "Backup validation successful (contains $object_count objects)"
    else
        log_error "Backup file is corrupted or invalid"
        exit 1
    fi
}

get_database_url() {
    local environment="$1"

    case "$environment" in
        test|testing|dev|development)
            if [ -z "${NEON_DATABASE_URL_TEST:-}" ]; then
                log_error "NEON_DATABASE_URL_TEST environment variable is not set"
                exit 1
            fi
            echo "$NEON_DATABASE_URL_TEST"
            ;;
        prod|production)
            if [ -z "${NEON_DATABASE_URL_PROD:-}" ]; then
                log_error "NEON_DATABASE_URL_PROD environment variable is not set"
                exit 1
            fi
            echo "$NEON_DATABASE_URL_PROD"
            ;;
        *)
            log_error "Invalid environment: $environment (must be test|prod)"
            exit 1
            ;;
    esac
}

################################################################################
# Database Functions
################################################################################

test_database_connection() {
    local db_url="$1"
    local environment="$2"

    log_info "Testing database connection to $environment environment..."

    if psql "$db_url" -c "SELECT version();" > /dev/null 2>&1; then
        log_success "Database connection successful"
    else
        log_error "Failed to connect to database"
        exit 1
    fi
}

get_table_counts() {
    local db_url="$1"

    log_info "Getting current table row counts..."

    psql "$db_url" -t -c "
        SELECT
            'stories: ' || COUNT(*) FROM stories
        UNION ALL SELECT 'chapters: ' || COUNT(*) FROM chapters
        UNION ALL SELECT 'choices: ' || COUNT(*) FROM choices
        UNION ALL SELECT 'quizzes: ' || COUNT(*) FROM quizzes
        UNION ALL SELECT 'quiz_choices: ' || COUNT(*) FROM quiz_choices
        UNION ALL SELECT 'quiz_results: ' || COUNT(*) FROM quiz_results
        UNION ALL SELECT 'user_progress: ' || COUNT(*) FROM user_progress;
    " | tee -a "$RESTORE_LOG"
}

create_backup_snapshot() {
    local db_url="$1"
    local snapshot_file="pre-restore-snapshot-$(date +%Y%m%d-%H%M%S).dump"

    log_info "Creating pre-restore snapshot..."

    if pg_dump --format=custom --compress=9 "$db_url" --file="$snapshot_file" 2>&1 | tee -a "$RESTORE_LOG"; then
        log_success "Pre-restore snapshot created: $snapshot_file"
        echo "$snapshot_file"
    else
        log_warning "Failed to create pre-restore snapshot (continuing anyway)"
        echo ""
    fi
}

perform_restore() {
    local backup_file="$1"
    local db_url="$2"

    log_info "Starting database restore..."
    log_warning "This will DELETE all existing data in the target database!"

    print_separator

    # Display backup contents summary
    log_info "Backup contents (first 20 objects):"
    pg_restore --list "$backup_file" | head -20 | tee -a "$RESTORE_LOG"

    print_separator

    # Restore database
    log_info "Executing pg_restore..."

    if pg_restore \
        --verbose \
        --clean \
        --if-exists \
        --no-owner \
        --no-acl \
        --single-transaction \
        --dbname="$db_url" \
        "$backup_file" 2>&1 | tee -a "$RESTORE_LOG"; then
        log_success "Database restore completed successfully"
    else
        log_error "Database restore failed (check log: $RESTORE_LOG)"
        exit 1
    fi
}

verify_restore() {
    local db_url="$1"

    log_info "Verifying restore..."

    # Check if tables exist
    log_info "Checking if tables exist..."
    local table_count=$(psql "$db_url" -t -c "
        SELECT COUNT(*)
        FROM information_schema.tables
        WHERE table_schema = 'public';
    " | xargs)

    if [ "$table_count" -gt 0 ]; then
        log_success "Found $table_count tables in database"
    else
        log_error "No tables found in database"
        exit 1
    fi

    # Get row counts
    log_info "Post-restore table row counts:"
    get_table_counts "$db_url"

    # Check for constraints
    log_info "Verifying foreign key constraints..."
    local constraint_count=$(psql "$db_url" -t -c "
        SELECT COUNT(*)
        FROM information_schema.table_constraints
        WHERE constraint_type = 'FOREIGN KEY';
    " | xargs)

    log_success "Found $constraint_count foreign key constraints"

    # Check for indexes
    log_info "Verifying indexes..."
    local index_count=$(psql "$db_url" -t -c "
        SELECT COUNT(*)
        FROM pg_indexes
        WHERE schemaname = 'public';
    " | xargs)

    log_success "Found $index_count indexes"
}

################################################################################
# Main Function
################################################################################

main() {
    print_banner

    # Parse arguments
    if [ $# -lt 2 ]; then
        echo "Usage: $0 <backup_file> <target_environment>"
        echo ""
        echo "Arguments:"
        echo "  backup_file          Path to the backup file (e.g., backup-20260124.dump)"
        echo "  target_environment   Target environment (test|prod)"
        echo ""
        echo "Examples:"
        echo "  $0 backup-20260124.dump test"
        echo "  $0 /path/to/backup.dump production"
        echo ""
        exit 1
    fi

    local backup_file="$1"
    local environment="$2"

    log_info "Starting restore process at $(date)"
    log_info "Backup file: $backup_file"
    log_info "Target environment: $environment"
    log_info "Log file: $RESTORE_LOG"

    print_separator

    # Step 1: Check prerequisites
    check_prerequisites

    # Step 2: Validate backup file
    validate_backup_file "$backup_file"

    # Step 3: Get database URL
    local db_url=$(get_database_url "$environment")

    # Step 4: Test connection
    test_database_connection "$db_url" "$environment"

    # Step 5: Show current state
    log_info "Current database state (BEFORE restore):"
    get_table_counts "$db_url"

    print_separator

    # Step 6: Confirmation for production
    if [[ "$environment" == "prod" || "$environment" == "production" ]]; then
        log_warning "⚠️  WARNING: You are about to restore to PRODUCTION!"
        log_warning "⚠️  This will DELETE all current production data!"
        echo -n "Type 'YES' to continue: "
        read -r confirmation

        if [ "$confirmation" != "YES" ]; then
            log_info "Restore cancelled by user"
            exit 0
        fi
    fi

    # Step 7: Create pre-restore snapshot
    local snapshot_file=$(create_backup_snapshot "$db_url")

    print_separator

    # Step 8: Perform restore
    perform_restore "$backup_file" "$db_url"

    print_separator

    # Step 9: Verify restore
    verify_restore "$db_url"

    print_separator

    # Success summary
    log_success "═══════════════════════════════════════════════════════════"
    log_success "  DATABASE RESTORE COMPLETED SUCCESSFULLY"
    log_success "═══════════════════════════════════════════════════════════"
    log_info "Restore completed at: $(date)"
    log_info "Log file: $RESTORE_LOG"
    if [ -n "$snapshot_file" ]; then
        log_info "Pre-restore snapshot: $snapshot_file"
    fi
    log_info ""
    log_info "Next steps:"
    log_info "1. Test application functionality"
    log_info "2. Verify data integrity"
    log_info "3. Monitor application logs"
    log_info "4. Keep snapshot for 24 hours before deleting"
    echo ""
}

# Run main function
main "$@"
