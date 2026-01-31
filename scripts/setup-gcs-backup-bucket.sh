#!/bin/bash

################################################################################
# Google Cloud Storage Backup Bucket Setup Script
#
# This script creates and configures a GCS bucket for PostgreSQL backups
# with proper lifecycle policies, encryption, and access controls.
#
# Usage:
#   ./setup-gcs-backup-bucket.sh
#
# Prerequisites:
#   - gcloud CLI installed and authenticated
#   - Project ID set in GOOGLE_CLOUD_PROJECT_ID environment variable
#   - Appropriate IAM permissions to create buckets
#
# Author: DevOps Team
# Date: 2026-01-24
################################################################################

set -euo pipefail

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# Configuration
PROJECT_ID="${GOOGLE_CLOUD_PROJECT_ID:-lingo-keeper-jp}"
BUCKET_NAME="${GCS_BACKUP_BUCKET:-lingo-keeper-jp-backups}"
REGION="asia-northeast1"
RETENTION_DAYS=30

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

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  GCS BACKUP BUCKET SETUP"
echo "═══════════════════════════════════════════════════════════"
echo ""

log_info "Configuration:"
log_info "  Project ID: $PROJECT_ID"
log_info "  Bucket Name: $BUCKET_NAME"
log_info "  Region: $REGION"
log_info "  Retention: $RETENTION_DAYS days"
echo ""

# Step 1: Check if gcloud is installed
log_info "Checking prerequisites..."
if ! command -v gsutil &> /dev/null; then
    log_error "gsutil (Google Cloud SDK) is not installed"
    log_info "Install from: https://cloud.google.com/sdk/docs/install"
    exit 1
fi
log_success "Google Cloud SDK found"

# Step 2: Set project
log_info "Setting Google Cloud project to $PROJECT_ID..."
gcloud config set project "$PROJECT_ID"
log_success "Project set to $PROJECT_ID"

# Step 3: Check if bucket exists
log_info "Checking if bucket exists..."
if gsutil ls -b "gs://${BUCKET_NAME}" &> /dev/null; then
    log_warning "Bucket gs://${BUCKET_NAME} already exists"
    log_info "Skipping bucket creation, will update configuration..."
else
    # Step 4: Create bucket
    log_info "Creating GCS bucket: gs://${BUCKET_NAME}..."
    gsutil mb \
        -p "$PROJECT_ID" \
        -c STANDARD \
        -l "$REGION" \
        -b on \
        "gs://${BUCKET_NAME}"
    log_success "Bucket created successfully"
fi

# Step 5: Enable versioning
log_info "Enabling versioning..."
gsutil versioning set on "gs://${BUCKET_NAME}"
log_success "Versioning enabled"

# Step 6: Set lifecycle policy
log_info "Setting lifecycle policy (auto-delete after $RETENTION_DAYS days)..."
cat > /tmp/lifecycle.json <<EOF
{
  "lifecycle": {
    "rule": [
      {
        "action": {
          "type": "Delete"
        },
        "condition": {
          "age": ${RETENTION_DAYS},
          "matchesPrefix": ["backup-"]
        }
      },
      {
        "action": {
          "type": "Delete"
        },
        "condition": {
          "numNewerVersions": 3
        }
      }
    ]
  }
}
EOF

gsutil lifecycle set /tmp/lifecycle.json "gs://${BUCKET_NAME}"
log_success "Lifecycle policy configured"

# Step 7: Set uniform bucket-level access
log_info "Setting uniform bucket-level access..."
gsutil uniformbucketlevelaccess set on "gs://${BUCKET_NAME}"
log_success "Uniform bucket-level access enabled"

# Step 8: Set default encryption (Google-managed)
log_info "Configuring encryption (Google-managed keys)..."
gsutil encryption set -d "gs://${BUCKET_NAME}"
log_success "Encryption configured"

# Note: For customer-managed encryption keys (CMEK), use:
# gsutil encryption set -k projects/PROJECT/locations/LOCATION/keyRings/KEYRING/cryptoKeys/KEY gs://BUCKET

