#!/bin/bash
# ===================================================================
# Database Migration Pre-Check Script
# ===================================================================
# Purpose: Verify database and environment safety before migration
# Usage: ./scripts/db-migrate-check.sh [environment]
# Example: ./scripts/db-migrate-check.sh production
# ===================================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT="${1:-development}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
BACKEND_DIR="$PROJECT_ROOT/backend"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
LOG_FILE="$PROJECT_ROOT/logs/migration-check-$TIMESTAMP.log"

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

# ===================================================================
# Pre-flight Checks
# ===================================================================

preflight_checks() {
    separator
    log "Starting pre-migration checks for ${YELLOW}${ENVIRONMENT}${NC} environment"
    separator
    echo ""

    # Check if backend directory exists
    if [ ! -d "$BACKEND_DIR" ]; then
        error "Backend directory not found: $BACKEND_DIR"
        exit 1
    fi

    # Change to backend directory
    cd "$BACKEND_DIR"
    success "Working directory: $BACKEND_DIR"

    # Check if Prisma schema exists
    if [ ! -f "prisma/schema.prisma" ]; then
        error "Prisma schema not found: prisma/schema.prisma"
        exit 1
    fi
    success "Prisma schema found"

    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        warning "node_modules not found, installing dependencies..."
        npm ci
    fi
    success "Node modules verified"

    echo ""
}

# ===================================================================
# Environment Configuration
# ===================================================================

load_environment() {
    separator
    log "Loading environment configuration"
    separator
    echo ""

    case "$ENVIRONMENT" in
        development)
            ENV_FILE="$BACKEND_DIR/.env.local"
            ;;
        staging)
            ENV_FILE="$BACKEND_DIR/.env.staging"
            ;;
        production)
            ENV_FILE="$BACKEND_DIR/.env.production"
            ;;
        *)
            error "Invalid environment: $ENVIRONMENT"
            error "Valid environments: development, staging, production"
            exit 1
            ;;
    esac

    if [ ! -f "$ENV_FILE" ]; then
        # Check if DATABASE_URL is set in environment variables
        if [ -z "$DATABASE_URL" ]; then
            error "Environment file not found: $ENV_FILE"
            error "And DATABASE_URL environment variable is not set"
            exit 1
        else
            warning "Using DATABASE_URL from environment variable"
        fi
    else
        success "Environment file found: $ENV_FILE"
        # Load environment variables
        export $(grep -v '^#' "$ENV_FILE" | xargs)
    fi

    # Verify DATABASE_URL is set
    if [ -z "$DATABASE_URL" ]; then
        error "DATABASE_URL is not set"
        exit 1
    fi
    success "DATABASE_URL is configured"

    echo ""
}

# ===================================================================
# Database Connection Test
# ===================================================================

test_connection() {
    separator
    log "Testing database connection"
    separator
    echo ""

    # Try to connect using Prisma
    if npx prisma db execute --stdin <<< "SELECT 1;" > /dev/null 2>&1; then
        success "Database connection successful"
    else
        error "Database connection failed"
        error "Please check your DATABASE_URL configuration"
        exit 1
    fi

    echo ""
}

# ===================================================================
# Migration Status Check
# ===================================================================

check_migration_status() {
    separator
    log "Checking migration status"
    separator
    echo ""

    # Get migration status
    MIGRATION_STATUS=$(npx prisma migrate status 2>&1)

    echo "$MIGRATION_STATUS" | tee -a "$LOG_FILE"
    echo ""

    # Check for pending migrations
    if echo "$MIGRATION_STATUS" | grep -q "pending migration"; then
        warning "There are pending migrations to apply"

        # Count pending migrations
        PENDING_COUNT=$(echo "$MIGRATION_STATUS" | grep -c "pending migration" || echo "0")
        log "Number of pending migrations: $PENDING_COUNT"

        return 0
    elif echo "$MIGRATION_STATUS" | grep -q "Database schema is up to date"; then
        success "Database schema is up to date (no pending migrations)"
        return 0
    elif echo "$MIGRATION_STATUS" | grep -q "not managed by Prisma Migrate"; then
        warning "Database is not managed by Prisma Migrate"
        warning "You need to baseline the database first"
        log "Run: npx prisma migrate dev --name initial_baseline"
        return 0
    else
        warning "Unknown migration status"
        return 0
    fi
}

