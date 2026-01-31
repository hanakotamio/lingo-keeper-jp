# Monitoring Quick Reference Guide

## Quick Start

```bash
# Set environment variables
export GCP_PROJECT_ID="your-project-id"
export ALERT_EMAIL="alerts@example.com"
export SLACK_WEBHOOK_URL="https://hooks.slack.com/services/..."

# Run setup script
./scripts/setup-monitoring.sh
```

## Essential Commands

### Health Checks

```bash
# Basic health check
curl https://your-backend.run.app/api/health

# Detailed health check with all metrics
curl https://your-backend.run.app/api/health/detailed?checkExternal=true

# Prometheus metrics
curl https://your-backend.run.app/api/metrics
```

### Logs

```bash
# View recent logs
gcloud logging read "resource.type=cloud_run_revision" --limit 50

# View errors only
gcloud logging read "resource.type=cloud_run_revision AND severity>=ERROR" --limit 20

# Real-time log streaming
gcloud logging tail "resource.type=cloud_run_revision" --format=json

# Filter by time range
gcloud logging read "resource.type=cloud_run_revision AND timestamp>=\"2026-01-24T00:00:00Z\""

# Search for specific errors
gcloud logging read "resource.type=cloud_run_revision AND jsonPayload.message=~\"database.*error\""
```

### Metrics

```bash
# List available metrics
gcloud monitoring metrics-descriptors list --filter="metric.type:run.googleapis.com"

# Get metric values
gcloud monitoring time-series list \
  --filter='metric.type="run.googleapis.com/request_count"' \
  --format=json

# List dashboards
gcloud monitoring dashboards list
```

### Alerts

```bash
# List alert policies
gcloud alpha monitoring policies list

# List notification channels
gcloud alpha monitoring channels list

# Test alert (trigger manually)
gcloud alpha monitoring policies update POLICY_ID --enabled=false
gcloud alpha monitoring policies update POLICY_ID --enabled=true
```

### Service Status

```bash
# Check Cloud Run service status
gcloud run services describe lingo-keeper-jp-backend \
  --region=asia-northeast1 \
  --format="get(status.conditions)"

# List recent revisions
gcloud run revisions list \
  --service=lingo-keeper-jp-backend \
  --region=asia-northeast1 \
  --limit=5
```

## Key Metrics at a Glance

### Infrastructure (Cloud Run)

| Metric | Path | Good | Warning | Critical |
|--------|------|------|---------|----------|
| Latency P95 | `/api/health/detailed` | < 200ms | 200-500ms | > 500ms |
| Error Rate | Logs + Metrics | < 0.1% | 0.1-2% | > 2% |
| CPU | Cloud Console | < 50% | 50-70% | > 70% |
| Memory | Cloud Console | < 60% | 60-75% | > 75% |
| Instances | Cloud Console | 1-3 | 3-5 | > 5 |

### Application (Prometheus)

| Metric Name | Type | Description |
|-------------|------|-------------|
| `http_requests_total` | Counter | Total HTTP requests |
| `http_request_duration_seconds` | Histogram | Request latency |
| `database_queries_total` | Counter | Database queries |
| `active_connections` | Gauge | Active connections |
| `process_resident_memory_bytes` | Gauge | Memory usage |

## SLOs Summary

| SLO | Target | Error Budget | Measurement |
|-----|--------|--------------|-------------|
| Availability | 99.5% | 3.6 hrs/month | Non-5xx responses |
| Latency | 95% < 500ms | 5% | P95 duration |
| DB Queries | 99% < 200ms | 1% | Query latency |

## Alert Response Cheat Sheet

### High Error Rate Alert

```bash
# 1. Check error logs
gcloud logging read "severity>=ERROR" --limit 20

# 2. Check service health
curl https://your-backend.run.app/api/health/detailed

# 3. Check recent deployments
gcloud run revisions list --service=lingo-keeper-jp-backend --limit=5

# 4. Rollback if needed
gcloud run services update-traffic lingo-keeper-jp-backend \
  --to-revisions=PREVIOUS_REVISION=100 \
  --region=asia-northeast1
```

### High Latency Alert

```bash
# 1. Check slow queries
gcloud logging read "jsonPayload.message=~\"Slow.*query\"" --limit 10

# 2. Check resource utilization
gcloud monitoring time-series list \
  --filter='metric.type="run.googleapis.com/container/cpu/utilizations"'

# 3. Check external APIs
curl https://your-backend.run.app/api/health/detailed?checkExternal=true

# 4. Scale if needed
gcloud run services update lingo-keeper-jp-backend \
  --cpu=2 --memory=1Gi \
  --region=asia-northeast1
```

### Database Connection Failures