# Step 9: Set IAM policy (restrictive)
log_info "Setting IAM policy..."

# Create temporary IAM policy file
cat > /tmp/bucket-iam-policy.json <<EOF
{
  "bindings": [
    {
      "role": "roles/storage.admin",
      "members": [
        "projectEditor:${PROJECT_ID}",
        "projectOwner:${PROJECT_ID}"
      ]
    },
    {
      "role": "roles/storage.objectViewer",
      "members": [
        "projectViewer:${PROJECT_ID}"
      ]
    }
  ]
}
EOF

gsutil iam set /tmp/bucket-iam-policy.json "gs://${BUCKET_NAME}"
log_success "IAM policy configured"

# Step 10: Enable logging (optional)
log_info "Configuring access logging..."
# Create logging bucket if it doesn't exist
LOGGING_BUCKET="${BUCKET_NAME}-logs"
if ! gsutil ls -b "gs://${LOGGING_BUCKET}" &> /dev/null; then
    gsutil mb -p "$PROJECT_ID" -l "$REGION" "gs://${LOGGING_BUCKET}"
    log_success "Logging bucket created: gs://${LOGGING_BUCKET}"
fi

# Enable logging
gsutil logging set on -b "gs://${LOGGING_BUCKET}" "gs://${BUCKET_NAME}"
log_success "Access logging enabled"

# Step 11: Add labels
log_info "Adding labels..."
gsutil label ch \
    -l environment:production \
    -l purpose:database-backup \
    -l project:lingo-keeper-jp \
    "gs://${BUCKET_NAME}"
log_success "Labels added"

# Step 12: Test upload
log_info "Testing bucket access..."
echo "Test backup file created at $(date)" > /tmp/test-backup.txt
gsutil cp /tmp/test-backup.txt "gs://${BUCKET_NAME}/test-backup.txt"
gsutil rm "gs://${BUCKET_NAME}/test-backup.txt"
rm /tmp/test-backup.txt
log_success "Bucket access test successful"

# Cleanup temporary files
rm -f /tmp/lifecycle.json /tmp/bucket-iam-policy.json

echo ""
echo "═══════════════════════════════════════════════════════════"
log_success "GCS BACKUP BUCKET SETUP COMPLETED"
echo "═══════════════════════════════════════════════════════════"
echo ""
log_info "Bucket Details:"
log_info "  Name: gs://${BUCKET_NAME}"
log_info "  Region: $REGION"
log_info "  Versioning: Enabled"
log_info "  Encryption: Google-managed"
log_info "  Lifecycle: Auto-delete after $RETENTION_DAYS days"
log_info "  Logging: Enabled (gs://${LOGGING_BUCKET})"
echo ""
log_info "Next Steps:"
log_info "1. Create a service account for GitHub Actions:"
log_info "   gcloud iam service-accounts create github-actions-backup \\"
log_info "     --display-name='GitHub Actions Backup Service Account'"
echo ""
log_info "2. Grant storage permissions:"
log_info "   gsutil iam ch \\"
log_info "     serviceAccount:github-actions-backup@${PROJECT_ID}.iam.gserviceaccount.com:roles/storage.objectAdmin \\"
log_info "     gs://${BUCKET_NAME}"
echo ""
log_info "3. Create and download service account key:"
log_info "   gcloud iam service-accounts keys create github-sa-key.json \\"
log_info "     --iam-account=github-actions-backup@${PROJECT_ID}.iam.gserviceaccount.com"
echo ""
log_info "4. Add to GitHub Secrets:"
log_info "   GCP_SERVICE_ACCOUNT_KEY = <contents of github-sa-key.json>"
log_info "   GCS_BACKUP_BUCKET = ${BUCKET_NAME}"
echo ""
log_info "View bucket in Console:"
log_info "  https://console.cloud.google.com/storage/browser/${BUCKET_NAME}"
echo ""
