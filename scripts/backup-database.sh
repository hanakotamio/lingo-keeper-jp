#!/bin/bash

################################################################################
# Manual Database Backup Script
#
# This script creates a manual backup of the Neon PostgreSQL database
# and optionally uploads it to Google Cloud Storage.
#
# Usage:
#   ./backup-database.sh [OPTIONS]
#
# Options:
#   -n, --name NAME       Custom backup name (default: backup-YYYYMMDD-HHMMSS)
#   -u, --upload          Upload backup to Google Cloud Storage
#   -c, --compress LEVEL  Compression level 0-9 (default: 9)
#   -h, --help            Show this help message
#
# Examples:
#   ./backup-database.sh
#   ./backup-database.sh --name pre-migration-backup
#   ./backup-database.sh --upload
#   ./backup-database.sh --name emergency-backup --upload
#
# Prerequisites:
#   - PostgreSQL 16 client tools installed
#   - Environment variable: NEON_DATABASE_URL or DATABASE_URL
#   - gcloud CLI (if using --upload)
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
NC='\033[0m' # No Color

# Default configuration
BACKUP_NAME="backup-$(date +%Y%m%d-%H%M%S)"
COMPRESS_LEVEL=9
UPLOAD_TO_GCS=false
GCS_BUCKET="${GCS_BACKUP_BUCKET:-lingo-keeper-jp-backups}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

################################################################################
# Helper Functions
################################################################################

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_banner() {
    echo ""
    echo "═══════════════════════════════════════════════════════════"
    echo "  NEON POSTGRESQL MANUAL BACKUP"
    echo "═══════════════════════════════════════════════════════════"
    echo ""
}

print_usage() {
    cat << EOF
Usage: $0 [OPTIONS]

Options:
  -n, --name NAME       Custom backup name (default: backup-YYYYMMDD-HHMMSS)
  -u, --upload          Upload backup to Google Cloud Storage
  -c, --compress LEVEL  Compression level 0-9 (default: 9)
  -h, --help            Show this help message

Examples:
  $0
  $0 --name pre-migration-backup
  $0 --upload
  $0 --name emergency-backup --upload

Environment Variables:
  NEON_DATABASE_URL    Neon PostgreSQL connection string (required)
  GCS_BACKUP_BUCKET    GCS bucket name (default: lingo-keeper-jp-backups)

EOF
}

################################################################################
# Validation Functions
################################################################################

check_prerequisites() {
    log_info "Checking prerequisites..."

    # Check if pg_dump is installed
    if ! command -v pg_dump &> /dev/null; then
        log_error "pg_dump is not installed"
        log_info "Install from: https://www.postgresql.org/download/"
        exit 1
    fi

    local pg_version=$(pg_dump --version | head -1)
    log_success "PostgreSQL client tools found: $pg_version"

    # Check if database URL is set
    local db_url="${NEON_DATABASE_URL:-${DATABASE_URL:-}}"
    if [ -z "$db_url" ]; then
        log_error "NEON_DATABASE_URL or DATABASE_URL environment variable is not set"
        exit 1
    fi

    log_success "Database connection string is configured"

    # Check gcloud if upload is requested
    if [ "$UPLOAD_TO_GCS" = true ]; then
        if ! command -v gsutil &> /dev/null; then
            log_error "gsutil (Google Cloud SDK) is not installed"
            log_info "Install from: https://cloud.google.com/sdk/docs/install"
            exit 1
        fi

        log_success "Google Cloud SDK found"

        # Test GCS access
        if gsutil ls -b "gs://${GCS_BUCKET}" &> /dev/null; then
            log_success "GCS bucket accessible: gs://${GCS_BUCKET}"
        else
            log_error "Cannot access GCS bucket: gs://${GCS_BUCKET}"
            log_info "Run: gcloud auth login"
            exit 1
        fi
    fi
}

################################################################################
# Backup Functions
################################################################################

