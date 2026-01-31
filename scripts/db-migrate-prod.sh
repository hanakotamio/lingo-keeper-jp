#!/bin/bash
# ===================================================================
# Production Database Migration Script
# ===================================================================
# Purpose: Safely apply Prisma migrations to production database
# Usage: ./scripts/db-migrate-prod.sh [--skip-backup] [--auto-approve]
# ===================================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
BACKEND_DIR="$PROJECT_ROOT/backend"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="$PROJECT_ROOT/logs/migration-prod-$TIMESTAMP.log"
BACKUP_NAME="pre-migration-$TIMESTAMP"

# Flags
SKIP_BACKUP=false
AUTO_APPROVE=false

# Parse command line arguments
for arg in "$@"; do
    case $arg in
        --skip-backup)
            SKIP_BACKUP=true
            shift
            ;;
        --auto-approve)
            AUTO_APPROVE=true
            shift
            ;;
        *)
            # Unknown option
            ;;
    esac
done

# Create logs directory if it doesn't exist
mkdir -p "$PROJECT_ROOT/logs"

# ===================================================================
# Helper Functions
# ===================================================================

log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

success() {
    echo -e "${GREEN}✓${NC} $1" | tee -a "$LOG_FILE"
}

warning() {
    echo -e "${YELLOW}⚠${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}✗${NC} $1" | tee -a "$LOG_FILE"
}

separator() {
    echo -e "${BLUE}===================================================================${NC}" | tee -a "$LOG_FILE"
}

header() {
    echo ""
    separator
    echo -e "${MAGENTA}$1${NC}" | tee -a "$LOG_FILE"
    separator
    echo ""
}

# ===================================================================
# Confirmation Prompt
# ===================================================================

confirm_migration() {
    header "🚨 PRODUCTION DATABASE MIGRATION 🚨"

    warning "You are about to apply migrations to PRODUCTION database"
    warning "This action can affect live user data"
    echo ""
    log "Environment:     ${RED}PRODUCTION${NC}"
    log "Timestamp:       $(date +'%Y-%m-%d %H:%M:%S')"
    log "Log file:        $LOG_FILE"
    log "Backup name:     $BACKUP_NAME"
    echo ""

    if [ "$AUTO_APPROVE" = true ]; then
        warning "Auto-approve flag set, skipping confirmation"
        return 0
    fi

    separator
    read -p "$(echo -e "${YELLOW}Are you sure you want to continue? (yes/no):${NC} ")" -r
    echo ""

    if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
        error "Migration cancelled by user"
        exit 1
    fi

    success "Migration approved"
    echo ""
}

# ===================================================================
# Pre-Migration Checks
# ===================================================================

run_pre_checks() {
    header "Step 1: Running Pre-Migration Checks"

    log "Executing pre-migration checks..."
    echo ""

    # Run the check script
    if [ -f "$SCRIPT_DIR/db-migrate-check.sh" ]; then
        bash "$SCRIPT_DIR/db-migrate-check.sh" production | tee -a "$LOG_FILE"
    else
        error "Pre-check script not found: $SCRIPT_DIR/db-migrate-check.sh"
        exit 1
    fi

    # Ask for confirmation to continue
    if [ "$AUTO_APPROVE" = false ]; then
        echo ""
        read -p "$(echo -e "${YELLOW}Pre-checks completed. Continue with migration? (yes/no):${NC} ")" -r
        echo ""

        if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
            error "Migration cancelled after pre-checks"
            exit 1
        fi
    fi

    success "Pre-checks passed"
    echo ""
}

# ===================================================================
# Backup Creation
# ===================================================================

create_backup() {
    if [ "$SKIP_BACKUP" = true ]; then
        warning "Skipping backup (--skip-backup flag set)"
        warning "This is NOT recommended for production migrations"
        echo ""
        return 0
    fi

    header "Step 2: Creating Database Backup"

    log "Creating Neon branch backup..."
    echo ""

    # Check if neonctl is installed
    if command -v neonctl &> /dev/null; then
        log "Using Neon CLI to create branch backup"

        # Create Neon branch for backup (instant snapshot)
        if neonctl branches create --name "$BACKUP_NAME" 2>&1 | tee -a "$LOG_FILE"; then
            success "Neon branch backup created: $BACKUP_NAME"
            log "To restore: neonctl branches restore --branch $BACKUP_NAME"
        else
            error "Failed to create Neon branch backup"
            error "Please create a manual backup before continuing"
            exit 1
        fi
    else
        warning "Neon CLI not found, attempting alternative backup method"

        # Try GCS backup script
        if [ -f "$SCRIPT_DIR/backup-database.sh" ]; then
            log "Using GCS backup script..."
            if bash "$SCRIPT_DIR/backup-database.sh" production pre-migration | tee -a "$LOG_FILE"; then
                success "GCS backup created"
            else
                error "Backup creation failed"
                exit 1
            fi
        else
            error "No backup method available"
            error "Install neonctl or create manual backup before migration"
            exit 1
        fi
    fi

    echo ""
    success "Backup completed successfully"
    echo ""
}

# ===================================================================
# Migration Deployment
# ===================================================================

