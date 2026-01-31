# Monitoring System - Lingo Keeper JP

## Overview

Comprehensive monitoring and alerting system for production environment health tracking.

## Quick Links

- **Full Documentation**: [docs/monitoring-setup.md](./docs/monitoring-setup.md)
- **Quick Reference**: [docs/monitoring-quick-reference.md](./docs/monitoring-quick-reference.md)
- **Alert Policies**: [monitoring/alerts/alert-policies.yaml](./monitoring/alerts/alert-policies.yaml)
- **SLO Configuration**: [monitoring/slo-config.yaml](./monitoring/slo-config.yaml)

## Quick Start

### 1. Run Setup Script

```bash
export GCP_PROJECT_ID="your-project-id"
export ALERT_EMAIL="alerts@example.com"
export SLACK_WEBHOOK_URL="https://hooks.slack.com/services/..."

./scripts/setup-monitoring.sh
```

### 2. Verify Health Endpoints

```bash
# Basic health check
curl https://your-backend.run.app/api/health

# Detailed health check
curl https://your-backend.run.app/api/health/detailed

# Prometheus metrics
curl https://your-backend.run.app/api/metrics
```

### 3. Access Dashboards

Visit the [Google Cloud Console](https://console.cloud.google.com/monitoring) to view:
- Cloud Run metrics dashboard
- Application metrics dashboard
- Alert policies
- Log explorer

## What's Included

### Health Check Endpoints

| Endpoint | Purpose | Used By |
|----------|---------|---------|
| `/api/health` | Basic database connectivity | Cloud Run liveness probe |
| `/api/health/detailed` | Full system status (DB, CPU, memory) | Monitoring dashboards |
| `/api/health/ready` | Readiness check | Cloud Run readiness probe |
| `/api/health/live` | Liveness check | Cloud Run liveness probe |

### Metrics Exported

**Infrastructure (Cloud Run)**:
- Request count and rate
- Request latency (P50, P95, P99)
- Error rate by status code
- CPU and memory utilization
- Container instance count

**Application (Prometheus)**:
- HTTP request metrics (`http_requests_total`)
- Request duration histogram (`http_request_duration_seconds`)
- Database query count (`database_queries_total`)
- Active connections (`active_connections`)
- Node.js memory metrics

### Alert Policies

- **High Error Rate**: > 5% of requests returning 5xx
- **High Latency**: P95 > 1 second
- **High CPU**: > 90% for 10 minutes
- **High Memory**: > 90% for 10 minutes
- **Database Failures**: Health check returning 503
- **Deployment Failures**: Container startup issues
- **Low Availability**: < 99.5% success rate

### Dashboards

1. **Cloud Run Dashboard**: Infrastructure metrics (CPU, memory, latency, errors)
2. **Application Metrics Dashboard**: Custom Prometheus metrics with SLO tracking

### SLOs Defined

| SLO | Target | Error Budget | Window |
|-----|--------|--------------|--------|
| Availability | 99.5% | 3.6 hrs/month | 30 days |
| Latency | 95% < 500ms | 5% | 30 days |
| Database Queries | 99% < 200ms | 1% | 30 days |

## Usage Examples

### Check System Health

```bash
# Quick health check
curl https://your-backend.run.app/api/health

# Detailed health with all checks
curl https://your-backend.run.app/api/health/detailed?checkExternal=true
```

### View Logs

```bash
# Recent logs
gcloud logging read "resource.type=cloud_run_revision" --limit 50

# Error logs only
gcloud logging read "severity>=ERROR" --limit 20

# Real-time streaming
gcloud logging tail "resource.type=cloud_run_revision"
```

### Monitor Metrics

```bash
# View Prometheus metrics
curl https://your-backend.run.app/api/metrics

# Query specific metric via gcloud
gcloud monitoring time-series list \
  --filter='metric.type="run.googleapis.com/request_count"'
```

### Using Monitoring Middleware in Code

```typescript
// Track database queries
import { databaseMonitor } from '@/middleware/monitoring.middleware';

const user = await databaseMonitor.trackQuery(
  'getUserById',
  () => prisma.user.findUnique({ where: { id } })
);

// Track external API calls
import { externalApiMonitor } from '@/middleware/monitoring.middleware';

const response = await externalApiMonitor.trackApiCall(
  'OpenAI',
  'generateQuiz',
  () => openai.chat.completions.create({ ... })
);
```

## Troubleshooting

### Metrics Not Showing

1. Check `/api/metrics` endpoint is accessible
2. Verify metrics middleware is registered
3. Wait 1-2 minutes for metrics to propagate
4. Check Cloud Monitoring for metric ingestion errors

### Alerts Not Firing

1. Verify alert policy is enabled in Console
2. Check notification channels are configured
3. Review alert thresholds
4. Test with intentional violations

### High Error Rate

```bash
# Check recent errors
gcloud logging read "severity>=ERROR" --limit 20

# Check service health
curl https://your-backend.run.app/api/health/detailed

# Rollback if needed
gcloud run services update-traffic lingo-keeper-jp-backend \
  --to-revisions=PREVIOUS_REVISION=100
```

## Integration with External Services

### Neon PostgreSQL

Configure OpenTelemetry integration in Neon Console to export:
- Connection metrics
- Query duration
- Database size

### Vercel Frontend

1. Enable Vercel Analytics for Core Web Vitals
2. Install Sentry for error tracking
3. Configure custom event tracking

### Sentry (Optional)

```bash
npm install @sentry/node @sentry/tracing
```

Add to backend:
```typescript
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.1,
});
```

## Cost Optimization

- **Free Tier**: 150 MB logs/month, 50 metric series
- **Optimization**:
  - Use log sampling for high-volume debug logs
  - Set appropriate log retention periods
  - Use recording rules for pre-aggregated metrics

## Resources

- [Google Cloud Monitoring Documentation](https://cloud.google.com/monitoring/docs)
- [Cloud Run Monitoring Best Practices](https://cloud.google.com/run/docs/monitoring)
- [Prometheus Best Practices](https://prometheus.io/docs/practices/)
- [Google SRE Workbook](https://sre.google/workbook/)
- [Neon Monitoring](https://neon.com/docs/introduction/monitoring)

## Support

For issues or questions:
1. Check [docs/monitoring-setup.md](./docs/monitoring-setup.md)
2. Review [docs/monitoring-quick-reference.md](./docs/monitoring-quick-reference.md)
3. Contact DevOps team

---

**Version**: 1.0.0
**Last Updated**: 2026-01-24
**Maintainer**: DevOps Team
