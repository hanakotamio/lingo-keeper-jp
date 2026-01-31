# Monitoring and Alerting Setup Guide

## Overview

This document describes the comprehensive monitoring and alerting system for Lingo Keeper JP. The system is designed to ensure high availability, performance, and reliability of the production environment.

## Architecture

### Components

1. **Cloud Run Monitoring**: Infrastructure-level metrics (CPU, memory, request latency, error rates)
2. **Application Metrics**: Custom Prometheus metrics for application-specific monitoring
3. **Health Checks**: Multiple health check endpoints for liveness, readiness, and detailed system status
4. **Alerting**: Multi-channel alerting system with severity-based routing
5. **SLO/SLI Tracking**: Service Level Objectives and Indicators based on Google SRE best practices
6. **Log Aggregation**: Structured logging with automatic sensitive data masking
7. **Tracing**: Distributed tracing with Cloud Trace

## Health Check Endpoints

### Basic Health Check
- **Endpoint**: `GET /api/health`
- **Purpose**: Cloud Run liveness probe
- **Response Time**: < 100ms
- **Checks**: Database connectivity

```bash
curl https://your-backend-url.run.app/api/health
```

### Detailed Health Check
- **Endpoint**: `GET /api/health/detailed`
- **Purpose**: Comprehensive system status
- **Response Time**: < 500ms
- **Checks**: Database, memory, CPU, optional external APIs

```bash
curl https://your-backend-url.run.app/api/health/detailed
curl https://your-backend-url.run.app/api/health/detailed?checkExternal=true
```

### Readiness Check
- **Endpoint**: `GET /api/health/ready`
- **Purpose**: Cloud Run readiness probe
- **Checks**: Database, environment variables

### Liveness Check
- **Endpoint**: `GET /api/health/live`
- **Purpose**: Process health check
- **Checks**: Process uptime

### Metrics Endpoint
- **Endpoint**: `GET /api/metrics`
- **Format**: Prometheus format
- **Metrics**: HTTP requests, latency, database queries, memory, CPU

## Setup Instructions

### 1. Prerequisites

```bash
# Install gcloud CLI
# https://cloud.google.com/sdk/docs/install

# Authenticate
gcloud auth login

# Set project
gcloud config set project YOUR_PROJECT_ID
```

### 2. Run Setup Script

```bash
# Set required environment variables
export GCP_PROJECT_ID="your-project-id"
export ALERT_EMAIL="your-email@example.com"
export SLACK_WEBHOOK_URL="https://hooks.slack.com/services/YOUR/WEBHOOK/URL"

# Run the setup script
./scripts/setup-monitoring.sh
```

### 3. Manual Configuration

#### Create Notification Channels

**Via Console:**
1. Go to Cloud Console > Monitoring > Alerting
2. Click "Edit notification channels"
3. Add email, Slack, PagerDuty, or SMS channels

**Via gcloud:**
```bash
# Email
gcloud alpha monitoring channels create \
  --display-name="Production Alerts" \
  --type=email \
  --channel-labels=email_address="alerts@example.com"

# Slack
gcloud alpha monitoring channels create \
  --display-name="Slack Alerts" \
  --type=slack \
  --channel-labels=url="YOUR_WEBHOOK_URL",channel_name="#alerts"
```

#### Create Alert Policies

Alert policies are defined in `monitoring/alerts/alert-policies.yaml`. To create them:

1. Go to Cloud Console > Monitoring > Alerting
2. Click "Create Policy"
3. Use the configurations from the YAML file as a template
4. Configure notification channels

## Key Metrics

### Infrastructure Metrics (Cloud Run)

| Metric | Description | Warning Threshold | Critical Threshold |
|--------|-------------|-------------------|-------------------|
| Request Latency (P95) | 95th percentile response time | > 500ms | > 1000ms |
| Error Rate | 5xx errors as % of total requests | > 2% | > 5% |
| CPU Utilization | CPU usage percentage | > 70% | > 90% |
| Memory Utilization | Memory usage percentage | > 75% | > 90% |
| Container Instance Count | Number of running instances | N/A | > 10 (scaling issue) |