# ===================================================================
# Schema Drift Detection
# ===================================================================

check_schema_drift() {
    separator
    log "Checking for schema drift"
    separator
    echo ""

    # Generate diff between schema and database
    DRIFT_CHECK=$(npx prisma migrate diff \
        --from-schema-datasource prisma/schema.prisma \
        --to-schema-datamodel prisma/schema.prisma \
        --exit-code 2>&1 || true)

    if [ -z "$DRIFT_CHECK" ] || echo "$DRIFT_CHECK" | grep -q "No difference detected"; then
        success "No schema drift detected"
    else
        warning "Schema drift detected!"
        echo "$DRIFT_CHECK" | tee -a "$LOG_FILE"
        warning "Manual schema changes may have been made outside Prisma Migrate"
    fi

    echo ""
}

# ===================================================================
# Backup Verification
# ===================================================================

verify_backup() {
    separator
    log "Verifying backup availability"
    separator
    echo ""

    if [ "$ENVIRONMENT" = "production" ] || [ "$ENVIRONMENT" = "staging" ]; then
        # Check if GCS backup script exists
        BACKUP_SCRIPT="$SCRIPT_DIR/backup-database.sh"

        if [ -f "$BACKUP_SCRIPT" ]; then
            success "Backup script found: $BACKUP_SCRIPT"

            # Check for recent backups (optional)
            BACKUP_DIR="$PROJECT_ROOT/backups"
            if [ -d "$BACKUP_DIR" ]; then
                RECENT_BACKUP=$(find "$BACKUP_DIR" -name "*.sql" -mtime -7 | head -1)
                if [ -n "$RECENT_BACKUP" ]; then
                    success "Recent backup found (within 7 days)"
                    log "Backup: $(basename "$RECENT_BACKUP")"
                else
                    warning "No recent backup found (within 7 days)"
                    warning "Consider creating a backup before migration"
                fi
            else
                warning "Backup directory not found"
            fi
        else
            warning "Backup script not found"
            warning "Consider creating a backup manually before migration"
        fi

        # Suggest Neon branch backup
        log ""
        log "💡 TIP: Use Neon's branch feature for instant backups:"
        log "   neonctl branches create --name pre-migration-$(date +%Y%m%d)"
    else
        success "Backup verification skipped for development environment"
    fi

    echo ""
}

# ===================================================================
# Application Health Check
# ===================================================================

check_app_health() {
    separator
    log "Checking application health"
    separator
    echo ""

    if [ "$ENVIRONMENT" = "development" ]; then
        success "Health check skipped for development environment"
        echo ""
        return 0
    fi

    # Check if health endpoint is configured
    HEALTH_URL="${BACKEND_URL:-http://localhost:8534}/api/health"

    if [ "$ENVIRONMENT" = "production" ]; then
        HEALTH_URL="https://lingo-keeper-jp-backend-16378814888.asia-northeast1.run.app/api/health"
    fi

    log "Checking health endpoint: $HEALTH_URL"

    # Perform health check
    HEALTH_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$HEALTH_URL" 2>&1 || echo "000")

    if [ "$HEALTH_RESPONSE" = "200" ]; then
        success "Application is healthy (HTTP 200)"
    elif [ "$HEALTH_RESPONSE" = "000" ]; then
        warning "Unable to reach health endpoint"
        warning "This is expected if the application is not running"
    else
        warning "Application health check returned HTTP $HEALTH_RESPONSE"
    fi

    echo ""
}

# ===================================================================
# Database Lock Check
# ===================================================================

check_database_locks() {
    separator
    log "Checking for database locks"
    separator
    echo ""

    # Query to check for long-running queries
    LOCK_QUERY="
    SELECT
        pid,
        usename,
        application_name,
        state,
        query_start,
        state_change,
        EXTRACT(epoch FROM (now() - query_start)) AS duration_seconds,
        query
    FROM pg_stat_activity
    WHERE state != 'idle'
        AND pid != pg_backend_pid()
        AND EXTRACT(epoch FROM (now() - query_start)) > 60
    ORDER BY query_start;
    "

    # Execute query
    LOCK_RESULT=$(npx prisma db execute --stdin <<< "$LOCK_QUERY" 2>&1 || echo "")

    if [ -z "$LOCK_RESULT" ] || echo "$LOCK_RESULT" | grep -q "0 rows"; then
        success "No long-running queries detected"
    else
        warning "Long-running queries detected (>60 seconds)"
        echo "$LOCK_RESULT" | tee -a "$LOG_FILE"
        warning "Consider waiting for these queries to complete before migration"
    fi

    echo ""
}

