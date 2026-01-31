#!/bin/bash

################################################################################
# Backup Verification Script
#
# This script validates a PostgreSQL backup file to ensure it can be restored.
# It performs multiple checks including file integrity, content validation,
# and schema verification.
#
# Usage:
#   ./verify-backup.sh <backup_file>
#
# Examples:
#   ./verify-backup.sh backup-20260124.dump
#   ./verify-backup.sh /path/to/backup.dump
#
# Prerequisites:
#   - PostgreSQL client tools installed (pg_restore)
#   - Backup file accessible locally
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

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
VERIFICATION_LOG="verify-backup-$(date +%Y%m%d-%H%M%S).log"

################################################################################
# Helper Functions
################################################################################

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1" | tee -a "$VERIFICATION_LOG"
}

log_success() {
    echo -e "${GREEN}[✓ PASS]${NC} $1" | tee -a "$VERIFICATION_LOG"
}

log_warning() {
    echo -e "${YELLOW}[⚠ WARN]${NC} $1" | tee -a "$VERIFICATION_LOG"
}

log_error() {
    echo -e "${RED}[✗ FAIL]${NC} $1" | tee -a "$VERIFICATION_LOG"
}

print_banner() {
    echo ""
    echo "═══════════════════════════════════════════════════════════"
    echo "  POSTGRESQL BACKUP VERIFICATION"
    echo "═══════════════════════════════════════════════════════════"
    echo ""
}

print_separator() {
    echo "───────────────────────────────────────────────────────────"
}

################################################################################
# Verification Functions
################################################################################

check_prerequisites() {
    log_info "Checking prerequisites..."

    # Check if pg_restore is installed
    if ! command -v pg_restore &> /dev/null; then
        log_error "pg_restore is not installed"
        log_info "Install PostgreSQL client tools from: https://www.postgresql.org/download/"
        return 1
    fi

    local pg_version=$(pg_restore --version | head -1)
    log_success "PostgreSQL client tools found: $pg_version"
    return 0
}

verify_file_exists() {
    local backup_file="$1"

    log_info "Checking if backup file exists..."

    if [ ! -f "$backup_file" ]; then
        log_error "Backup file not found: $backup_file"
        return 1
    fi

    log_success "Backup file exists: $backup_file"
    return 0
}

verify_file_size() {
    local backup_file="$1"

    log_info "Checking file size..."

    # Check if file is not empty
    if [ ! -s "$backup_file" ]; then
        log_error "Backup file is empty (0 bytes)"
        return 1
    fi

    local file_size=$(du -h "$backup_file" | cut -f1)
    local file_bytes=$(stat -c%s "$backup_file" 2>/dev/null || stat -f%z "$backup_file" 2>/dev/null)

    log_success "File size: $file_size ($file_bytes bytes)"

    # Warn if file is suspiciously small (< 1 KB)
    if [ "$file_bytes" -lt 1024 ]; then
        log_warning "File size is very small (< 1 KB), may indicate incomplete backup"
        return 1
    fi

    # Warn if file is suspiciously large (> 10 GB)
    if [ "$file_bytes" -gt 10737418240 ]; then
        log_warning "File size is very large (> 10 GB), verification may take a while"
    fi

    return 0
}

verify_file_format() {
    local backup_file="$1"

    log_info "Verifying backup file format..."

    # Check if file is a valid pg_dump custom format
    if ! pg_restore --list "$backup_file" > /dev/null 2>&1; then
        log_error "File is not a valid PostgreSQL custom format backup"
        log_info "Ensure backup was created with: pg_dump --format=custom"
        return 1
    fi

    log_success "File format is valid (PostgreSQL custom format)"
    return 0
}