### Application Metrics (Prometheus)

| Metric | Description | Type |
|--------|-------------|------|
| `http_requests_total` | Total HTTP requests | Counter |
| `http_request_duration_seconds` | Request duration histogram | Histogram |
| `database_queries_total` | Total database queries | Counter |
| `active_connections` | Current active connections | Gauge |
| `process_resident_memory_bytes` | Process memory usage | Gauge |
| `nodejs_heap_size_used_bytes` | Node.js heap usage | Gauge |

### Database Metrics (Neon)

- **Connection Count**: Active database connections
- **Query Duration**: Database query latency
- **Connection Pool**: Pooler client/server connections

Available via:
- Neon Console monitoring page
- OpenTelemetry/Datadog integration
- Custom application metrics

## Service Level Objectives (SLOs)

### Availability SLO
- **Target**: 99.5% uptime
- **Error Budget**: 0.5% = ~3.6 hours/month
- **Measurement**: Percentage of requests returning non-5xx status codes
- **Window**: 30-day rolling window

### Latency SLO
- **Target**: 95% of requests complete within 500ms
- **Error Budget**: 5% = ~36 hours/month
- **Measurement**: P95 request latency
- **Window**: 30-day rolling window

### Database Query Performance
- **Target**: 99% of queries complete within 200ms
- **Error Budget**: 1%
- **Window**: 30-day rolling window

## Alert Configuration

### Alert Severity Levels

1. **Critical** (Page-level)
   - Immediate action required
   - Sent to: PagerDuty, SMS, Slack
   - Examples: High error rate, service down, database unreachable

2. **Warning** (Ticket-level)
   - Action required within business hours
   - Sent to: Email, Slack
   - Examples: Elevated latency, approaching resource limits

3. **Info**
   - Informational only
   - Sent to: Slack, Email (optional)
   - Examples: Deployment notifications, usage reports

### Multi-Window Multi-Burn-Rate Alerts

Based on Google SRE Workbook recommendations:

**Fast Burn (1 hour)**
- Short window: 5 minutes
- Long window: 1 hour
- Burn rate: 14.4x (1% error budget in 1 hour)
- Severity: Critical

**Slow Burn (1 day)**
- Short window: 2 hours
- Long window: 1 day
- Burn rate: 3x (10% error budget in 1 day)
- Severity: Warning

## Dashboards

### Cloud Run Dashboard
- **Purpose**: Infrastructure monitoring
- **Location**: `monitoring/dashboards/cloud-run-dashboard.json`
- **Widgets**:
  - Request count timeline
  - Request latency (P50, P95, P99)
  - Error rate by status code
  - Container instance count
  - CPU/Memory utilization
  - Response code distribution

### Application Metrics Dashboard
- **Purpose**: Application-level monitoring
- **Location**: `monitoring/dashboards/application-metrics-dashboard.json`
- **Widgets**:
  - HTTP request rate by route
  - Request duration histogram
  - Error rate by status code
  - Active connections
  - Database query rate
  - Node.js memory usage
  - Availability scorecard

### Access Dashboards

```bash
# List dashboards
gcloud monitoring dashboards list

# Open in browser
open "https://console.cloud.google.com/monitoring/dashboards?project=$GCP_PROJECT_ID"
```

## Log Management

### Structured Logging

All logs are JSON-formatted with:
- Timestamp (ISO 8601)
- Severity level (debug, info, warn, error)
- Service name
- Request ID (for tracing)
- Metadata (method, route, duration, etc.)

### Log Levels

| Level | When to Use | Retention |
|-------|-------------|-----------|
| DEBUG | Development debugging | 7 days |
| INFO | Normal operations, request logs | 30 days |
| WARN | Potential issues, degraded performance | 90 days |
| ERROR | Errors requiring attention | 180 days |

