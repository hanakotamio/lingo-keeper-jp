# Monitoring System Implementation Checklist

## Overview

This checklist guides you through implementing the comprehensive monitoring and alerting system for Lingo Keeper JP.

## Phase 1: Backend Monitoring (Priority: High)

### 1.1 Health Checks ✅ IMPLEMENTED

- [x] Basic health check endpoint (`/api/health`)
- [x] Detailed health check (`/api/health/detailed`)
- [x] Readiness probe (`/api/health/ready`)
- [x] Liveness probe (`/api/health/live`)
- [x] Prometheus metrics endpoint (`/api/metrics`)

**Files Created:**
- `/backend/src/controllers/health.controller.ts`
- `/backend/src/routes/health.routes.ts`
- `/backend/src/middleware/monitoring.middleware.ts`

**Modified:**
- `/backend/src/index.ts` (added health routes and monitoring middleware)

### 1.2 Cloud Monitoring Setup (Priority: High)

- [ ] Run setup script: `./scripts/setup-monitoring.sh`
- [ ] Configure notification channels (Slack, Email)
- [ ] Create dashboards in Cloud Console
- [ ] Set up alert policies
- [ ] Configure uptime checks
- [ ] Create log-based metrics

**Resources:**
- `/scripts/setup-monitoring.sh` (automated setup)
- `/monitoring/dashboards/cloud-run-dashboard.json`
- `/monitoring/dashboards/application-metrics-dashboard.json`
- `/monitoring/alerts/alert-policies.yaml`

**Manual Steps:**
1. Set environment variables:
   ```bash
   export GCP_PROJECT_ID="your-project-id"
   export ALERT_EMAIL="alerts@example.com"
   export SLACK_WEBHOOK_URL="https://hooks.slack.com/..."
   ```

2. Run setup:
   ```bash
   ./scripts/setup-monitoring.sh
   ```

3. Configure notification channels in Cloud Console

4. Create alert policies from YAML templates

### 1.3 SLO/SLI Configuration (Priority: Medium)

- [ ] Review SLO targets in `monitoring/slo-config.yaml`
- [ ] Adjust thresholds based on baseline data
- [ ] Create SLOs in Cloud Console
- [ ] Set up error budget alerts
- [ ] Configure burn rate alerts

**Resource:** `/monitoring/slo-config.yaml`

**Manual Steps:**
1. Collect 1 week of baseline data
2. Review P95 latency, error rate, availability
3. Adjust SLO targets if needed
4. Create SLOs in Cloud Monitoring Console

## Phase 2: Frontend Monitoring (Priority: Medium)

### 2.1 Vercel Analytics

- [ ] Enable Vercel Analytics in dashboard
- [ ] Verify Core Web Vitals tracking
- [ ] Set up performance budgets
- [ ] Configure custom events (optional)

**Resource:** `/docs/frontend-monitoring-setup.md`

### 2.2 Sentry Integration (Recommended)

- [ ] Create Sentry account and project
- [ ] Install Sentry SDK: `npm install @sentry/react @sentry/tracing`
- [ ] Create `/frontend/src/lib/sentry.ts`
- [ ] Initialize Sentry in `main.tsx`
- [ ] Add error boundary component
- [ ] Configure environment variables in Vercel
- [ ] Test error capturing

**Resource:** `/docs/frontend-monitoring-setup.md` (detailed instructions)

**Steps:**
1. Sign up at https://sentry.io
2. Create React project, copy DSN
3. Install dependencies
4. Add initialization code
5. Set `VITE_SENTRY_DSN` in Vercel

### 2.3 Custom Event Tracking

- [ ] Create analytics utility
- [ ] Track story interactions
- [ ] Track quiz completions
- [ ] Track TTS usage
- [ ] Track error events

**Implementation:**
```typescript
// frontend/src/lib/analytics.ts
export const analytics = {
  storyStarted: (storyId: string) => { /* ... */ },
  quizAnswered: (quizId: string, correct: boolean) => { /* ... */ },
};
```

## Phase 3: Database Monitoring (Priority: Medium)

### 3.1 Neon Integration

- [ ] Enable OpenTelemetry/Datadog in Neon Console
- [ ] Configure metrics export
- [ ] Monitor connection pool metrics
- [ ] Set up query performance tracking
- [ ] Configure database alerts

**Steps:**
1. Go to Neon Console > Integrations
2. Select OpenTelemetry or Datadog
3. Configure endpoint and API key
4. Enable metrics export

### 3.2 Application-Level DB Monitoring

- [ ] Use `databaseMonitor` wrapper for queries
- [ ] Log slow queries (> 200ms)
- [ ] Track query patterns
- [ ] Monitor connection count

**Usage Example:**
```typescript
import { databaseMonitor } from '@/middleware/monitoring.middleware';

const users = await databaseMonitor.trackQuery(
  'getUserById',
  () => prisma.user.findUnique({ where: { id } })
);
```

## Phase 4: Alert Configuration (Priority: High)

### 4.1 Notification Channels

- [ ] Set up Slack webhook
- [ ] Configure email alerts
- [ ] Set up PagerDuty (optional, for on-call)
- [ ] Configure SMS alerts (optional)

**Resource:** `/monitoring/alerts/notification-channels.yaml`

### 4.2 Alert Policies

Review and create these alerts:

**Critical (Page-Level):**
- [ ] High error rate (> 5%)
- [ ] High latency (P95 > 1s)
- [ ] Database connection failures
- [ ] Service down/unavailable

**Warning (Ticket-Level):**
- [ ] Elevated latency (P95 > 500ms)
- [ ] High CPU (> 70%)
- [ ] High memory (> 75%)
- [ ] Elevated error rate (> 2%)

**Info:**
- [ ] Deployment notifications
- [ ] Weekly usage reports

**Resource:** `/monitoring/alerts/alert-policies.yaml`

### 4.3 Alert Testing

- [ ] Test each alert policy
- [ ] Verify notification delivery
- [ ] Document runbooks
- [ ] Train team on response procedures

## Phase 5: Documentation & Training (Priority: Low)

### 5.1 Documentation Review

- [x] Monitoring setup guide created
- [x] Quick reference guide created
- [x] Frontend monitoring guide created
- [ ] Team review and feedback
- [ ] Update based on actual usage

**Resources:**
- `/docs/monitoring-setup.md`
- `/docs/monitoring-quick-reference.md`
- `/docs/frontend-monitoring-setup.md`
- `/README.monitoring.md`

### 5.2 Team Training

- [ ] Walkthrough of monitoring dashboards
- [ ] Alert response training
- [ ] Incident management procedures
- [ ] Post-mortem process

### 5.3 Runbook Creation

- [ ] High error rate runbook
- [ ] High latency runbook
- [ ] Database failure runbook
- [ ] Deployment failure runbook

**Started in:** `/docs/monitoring-setup.md` (Incident Response section)

## Phase 6: Optimization & Iteration (Ongoing)

### 6.1 Baseline Collection

- [ ] Collect 1 week of metrics
- [ ] Establish baseline for latency
- [ ] Establish baseline for error rates
- [ ] Establish baseline for resource usage

### 6.2 Threshold Tuning

- [ ] Review alert false positives
- [ ] Adjust alert thresholds
- [ ] Optimize sample rates
- [ ] Reduce alert noise

### 6.3 Cost Optimization

- [ ] Review Cloud Monitoring costs
- [ ] Optimize log retention
- [ ] Use log sampling for debug logs
- [ ] Review metric cardinality

### 6.4 Continuous Improvement

- [ ] Monthly dashboard review
- [ ] Quarterly SLO review
- [ ] Update based on incidents
- [ ] Add new metrics as needed

## Quick Start (Do This First)

1. **Deploy Health Checks** (5 minutes)
   ```bash
   # Already implemented in code
   # Just deploy the latest backend
   cd backend
   npm run build
   gcloud run deploy lingo-keeper-jp-backend --source .
   ```

2. **Run Setup Script** (15 minutes)
   ```bash
   export GCP_PROJECT_ID="your-project-id"
   export ALERT_EMAIL="your-email@example.com"
   ./scripts/setup-monitoring.sh
   ```

3. **Verify Health Endpoints** (2 minutes)
   ```bash
   curl https://your-backend.run.app/api/health
   curl https://your-backend.run.app/api/health/detailed
   curl https://your-backend.run.app/api/metrics
   ```

4. **Create Dashboards** (10 minutes)
   - Import `/monitoring/dashboards/cloud-run-dashboard.json`
   - Import `/monitoring/dashboards/application-metrics-dashboard.json`

5. **Set Up Critical Alerts** (15 minutes)
   - High error rate alert
   - Service down alert
   - Database failure alert

## Success Criteria

- ✅ All health endpoints responding
- ✅ Dashboards showing metrics
- ✅ Alerts configured and tested
- ✅ Notification channels working
- ✅ Team trained on incident response
- ✅ Documentation reviewed and approved

## Troubleshooting

### Issue: Metrics not appearing

**Solution:**
1. Check `/api/metrics` endpoint
2. Verify metrics middleware is registered
3. Wait 1-2 minutes for propagation
4. Check Cloud Monitoring ingestion errors

### Issue: Alerts not firing

**Solution:**
1. Verify alert policy is enabled
2. Check notification channels are configured
3. Review thresholds
4. Test with intentional violations

### Issue: High costs

**Solution:**
1. Review log volume and retention
2. Reduce sample rates
3. Use log-based metrics instead of custom metrics
4. Optimize metric cardinality

## Support

- **Documentation**: Start with `/docs/monitoring-setup.md`
- **Quick Reference**: `/docs/monitoring-quick-reference.md`
- **Issues**: Check GitHub issues or contact DevOps team

## Timeline

**Week 1:**
- [x] Implement health checks
- [ ] Deploy to production
- [ ] Run setup script
- [ ] Create basic dashboards

**Week 2:**
- [ ] Configure all alert policies
- [ ] Set up notification channels
- [ ] Test alerts
- [ ] Begin baseline collection

**Week 3:**
- [ ] Add Sentry to frontend
- [ ] Configure Neon monitoring
- [ ] Create runbooks
- [ ] Team training

**Week 4:**
- [ ] Review initial metrics
- [ ] Tune alert thresholds
- [ ] Optimize costs
- [ ] Document learnings

**Ongoing:**
- [ ] Weekly dashboard reviews
- [ ] Monthly SLO reviews
- [ ] Continuous improvement

---

**Created**: 2026-01-24
**Status**: Ready for Implementation
**Owner**: DevOps Team