# ===================================================================
# Migration Files Validation
# ===================================================================

validate_migration_files() {
    separator
    log "Validating migration files"
    separator
    echo ""

    MIGRATIONS_DIR="$BACKEND_DIR/prisma/migrations"

    if [ ! -d "$MIGRATIONS_DIR" ]; then
        warning "Migrations directory not found"
        warning "This is expected for a new Prisma Migrate setup"
        log "You'll need to run: npx prisma migrate dev --name initial_baseline"
        echo ""
        return 0
    fi

    # Count migration files
    MIGRATION_COUNT=$(find "$MIGRATIONS_DIR" -name "migration.sql" | wc -l)
    success "Found $MIGRATION_COUNT migration file(s)"

    # Check for syntax errors in migration files
    SYNTAX_ERRORS=0
    for migration_file in $(find "$MIGRATIONS_DIR" -name "migration.sql"); do
        MIGRATION_NAME=$(basename $(dirname "$migration_file"))

        # Basic syntax check (looking for common SQL syntax)
        if grep -q ";" "$migration_file"; then
            log "✓ $MIGRATION_NAME"
        else
            warning "⚠ $MIGRATION_NAME - No SQL statements found"
            SYNTAX_ERRORS=$((SYNTAX_ERRORS + 1))
        fi
    done

    if [ $SYNTAX_ERRORS -eq 0 ]; then
        success "All migration files appear valid"
    else
        warning "$SYNTAX_ERRORS migration file(s) may have issues"
    fi

    echo ""
}

# ===================================================================
# Disk Space Check
# ===================================================================

check_disk_space() {
    separator
    log "Checking disk space"
    separator
    echo ""

    # Get available disk space in GB
    AVAILABLE_SPACE=$(df -BG "$BACKEND_DIR" | awk 'NR==2 {print $4}' | sed 's/G//')

    if [ "$AVAILABLE_SPACE" -ge 10 ]; then
        success "Sufficient disk space available: ${AVAILABLE_SPACE}GB"
    elif [ "$AVAILABLE_SPACE" -ge 5 ]; then
        warning "Low disk space: ${AVAILABLE_SPACE}GB"
    else
        error "Critical: Very low disk space: ${AVAILABLE_SPACE}GB"
        error "Consider freeing up space before migration"
    fi

    echo ""
}

# ===================================================================
# Summary Report
# ===================================================================

generate_summary() {
    separator
    log "Pre-Migration Check Summary"
    separator
    echo ""

    log "Environment:        ${YELLOW}${ENVIRONMENT}${NC}"
    log "Timestamp:          $(date +'%Y-%m-%d %H:%M:%S')"
    log "Log file:           $LOG_FILE"
    echo ""

    success "All pre-migration checks completed"
    echo ""

    if [ "$ENVIRONMENT" = "production" ] || [ "$ENVIRONMENT" = "staging" ]; then
        separator
        warning "PRODUCTION/STAGING MIGRATION CHECKLIST"
        separator
        echo ""
        echo "Before running migration, ensure:"
        echo "  [ ] Database backup has been created"
        echo "  [ ] All pending migrations have been reviewed"
        echo "  [ ] No long-running queries are active"
        echo "  [ ] Application health is verified"
        echo "  [ ] Rollback plan is documented"
        echo "  [ ] Team has been notified"
        echo ""
        log "To proceed with migration, run:"
        log "  ${GREEN}./scripts/db-migrate-prod.sh${NC}"
        echo ""
    else
        log "To apply migrations, run:"
        log "  ${GREEN}cd $BACKEND_DIR && npx prisma migrate deploy${NC}"
        echo ""
    fi

    separator
}

# ===================================================================
# Main Execution
# ===================================================================

main() {
    # Run all checks
    preflight_checks
    load_environment
    test_connection
    check_migration_status
    check_schema_drift
    validate_migration_files
    check_disk_space

    if [ "$ENVIRONMENT" != "development" ]; then
        verify_backup
        check_app_health
        check_database_locks
    fi

    generate_summary
}

# Execute main function
main

exit 0