create_backup() {
    local db_url="${NEON_DATABASE_URL:-${DATABASE_URL:-}}"
    local backup_file="${BACKUP_NAME}.dump"

    log_info "Starting database backup..."
    log_info "  • Backup name: $BACKUP_NAME"
    log_info "  • Compression level: $COMPRESS_LEVEL"
    log_info "  • Output file: $backup_file"

    # Create backup
    if pg_dump \
        --format=custom \
        --compress="$COMPRESS_LEVEL" \
        --no-owner \
        --no-acl \
        --verbose \
        --file="$backup_file" \
        "$db_url" 2>&1; then

        log_success "Backup created successfully"
    else
        log_error "Backup failed"
        exit 1
    fi

    # Display file info
    local file_size=$(du -h "$backup_file" | cut -f1)
    log_info "Backup file size: $file_size"

    echo "$backup_file"
}

validate_backup() {
    local backup_file="$1"

    log_info "Validating backup integrity..."

    # Validate backup
    if pg_restore --list "$backup_file" > /dev/null 2>&1; then
        local object_count=$(pg_restore --list "$backup_file" | wc -l)
        log_success "Backup validation successful ($object_count objects)"
    else
        log_error "Backup validation failed"
        return 1
    fi

    # Count tables
    local table_count=$(pg_restore --list "$backup_file" | grep -c "TABLE DATA" || echo "0")
    log_info "  • Tables: $table_count"

    # Show first 10 objects
    log_info "First 10 objects in backup:"
    pg_restore --list "$backup_file" | head -10 | while read -r line; do
        echo "    $line"
    done
}

upload_to_gcs() {
    local backup_file="$1"

    log_info "Uploading backup to Google Cloud Storage..."

    # Upload with metadata
    if gsutil -h "Content-Type:application/octet-stream" \
        -h "x-goog-meta-backup-date:$(date -Iseconds)" \
        -h "x-goog-meta-database:lingo_keeper_jp" \
        -h "x-goog-meta-backup-type:manual" \
        -h "x-goog-meta-created-by:$(whoami)" \
        cp "$backup_file" "gs://${GCS_BUCKET}/$backup_file"; then

        log_success "Backup uploaded to gs://${GCS_BUCKET}/$backup_file"
    else
        log_error "Upload failed"
        return 1
    fi

    # Verify upload
    log_info "Verifying upload..."
    if gsutil ls "gs://${GCS_BUCKET}/$backup_file" &> /dev/null; then
        log_success "Upload verified"
    else
        log_error "Upload verification failed"
        return 1
    fi
}

################################################################################
# Main Function
################################################################################

main() {
    # Parse arguments
    while [[ $# -gt 0 ]]; do
        case $1 in
            -n|--name)
                BACKUP_NAME="$2"
                shift 2
                ;;
            -u|--upload)
                UPLOAD_TO_GCS=true
                shift
                ;;
            -c|--compress)
                COMPRESS_LEVEL="$2"
                shift 2
                ;;
            -h|--help)
                print_usage
                exit 0
                ;;
            *)
                log_error "Unknown option: $1"
                print_usage
                exit 1
                ;;
        esac
    done

    print_banner

    log_info "Manual backup started at $(date)"

    # Validate compress level
    if ! [[ "$COMPRESS_LEVEL" =~ ^[0-9]$ ]]; then
        log_error "Invalid compression level: $COMPRESS_LEVEL (must be 0-9)"
        exit 1
    fi

    # Step 1: Check prerequisites
    check_prerequisites

    echo ""

    # Step 2: Create backup
    local backup_file=$(create_backup)

    echo ""

    # Step 3: Validate backup
    validate_backup "$backup_file"

    echo ""

    # Step 4: Upload to GCS (if requested)
    if [ "$UPLOAD_TO_GCS" = true ]; then
        upload_to_gcs "$backup_file"
        echo ""
    fi

    # Success summary
    log_success "═══════════════════════════════════════════════════════════"
    log_success "  BACKUP COMPLETED SUCCESSFULLY"
    log_success "═══════════════════════════════════════════════════════════"
    log_info "Backup file: $backup_file"
    log_info "File size: $(du -h "$backup_file" | cut -f1)"

    if [ "$UPLOAD_TO_GCS" = true ]; then
        log_info "GCS location: gs://${GCS_BUCKET}/$backup_file"
    fi

    log_info "Completed at: $(date)"
    echo ""
    log_info "To restore this backup, run:"
    log_info "  ./scripts/restore-database.sh $backup_file test"
    echo ""
    log_info "To validate this backup, run:"
    log_info "  ./scripts/verify-backup.sh $backup_file"
    echo ""
}

# Run main function
main "$@"