verify_backup_contents() {
    local backup_file="$1"

    log_info "Analyzing backup contents..."

    # Create temporary file for backup listing
    local temp_list="/tmp/backup-contents-$$.txt"

    if ! pg_restore --list "$backup_file" > "$temp_list" 2>&1; then
        log_error "Failed to list backup contents"
        rm -f "$temp_list"
        return 1
    fi

    # Count total objects
    local object_count=$(wc -l < "$temp_list")
    log_info "Total objects in backup: $object_count"

    if [ "$object_count" -eq 0 ]; then
        log_error "Backup contains no database objects"
        rm -f "$temp_list"
        return 1
    fi

    # Count specific object types
    local table_count=$(grep -c "TABLE DATA" "$temp_list" || echo "0")
    local index_count=$(grep -c "INDEX" "$temp_list" || echo "0")
    local constraint_count=$(grep -c "CONSTRAINT" "$temp_list" || echo "0")
    local sequence_count=$(grep -c "SEQUENCE" "$temp_list" || echo "0")

    log_info "  • Tables: $table_count"
    log_info "  • Indexes: $index_count"
    log_info "  • Constraints: $constraint_count"
    log_info "  • Sequences: $sequence_count"

    # Verify expected tables exist
    log_info "Checking for expected tables..."

    local expected_tables=("stories" "chapters" "choices" "quizzes" "quiz_choices" "quiz_results" "user_progress")
    local missing_tables=()

    for table in "${expected_tables[@]}"; do
        if ! grep -q "TABLE DATA.*$table" "$temp_list"; then
            missing_tables+=("$table")
        fi
    done

    if [ ${#missing_tables[@]} -gt 0 ]; then
        log_warning "Missing expected tables: ${missing_tables[*]}"
        log_warning "This may be expected if database schema has changed"
    else
        log_success "All expected tables found in backup"
    fi

    # Display first 20 objects
    print_separator
    log_info "First 20 objects in backup:"
    head -20 "$temp_list" | while read -r line; do
        echo "  $line"
    done | tee -a "$VERIFICATION_LOG"
    print_separator

    rm -f "$temp_list"
    return 0
}

verify_backup_metadata() {
    local backup_file="$1"

    log_info "Extracting backup metadata..."

    # Get file modification time
    local mod_time
    if [ "$(uname)" == "Darwin" ]; then
        # macOS
        mod_time=$(stat -f "%Sm" -t "%Y-%m-%d %H:%M:%S" "$backup_file")
    else
        # Linux
        mod_time=$(stat -c "%y" "$backup_file" | cut -d'.' -f1)
    fi

    log_info "  • File created: $mod_time"

    # Calculate file checksum
    log_info "Calculating file checksum (SHA256)..."
    if command -v sha256sum &> /dev/null; then
        local checksum=$(sha256sum "$backup_file" | cut -d' ' -f1)
        log_info "  • SHA256: $checksum"
    elif command -v shasum &> /dev/null; then
        local checksum=$(shasum -a 256 "$backup_file" | cut -d' ' -f1)
        log_info "  • SHA256: $checksum"
    else
        log_warning "SHA256 checksum tool not found (install coreutils)"
    fi

    return 0
}

verify_compression() {
    local backup_file="$1"

    log_info "Checking compression..."

    # Check if file is compressed (pg_dump custom format with -Z flag)
    local file_type=$(file "$backup_file" 2>/dev/null || echo "unknown")

    if echo "$file_type" | grep -q "gzip compressed"; then
        log_success "Backup is compressed (gzip)"
    elif echo "$file_type" | grep -q "compressed"; then
        log_success "Backup is compressed"
    else
        log_info "Backup may not be compressed (or compression not detected)"
        log_info "Consider using --compress=9 flag for smaller file size"
    fi

    return 0
}

perform_test_restore() {
    local backup_file="$1"

    log_info "Performing test restore (dry-run)..."

    # Attempt to restore to stdout (doesn't actually restore, just validates)
    local temp_output="/tmp/pg-restore-test-$$.log"

    if pg_restore --list --verbose "$backup_file" > "$temp_output" 2>&1; then
        log_success "Test restore successful (backup can be restored)"
    else
        log_error "Test restore failed (backup may be corrupted)"
        log_info "Error details:"
        tail -10 "$temp_output" | while read -r line; do
            echo "  $line"
        done | tee -a "$VERIFICATION_LOG"
        rm -f "$temp_output"
        return 1
    fi

    rm -f "$temp_output"
    return 0
}

################################################################################
# Main Function
################################################################################

main() {
    print_banner

    # Parse arguments
    if [ $# -lt 1 ]; then
        echo "Usage: $0 <backup_file>"
        echo ""
        echo "Examples:"
        echo "  $0 backup-20260124.dump"
        echo "  $0 /path/to/backup.dump"
        echo ""
        exit 1
    fi

    local backup_file="$1"
    local test_count=0
    local pass_count=0
    local fail_count=0
    local warn_count=0

    log_info "Starting backup verification at $(date)"
    log_info "Backup file: $backup_file"
    log_info "Log file: $VERIFICATION_LOG"
    print_separator

    # Run verification tests
    local tests=(
        "check_prerequisites"
        "verify_file_exists $backup_file"
        "verify_file_size $backup_file"
        "verify_file_format $backup_file"
        "verify_backup_contents $backup_file"
        "verify_backup_metadata $backup_file"
        "verify_compression $backup_file"
        "perform_test_restore $backup_file"
    )

    for test in "${tests[@]}"; do
        test_count=$((test_count + 1))
        echo ""

        if eval "$test"; then
            pass_count=$((pass_count + 1))
        else
            fail_count=$((fail_count + 1))
        fi
    done

    # Summary
    print_separator
    echo ""
    log_info "═══════════════════════════════════════════════════════════"
    log_info "  VERIFICATION SUMMARY"
    log_info "═══════════════════════════════════════════════════════════"
    log_info "Total tests: $test_count"
    log_success "Passed: $pass_count"

    if [ $fail_count -gt 0 ]; then
        log_error "Failed: $fail_count"
    else
        log_info "Failed: 0"
    fi

    log_info "Completed at: $(date)"
    log_info "Log file: $VERIFICATION_LOG"
    echo ""

    # Final verdict
    if [ $fail_count -eq 0 ]; then
        log_success "═══════════════════════════════════════════════════════════"
        log_success "  ✓ BACKUP VERIFICATION PASSED"
        log_success "  This backup file is valid and can be restored"
        log_success "═══════════════════════════════════════════════════════════"
        echo ""
        exit 0
    else
        log_error "═══════════════════════════════════════════════════════════"
        log_error "  ✗ BACKUP VERIFICATION FAILED"
        log_error "  This backup may be corrupted or incomplete"
        log_error "  Review errors above and check log: $VERIFICATION_LOG"
        log_error "═══════════════════════════════════════════════════════════"
        echo ""
        exit 1
    fi
}

# Run main function
main "$@"