```bash
# 1. Check Neon status
# Visit: https://neon.tech/status

# 2. Verify DATABASE_URL
gcloud secrets versions access latest --secret="DATABASE_URL"

# 3. Check logs for connection errors
gcloud logging read "jsonPayload.message=~\"database.*connection\"" --limit 10

# 4. Restart service if needed
gcloud run services update lingo-keeper-jp-backend \
  --region=asia-northeast1 \
  --update-env-vars=FORCE_RESTART=$(date +%s)
```

## Dashboard URLs

```bash
# Set your project ID
PROJECT_ID="your-project-id"

# Cloud Monitoring Overview
open "https://console.cloud.google.com/monitoring?project=$PROJECT_ID"

# Cloud Run Metrics
open "https://console.cloud.google.com/run/detail/asia-northeast1/lingo-keeper-jp-backend/metrics?project=$PROJECT_ID"

# Logs Explorer
open "https://console.cloud.google.com/logs/query?project=$PROJECT_ID"

# Trace Explorer
open "https://console.cloud.google.com/traces/list?project=$PROJECT_ID"

# Alerting
open "https://console.cloud.google.com/monitoring/alerting?project=$PROJECT_ID"
```

## Common Prometheus Queries

### Request Rate

```promql
# Requests per second
rate(http_requests_total[5m])

# Requests per second by route
sum(rate(http_requests_total[5m])) by (route)
```

### Latency

```promql
# P95 latency
histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))

# P99 latency
histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m]))

# Average latency
rate(http_request_duration_seconds_sum[5m]) / rate(http_request_duration_seconds_count[5m])
```

### Error Rate

```promql
# Error rate (percentage)
sum(rate(http_requests_total{status_code=~"5.."}[5m])) / sum(rate(http_requests_total[5m])) * 100

# 4xx error rate
sum(rate(http_requests_total{status_code=~"4.."}[5m])) / sum(rate(http_requests_total[5m])) * 100
```

### Availability

```promql
# Success rate (availability)
sum(rate(http_requests_total{status_code!~"5.."}[5m])) / sum(rate(http_requests_total[5m])) * 100
```

## Notification Channels Setup

### Slack

1. Create Slack webhook: https://api.slack.com/messaging/webhooks
2. Add to monitoring:
```bash
gcloud alpha monitoring channels create \
  --display-name="Slack Alerts" \
  --type=slack \
  --channel-labels=url="YOUR_WEBHOOK_URL",channel_name="#alerts"
```

### Email

```bash
gcloud alpha monitoring channels create \
  --display-name="Email Alerts" \
  --type=email \
  --channel-labels=email_address="alerts@example.com"
```

### PagerDuty

1. Get integration key from PagerDuty
2. Add to monitoring:
```bash
gcloud alpha monitoring channels create \
  --display-name="PagerDuty" \
  --type=pagerduty \
  --channel-labels=service_key="YOUR_INTEGRATION_KEY"
```

## Troubleshooting

### No Metrics in Dashboard

```bash
# 1. Check metrics endpoint
curl https://your-backend.run.app/api/metrics

# 2. Verify metrics are being collected
gcloud monitoring time-series list --filter='metric.type:prometheus.googleapis.com'

# 3. Check service logs
gcloud logging read "resource.type=cloud_run_revision AND jsonPayload.message=~\"metrics\"" --limit 10
```

### Alerts Not Firing

```bash
# 1. List alert policies
gcloud alpha monitoring policies list

# 2. Check if policy is enabled
gcloud alpha monitoring policies describe POLICY_ID

# 3. Verify notification channels
gcloud alpha monitoring channels list

# 4. Test notification channel
gcloud alpha monitoring channels verify CHANNEL_ID
```

## Performance Tuning

### Optimize Log Volume

```javascript
// In production, reduce log level
if (process.env.NODE_ENV === 'production') {
  logger.level = 'info'; // Skip debug logs
}
```

### Sample High-Volume Logs

```javascript
// Sample 10% of request logs
if (Math.random() > 0.9) {
  logger.debug('Request details', { ... });
}
```

### Use Recording Rules

```yaml
# Pre-aggregate metrics to reduce query cost
- record: "api:request_rate:5m"
  expr: "sum(rate(http_requests_total[5m]))"
```

## Integration Examples

### Using Database Monitor

```typescript
import { databaseMonitor } from '@/middleware/monitoring.middleware';

// In your repository
const users = await databaseMonitor.trackQuery(
  'getUserById',
  () => prisma.user.findUnique({ where: { id } })
);
```

### Using External API Monitor

```typescript
import { externalApiMonitor } from '@/middleware/monitoring.middleware';

// Track OpenAI API calls
const response = await externalApiMonitor.trackApiCall(
  'OpenAI',
  'generateQuiz',
  () => openai.chat.completions.create({ ... })
);
```

## Resources

- **Full Documentation**: `docs/monitoring-setup.md`
- **Alert Policies**: `monitoring/alerts/alert-policies.yaml`
- **Dashboards**: `monitoring/dashboards/`
- **Setup Script**: `scripts/setup-monitoring.sh`

---

**Last Updated**: 2026-01-24