### Viewing Logs

```bash
# Recent logs
gcloud logging read "resource.type=cloud_run_revision" --limit 50

# Error logs only
gcloud logging read "resource.type=cloud_run_revision AND severity>=ERROR" --limit 20

# Filter by time
gcloud logging read "resource.type=cloud_run_revision AND timestamp>=\"2026-01-24T00:00:00Z\""

# Follow logs in real-time
gcloud logging tail "resource.type=cloud_run_revision"
```

### Log-Based Metrics

Custom metrics created from log patterns:

1. **Error Rate**: Count of ERROR severity logs
2. **Database Connection Errors**: Database-related errors
3. **External API Failures**: OpenAI/Google TTS errors

## Integration with External Services

### Neon PostgreSQL Monitoring

**Setup OpenTelemetry Integration:**
1. Go to Neon Console > Integrations
2. Select "OpenTelemetry" or "Datadog"
3. Configure endpoint and API key
4. Enable metrics export

**Metrics Exported:**
- Active connections
- Query duration
- Connection pool metrics
- Database size

### Vercel Frontend Monitoring

**Setup Vercel Analytics:**
1. Go to Vercel Dashboard > Your Project > Analytics
2. Enable Web Analytics (free tier available)
3. Monitor Core Web Vitals, page views, unique visitors

**Setup Sentry (Recommended):**
1. Install Sentry integration from Vercel Marketplace
2. Configure DSN in Vercel environment variables
3. Add Sentry SDK to frontend code

```bash
# Install Sentry
cd frontend
npm install @sentry/react @sentry/tracing
```

## Incident Response

### Alert Response Workflow

1. **Receive Alert**
   - Review alert details and severity
   - Check dashboard for context

2. **Investigate**
   - Review logs for errors
   - Check recent deployments
   - Verify external dependencies

3. **Mitigate**
   - Apply immediate fix if known
   - Rollback deployment if needed
   - Scale resources if capacity issue

4. **Communicate**
   - Update status page
   - Notify stakeholders
   - Post in incident channel

5. **Resolve**
   - Verify issue is resolved
   - Close alert
   - Document in incident log

6. **Post-Mortem**
   - Conduct blameless post-mortem
   - Identify root cause
   - Create action items

### Runbooks

#### High Error Rate (5xx)

**Symptoms**: > 5% of requests returning 5xx errors

**Common Causes**:
- Database connection issues
- External API failures
- Code bugs in recent deployment
- Resource exhaustion

**Investigation**:
```bash
# Check error logs
gcloud logging read "resource.type=cloud_run_revision AND severity>=ERROR" --limit 50

# Check database health
curl https://your-backend-url.run.app/api/health/detailed

# Check recent deployments
gcloud run revisions list --service=lingo-keeper-jp-backend
```

**Resolution**:
1. Check database connectivity (Neon status)
2. Review recent deployments, rollback if needed
3. Check external API status (OpenAI, Google TTS)
4. Scale resources if CPU/memory saturated

#### High Latency

**Symptoms**: P95 latency > 1000ms

**Common Causes**:
- Slow database queries
- External API slowness
- CPU/memory saturation
- Inefficient code

**Investigation**:
```bash
# Check slow queries in logs
gcloud logging read "resource.type=cloud_run_revision AND jsonPayload.message=~\"Slow.*query\"" --limit 20

# Check resource utilization
gcloud monitoring time-series list --filter='metric.type="run.googleapis.com/container/cpu/utilizations"'
```

**Resolution**:
1. Optimize slow database queries
2. Add caching where appropriate
3. Scale container resources (CPU/memory)
4. Review and optimize hot code paths

#### Database Connection Failures

**Symptoms**: Unable to connect to database

