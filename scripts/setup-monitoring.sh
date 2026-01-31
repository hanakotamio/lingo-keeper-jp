#!/bin/bash

# Monitoring Setup Script for Lingo Keeper JP
# This script sets up comprehensive monitoring and alerting for the application

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ID="${GCP_PROJECT_ID:-}"
SERVICE_NAME="lingo-keeper-jp-backend"
REGION="asia-northeast1"
MONITORING_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/monitoring"

# Function to print colored output
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    print_info "Checking prerequisites..."

    # Check if gcloud is installed
    if ! command -v gcloud &> /dev/null; then
        print_error "gcloud CLI is not installed. Please install it first."
        exit 1
    fi

    # Check if PROJECT_ID is set
    if [ -z "$PROJECT_ID" ]; then
        print_error "GCP_PROJECT_ID environment variable is not set."
        print_info "Usage: GCP_PROJECT_ID=your-project-id ./scripts/setup-monitoring.sh"
        exit 1
    fi

    # Verify gcloud is authenticated
    if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" &> /dev/null; then
        print_error "Not authenticated with gcloud. Run: gcloud auth login"
        exit 1
    fi

    # Set the project
    gcloud config set project "$PROJECT_ID"

    print_info "Prerequisites check completed."
}

# Enable required APIs
enable_apis() {
    print_info "Enabling required APIs..."

    apis=(
        "monitoring.googleapis.com"
        "logging.googleapis.com"
        "cloudtrace.googleapis.com"
        "cloudprofiler.googleapis.com"
        "run.googleapis.com"
    )

    for api in "${apis[@]}"; do
        print_info "Enabling $api..."
        gcloud services enable "$api" --project="$PROJECT_ID" || print_warning "Failed to enable $api"
    done

    print_info "APIs enabled successfully."
}

# Create notification channels
create_notification_channels() {
    print_info "Setting up notification channels..."

    # Check if SLACK_WEBHOOK_URL is set
    if [ -n "$SLACK_WEBHOOK_URL" ]; then
        print_info "Creating Slack notification channel..."

        # Create Slack notification channel
        gcloud alpha monitoring channels create \
            --display-name="Lingo Keeper JP - Slack Alerts" \
            --type=slack \
            --channel-labels=url="$SLACK_WEBHOOK_URL",channel_name="#lingo-keeper-alerts" \
            --project="$PROJECT_ID" \
            2>/dev/null || print_warning "Slack channel may already exist"
    else
        print_warning "SLACK_WEBHOOK_URL not set. Skipping Slack notification channel."
    fi

    # Check if EMAIL is set
    if [ -n "$ALERT_EMAIL" ]; then
        print_info "Creating email notification channel..."

        gcloud alpha monitoring channels create \
            --display-name="Lingo Keeper JP - Email Alerts" \
            --type=email \
            --channel-labels=email_address="$ALERT_EMAIL" \
            --project="$PROJECT_ID" \
            2>/dev/null || print_warning "Email channel may already exist"
    else
        print_warning "ALERT_EMAIL not set. Skipping email notification channel."
    fi

    print_info "Notification channels setup completed."
}

# Create dashboards
create_dashboards() {
    print_info "Creating monitoring dashboards..."

    # Cloud Run Dashboard
    if [ -f "$MONITORING_DIR/dashboards/cloud-run-dashboard.json" ]; then
        print_info "Creating Cloud Run dashboard..."

        gcloud monitoring dashboards create \
            --config-from-file="$MONITORING_DIR/dashboards/cloud-run-dashboard.json" \
            --project="$PROJECT_ID" \
            2>/dev/null || print_warning "Cloud Run dashboard may already exist"
    fi

    # Application Metrics Dashboard
    if [ -f "$MONITORING_DIR/dashboards/application-metrics-dashboard.json" ]; then
        print_info "Creating Application Metrics dashboard..."

        gcloud monitoring dashboards create \
            --config-from-file="$MONITORING_DIR/dashboards/application-metrics-dashboard.json" \
            --project="$PROJECT_ID" \
            2>/dev/null || print_warning "Application Metrics dashboard may already exist"
    fi

    print_info "Dashboards created successfully."
}

# Create alert policies
create_alert_policies() {
    print_info "Creating alert policies..."

    # Note: This requires the alert policies to be in individual JSON files
    # The YAML file needs to be split or converted to JSON

    print_warning "Alert policies creation from YAML not yet implemented."
    print_info "Please manually create alert policies using the Google Cloud Console or convert YAML to JSON."
    print_info "Alert policy configurations are available in: $MONITORING_DIR/alerts/alert-policies.yaml"
}