deploy_migrations() {
    header "Step 3: Deploying Migrations"

    cd "$BACKEND_DIR"

    log "Checking for pending migrations..."
    echo ""

    # Get list of pending migrations
    MIGRATION_STATUS=$(npx prisma migrate status 2>&1)
    echo "$MIGRATION_STATUS" | tee -a "$LOG_FILE"
    echo ""

    # Check if there are pending migrations
    if echo "$MIGRATION_STATUS" | grep -q "Database schema is up to date"; then
        success "No pending migrations to apply"
        log "Database is already up to date"
        echo ""
        return 0
    fi

    # Count pending migrations
    if echo "$MIGRATION_STATUS" | grep -q "pending migration"; then
        PENDING_COUNT=$(echo "$MIGRATION_STATUS" | grep -c "pending migration" || echo "0")
        log "Found ${YELLOW}${PENDING_COUNT}${NC} pending migration(s)"
        echo ""

        # Show migration details
        log "Pending migrations:"
        echo "$MIGRATION_STATUS" | grep "pending migration" | tee -a "$LOG_FILE"
        echo ""
    fi

    # Final confirmation before applying
    if [ "$AUTO_APPROVE" = false ]; then
        separator
        read -p "$(echo -e "${YELLOW}Apply these migrations now? (yes/no):${NC} ")" -r
        echo ""

        if [[ ! $REPLY =~ ^[Yy][Ee][Ss]$ ]]; then
            error "Migration deployment cancelled"
            exit 1
        fi
    fi

    # Apply migrations
    log "Applying migrations..."
    echo ""

    START_TIME=$(date +%s)

    if npx prisma migrate deploy 2>&1 | tee -a "$LOG_FILE"; then
        END_TIME=$(date +%s)
        DURATION=$((END_TIME - START_TIME))

        success "Migrations applied successfully"
        log "Duration: ${DURATION} seconds"
    else
        error "Migration deployment failed"
        error "Check logs for details: $LOG_FILE"
        echo ""
        separator
        warning "ROLLBACK OPTIONS:"
        separator
        echo "1. Restore from Neon branch backup:"
        echo "   neonctl branches restore --branch $BACKUP_NAME"
        echo ""
        echo "2. Restore from GCS backup (if available):"
        echo "   ./scripts/restore-database.sh production $TIMESTAMP"
        echo ""
        exit 1
    fi

    echo ""
}

# ===================================================================
# Post-Migration Verification
# ===================================================================

verify_migration() {
    header "Step 4: Post-Migration Verification"

    cd "$BACKEND_DIR"

    # Verify migration status
    log "Verifying migration status..."
    echo ""

    FINAL_STATUS=$(npx prisma migrate status 2>&1)
    echo "$FINAL_STATUS" | tee -a "$LOG_FILE"
    echo ""

    if echo "$FINAL_STATUS" | grep -q "Database schema is up to date"; then
        success "Migration status verified: up to date"
    else
        warning "Migration status unclear, manual verification recommended"
    fi

    # Test database connection
    log "Testing database connection..."
    if npx prisma db execute --stdin <<< "SELECT 1;" > /dev/null 2>&1; then
        success "Database connection test passed"
    else
        error "Database connection test failed"
        exit 1
    fi

    # Check application health
    log "Checking application health..."
    echo ""

    HEALTH_URL="https://lingo-keeper-jp-backend-16378814888.asia-northeast1.run.app/api/health"
    HEALTH_RESPONSE=$(curl -s "$HEALTH_URL" 2>&1 || echo "")

    if echo "$HEALTH_RESPONSE" | grep -q '"success":true'; then
        success "Application health check passed"
        echo "$HEALTH_RESPONSE" | tee -a "$LOG_FILE"
    else
        warning "Application health check returned unexpected response"
        echo "$HEALTH_RESPONSE" | tee -a "$LOG_FILE"
        warning "Manual verification recommended"
    fi

    echo ""
    success "Post-migration verification completed"
    echo ""
}

# ===================================================================
# Cleanup and Notification
# ===================================================================

finalize() {
    header "Migration Completed Successfully"

    log "Migration summary:"
    log "  • Timestamp:     $TIMESTAMP"
    log "  • Backup:        $BACKUP_NAME"
    log "  • Log file:      $LOG_FILE"
    echo ""

    success "Production database migration completed"
    echo ""

    separator
    log "NEXT STEPS:"
    separator
    echo "1. Monitor application logs for any issues"
    echo "2. Verify critical features are working"
    echo "3. Check error rates in monitoring dashboard"
    echo "4. If issues occur, rollback using:"
    echo "   neonctl branches restore --branch $BACKUP_NAME"
    echo ""

    if [ "$SKIP_BACKUP" = false ]; then
        log "Backup cleanup (optional):"
        log "  After confirming migration is stable (24-48 hours):"
        log "  neonctl branches delete $BACKUP_NAME"
    fi

    echo ""
    separator
    success "Migration log saved to: $LOG_FILE"
    separator
    echo ""
}

# ===================================================================
# Error Handler
# ===================================================================

handle_error() {
    error "Migration failed at step: $1"
    error "Check logs for details: $LOG_FILE"
    echo ""

    if [ "$SKIP_BACKUP" = false ]; then
        separator
        warning "ROLLBACK INSTRUCTIONS:"
        separator
        echo "To restore from backup:"
        echo "  neonctl branches restore --branch $BACKUP_NAME"
        echo ""
    fi

    exit 1
}

# ===================================================================
# Main Execution
# ===================================================================

main() {
    # Set error trap
    trap 'handle_error "Unknown"' ERR

    # Confirm migration
    confirm_migration

    # Run pre-checks
    run_pre_checks || handle_error "Pre-checks"

    # Create backup
    create_backup || handle_error "Backup creation"

    # Deploy migrations
    deploy_migrations || handle_error "Migration deployment"

    # Verify migration
    verify_migration || handle_error "Post-migration verification"

    # Finalize and cleanup
    finalize
}

# Execute main function
main

exit 0