**Common Causes**:
- Neon maintenance window
- Connection limit exceeded
- Network issues
- Invalid DATABASE_URL

**Investigation**:
```bash
# Check Neon status
# Visit: https://neon.tech/status

# Verify DATABASE_URL secret
gcloud secrets versions access latest --secret="DATABASE_URL"

# Check connection pool
curl https://your-backend-url.run.app/api/health/detailed
```

**Resolution**:
1. Wait if Neon maintenance
2. Increase connection pool size if needed
3. Verify DATABASE_URL is correct
4. Contact Neon support if persistent

## Best Practices

### Monitoring

1. **Use Multi-Window Multi-Burn-Rate Alerts**: Reduces alert noise while maintaining fast incident detection
2. **Monitor Error Budgets**: Track SLO compliance over time
3. **Set Realistic Thresholds**: Based on historical data and user expectations
4. **Regular Dashboard Reviews**: Weekly review of trends and patterns
5. **Alert Tuning**: Continuously refine alert thresholds to reduce false positives

### Logging

1. **Use Structured Logs**: Always log in JSON format
2. **Include Context**: Add request ID, user ID, operation name
3. **Mask Sensitive Data**: Automatic masking of passwords, tokens, API keys
4. **Appropriate Log Levels**: Don't log everything at ERROR level
5. **Log Sampling**: Consider sampling high-volume debug logs in production

### Incident Management

1. **Runbooks**: Document common issues and resolutions
2. **Blameless Post-Mortems**: Focus on systems, not individuals
3. **Action Items**: Always create follow-up tasks
4. **Communication**: Keep stakeholders informed
5. **Learn and Improve**: Update monitoring and alerts based on incidents

## Troubleshooting

### Metrics Not Appearing

**Issue**: Custom metrics not showing in Cloud Monitoring

**Solutions**:
1. Verify Prometheus client is installed: `npm list prom-client`
2. Check `/api/metrics` endpoint is accessible
3. Ensure metrics middleware is registered in `index.ts`
4. Wait 1-2 minutes for metrics to propagate

### Alerts Not Firing

**Issue**: Expected alerts are not triggering

**Solutions**:
1. Verify alert policy is enabled
2. Check notification channels are configured
3. Review alert conditions and thresholds
4. Test with intentional threshold violations
5. Check Cloud Logging for alert delivery issues

### Dashboard Widgets Empty

**Issue**: Dashboard widgets show "No data"

**Solutions**:
1. Verify time range is appropriate
2. Check metric type and resource filters
3. Ensure service is generating metrics
4. Verify project ID in dashboard configuration

## Cost Optimization

### Cloud Monitoring Costs

- **Free tier**: 150 MB of logs per month, 50 metric series
- **Paid tier**: $0.50 per MB for logs, $0.258 per metric series

### Cost Reduction Strategies

1. **Log Sampling**: Sample verbose logs in production
2. **Log Retention**: Reduce retention periods for debug logs
3. **Metric Aggregation**: Use recording rules to pre-aggregate
4. **Alert De-duplication**: Group similar alerts
5. **Dashboard Optimization**: Remove unused widgets

## References

- [Cloud Run Monitoring Best Practices](https://cloud.google.com/run/docs/monitoring)
- [Google SRE Workbook - Alerting on SLOs](https://sre.google/workbook/alerting-on-slos/)
- [Prometheus Best Practices](https://prometheus.io/docs/practices/)
- [Neon Monitoring Documentation](https://neon.com/docs/introduction/monitoring)
- [Vercel Analytics](https://vercel.com/docs/analytics)

## Support

For questions or issues:
- **Documentation**: Check this guide and linked resources
- **Cloud Run**: https://cloud.google.com/run/docs/support
- **Neon**: https://neon.tech/docs/introduction/support
- **Internal**: Contact DevOps team

---

**Last Updated**: 2026-01-24
**Version**: 1.0.0
**Maintainer**: DevOps Team