# Set up uptime checks
create_uptime_checks() {
    print_info "Creating uptime checks..."

    # Get the Cloud Run service URL
    SERVICE_URL=$(gcloud run services describe "$SERVICE_NAME" \
        --region="$REGION" \
        --project="$PROJECT_ID" \
        --format="value(status.url)" 2>/dev/null || echo "")

    if [ -z "$SERVICE_URL" ]; then
        print_warning "Could not find Cloud Run service URL. Skipping uptime checks."
        return
    fi

    print_info "Setting up uptime check for: $SERVICE_URL/api/health"

    # Create uptime check
    gcloud monitoring uptime create \
        --display-name="Lingo Keeper JP - Health Check" \
        --resource-type=uptime-url \
        --monitored-resource="$SERVICE_URL/api/health" \
        --http-check \
        --period=60 \
        --timeout=10s \
        --project="$PROJECT_ID" \
        2>/dev/null || print_warning "Uptime check may already exist"

    print_info "Uptime checks created successfully."
}

# Configure log-based metrics
create_log_metrics() {
    print_info "Creating log-based metrics..."

    # Error rate metric
    gcloud logging metrics create error_rate \
        --description="Rate of error logs" \
        --log-filter='severity >= ERROR' \
        --project="$PROJECT_ID" \
        2>/dev/null || print_warning "error_rate metric may already exist"

    # Database connection errors
    gcloud logging metrics create database_connection_errors \
        --description="Database connection errors" \
        --log-filter='jsonPayload.message =~ ".*database.*connection.*error.*"' \
        --project="$PROJECT_ID" \
        2>/dev/null || print_warning "database_connection_errors metric may already exist"

    # External API failures
    gcloud logging metrics create external_api_failures \
        --description="External API call failures" \
        --log-filter='jsonPayload.message =~ ".*(OpenAI|Google TTS).*error.*"' \
        --project="$PROJECT_ID" \
        2>/dev/null || print_warning "external_api_failures metric may already exist"

    print_info "Log-based metrics created successfully."
}

# Set up Cloud Trace
setup_cloud_trace() {
    print_info "Setting up Cloud Trace..."

    # Cloud Trace is automatically enabled for Cloud Run
    # Just verify it's working
    print_info "Cloud Trace is automatically enabled for Cloud Run services."
    print_info "View traces at: https://console.cloud.google.com/traces/list?project=$PROJECT_ID"
}

# Create SLO monitoring (if using Cloud Monitoring SLOs)
create_slos() {
    print_info "Setting up SLO monitoring..."

    print_warning "Automated SLO creation not yet implemented."
    print_info "Please manually create SLOs using the Google Cloud Console."
    print_info "SLO configuration is available in: $MONITORING_DIR/slo-config.yaml"
    print_info "Guide: https://cloud.google.com/stackdriver/docs/solutions/slo-monitoring"
}

# Display summary
display_summary() {
    print_info "========================================="
    print_info "Monitoring Setup Completed!"
    print_info "========================================="
    echo ""
    print_info "Next steps:"
    echo "  1. View dashboards: https://console.cloud.google.com/monitoring/dashboards?project=$PROJECT_ID"
    echo "  2. View alerts: https://console.cloud.google.com/monitoring/alerting?project=$PROJECT_ID"
    echo "  3. Configure notification channels with your Slack/Email"
    echo "  4. Review and customize alert thresholds as needed"
    echo "  5. Set up SLOs manually using the configuration in monitoring/slo-config.yaml"
    echo ""
    print_info "Useful commands:"
    echo "  - View logs: gcloud logging read 'resource.type=cloud_run_revision' --limit 50"
    echo "  - View metrics: gcloud monitoring metrics-descriptors list"
    echo "  - Test health endpoint: curl $SERVICE_URL/api/health/detailed"
    echo ""
    print_info "Documentation: See docs/monitoring-setup.md for more details"
}

# Main execution
main() {
    print_info "Starting monitoring setup for Lingo Keeper JP..."
    echo ""

    check_prerequisites
    enable_apis
    create_notification_channels
    create_dashboards
    create_alert_policies
    create_uptime_checks
    create_log_metrics
    setup_cloud_trace
    create_slos

    echo ""
    display_summary
}

# Run main function
main "$@"
