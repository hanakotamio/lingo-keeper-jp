# Monitoring Architecture - Lingo Keeper JP

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER TRAFFIC                                 │
└────────────────────────────┬────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    FRONTEND (Vercel)                                 │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Monitoring Components:                                       │  │
│  │  • Vercel Analytics (Core Web Vitals, Page Views)           │  │
│  │  • Sentry (Error Tracking, Session Replay)                  │  │
│  │  • Custom Events (User Actions)                             │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────────────────┬────────────────────────────────────────┘
                              │
                              │ HTTPS
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                   BACKEND (Cloud Run)                                │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Health Check Endpoints:                                      │  │
│  │  • /api/health          - Liveness probe                     │  │
│  │  • /api/health/detailed - Full system status                 │  │
│  │  • /api/health/ready    - Readiness probe                    │  │
│  │  • /api/health/live     - Simple liveness                    │  │
│  │  • /api/metrics         - Prometheus metrics                 │  │
│  └──────────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Monitoring Middleware:                                       │  │
│  │  • Request ID tracking                                        │  │
│  │  • Performance monitoring (latency tracking)                 │  │
│  │  • Error rate monitoring                                     │  │
│  │  • Metrics collection (Prometheus)                           │  │
│  └──────────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Application Monitors:                                        │  │
│  │  • Database query monitor                                    │  │
│  │  • External API monitor (OpenAI, Google TTS)                │  │
│  └──────────────────────────────────────────────────────────────┘  │
└─────────────────┬──────────────────┬────────────────────────────────┘
                  │                  │
                  │                  │ DB Queries
                  │                  ▼
                  │         ┌─────────────────────┐
                  │         │  DATABASE (Neon)    │
                  │         │  ┌───────────────┐  │
                  │         │  │ Monitoring:   │  │
                  │         │  │ • OpenTelemetry│ │
                  │         │  │ • Connection   │  │
                  │         │  │   Pool Metrics │  │
                  │         │  │ • Query Perf  │  │
                  │         │  └───────────────┘  │
                  │         └─────────────────────┘
                  │
                  │ External API Calls
                  ▼
         ┌──────────────────┐
         │  External APIs:  │
         │  • OpenAI        │
         │  • Google TTS    │
         └──────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                  OBSERVABILITY PLATFORM                              │
│                   (Google Cloud Monitoring)                          │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Metrics Collection:                                          │  │
│  │  • Cloud Run Infrastructure Metrics                          │  │
│  │  • Prometheus Custom Metrics (/api/metrics)                  │  │
│  │  • Log-Based Metrics (error patterns)                        │  │
│  └──────────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Dashboards:                                                  │  │
│  │  • Cloud Run Dashboard (Infrastructure)                      │  │
│  │  • Application Metrics Dashboard (Custom)                    │  │
│  │  • SLO Dashboard (Service Level Objectives)                  │  │
│  └──────────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Alert Policies:                                              │  │
│  │  • High Error Rate (> 5%)                                    │  │
│  │  • High Latency (P95 > 1s)                                   │  │
│  │  • High CPU/Memory (> 90%)                                   │  │
│  │  • Database Connection Failures                              │  │
│  │  • Deployment Failures                                       │  │
│  │  • Low Availability (< 99.5%)                                │  │
│  └──────────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Logging:                                                     │  │
│  │  • Structured JSON logs                                      │  │
│  │  • Request tracing (Request ID)                              │  │
│  │  • Error aggregation                                         │  │
│  │  • Sensitive data masking                                    │  │
│  └──────────────────────────────────────────────────────────────┘  │
└───────────────────────┬──────────────────────────────────────────────┘
                        │
                        │ Alerts
                        ▼
┌─────────────────────────────────────────────────────────────────────┐
│                  NOTIFICATION CHANNELS                               │
│  ┌─────────────┐  ┌──────────┐  ┌───────────┐  ┌──────────────┐   │
│  │   Slack     │  │  Email   │  │ PagerDuty │  │   SMS        │   │
│  │  #alerts    │  │  Team    │  │ On-Call   │  │ Critical     │   │
│  └─────────────┘  └──────────┘  └───────────┘  └──────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

## Metric Flow

### Infrastructure Metrics (Automatic)

```
Cloud Run → Cloud Monitoring
  ├── Request Count
  ├── Request Latency (P50, P95, P99)
  ├── Error Rate (by status code)
  ├── CPU Utilization
  ├── Memory Utilization
  └── Instance Count
```

### Application Metrics (Custom - Prometheus)

```
Application → /api/metrics → Cloud Monitoring
  ├── http_requests_total (Counter)
  ├── http_request_duration_seconds (Histogram)
  ├── database_queries_total (Counter)
  ├── active_connections (Gauge)
  ├── process_resident_memory_bytes (Gauge)
  └── nodejs_heap_size_used_bytes (Gauge)
```

### Frontend Metrics

```
User Browser → Vercel Analytics
  ├── LCP (Largest Contentful Paint)
  ├── FID (First Input Delay)
  ├── CLS (Cumulative Layout Shift)
  ├── FCP (First Contentful Paint)
  └── TTFB (Time to First Byte)

User Browser → Sentry
  ├── JavaScript Errors
  ├── Unhandled Rejections
  ├── Performance Transactions
  └── Session Replays
```

### Database Metrics

```
Neon PostgreSQL → OpenTelemetry → Observability Platform
  ├── Active Connections
  ├── Query Duration
  ├── Connection Pool Metrics
  │   ├── Pooler Client Connections
  │   └── Pooler Server Connections
  └── Database Size
```

## Alert Flow

### Critical Path (< 5 minutes)

```
Event Detection → Alert Policy → Multi-Window Analysis → Notification

Example: High Error Rate
  1. Error rate > 5% detected
  2. Alert policy triggered (5-minute window + 1-hour window)
  3. Both windows exceed threshold
  4. Send notification to Slack + PagerDuty
  5. Page on-call engineer
```

### Warning Path (< 30 minutes)

```
Event Detection → Alert Policy → Ticket Creation

Example: Elevated Latency
  1. P95 latency > 500ms detected
  2. Alert policy triggered (30-minute window)
  3. Sustained for 10 minutes
  4. Send notification to Slack + Email
  5. Create ticket for investigation
```

## SLO Architecture

### Availability SLO (99.5%)

```
┌─────────────────────────────────────────┐
│  Target: 99.5% availability             │
│  Error Budget: 0.5% = 3.6 hours/month  │
│  Window: 30-day rolling                 │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│  SLI Measurement:                       │
│  Non-5xx Requests / Total Requests      │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│  Multi-Burn-Rate Alerts:                │
│  • Fast burn (1h): 14.4x rate           │
│  • Slow burn (1d): 3x rate              │
└─────────────────────────────────────────┘
```

### Latency SLO (95% < 500ms)

```
┌─────────────────────────────────────────┐
│  Target: 95% requests < 500ms           │
│  Error Budget: 5%                       │
│  Window: 30-day rolling                 │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│  SLI Measurement:                       │
│  Requests < 500ms / Total Requests      │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│  P95 Latency Tracking:                  │
│  • Good: < 200ms                        │
│  • Warning: 200-500ms                   │
│  • Critical: > 500ms                    │
└─────────────────────────────────────────┘
```

## Data Retention

```
Component          Retention Period    Notes
─────────────────────────────────────────────────────────────
Cloud Run Metrics  60 days            Standard GCP retention
Prometheus Metrics 15 days            Can be extended
Application Logs   30 days (INFO)     Configurable by severity
                   90 days (WARN)
                   180 days (ERROR)
Sentry Events      90 days (free)     Based on plan
                   Unlimited (paid)
Vercel Analytics   Unlimited          Included in plan
Database Metrics   90 days            Neon retention
```

## Monitoring Costs Estimate

### Google Cloud Monitoring

```
Component                  Usage                Cost/Month
─────────────────────────────────────────────────────────────
Logs Ingestion            ~500 MB/month         $0 (Free tier)
Custom Metrics            ~20 series            $0 (Free tier)
Uptime Checks            1 check               $0 (Free tier)
Alert Notifications      ~100/month            $0
─────────────────────────────────────────────────────────────
Total                                           ~$0 - $10/month
```

### Sentry (Optional)

```
Plan                Error Events/month    Cost/Month
─────────────────────────────────────────────────────
Developer (Free)    5,000                 $0
Team                50,000                $26
Business            100,000+              Custom
```

### Vercel Analytics

```
Plan            Features                     Cost/Month
──────────────────────────────────────────────────────────
Hobby           Core Web Vitals              $0 (Included)
Pro             + Custom Events              $20/user
Enterprise      Advanced Analytics           Custom
```

## Scaling Considerations

### Current Load (MVP)

```
Metric                  Current        Max Capacity
─────────────────────────────────────────────────────────
Requests/second        ~10            ~1000 (Cloud Run)
Concurrent Users       ~100           ~10,000
Database Connections   ~10            ~100 (Neon)
Response Time (P95)    ~150ms         < 500ms (SLO)
Error Rate             ~0.1%          < 0.5% (SLO)
```

### Future Scaling (Phase 2+)

```
When to Scale:
  • Requests/sec > 500 (sustained)
  • P95 latency > 300ms (sustained)
  • CPU > 70% (sustained)
  • Memory > 75% (sustained)
  • Database connections > 80

How to Scale:
  • Increase Cloud Run CPU/Memory
  • Increase Cloud Run max instances
  • Upgrade Neon plan for more connections
  • Add caching layer (Redis)
  • Optimize database queries
  • Add CDN for static assets
```

## Security & Compliance

### Data Privacy

```
PII Handling:
  • Logs: Automatic masking of passwords, tokens, API keys
  • Sentry: User IDs hashed, no email/name collection
  • Metrics: Aggregated only, no user-specific data
  • Database: Encrypted at rest and in transit (Neon)
```

### Access Control

```
Component               Access Level        Who
───────────────────────────────────────────────────────
Cloud Monitoring        Admin               DevOps Team
                        Viewer              All Developers
Sentry                  Admin               Lead Developer
                        Member              All Developers
Neon Database           Owner               DevOps Lead
                        Admin               Senior Devs
Vercel                  Owner               DevOps Lead
                        Member              All Developers
```

## Integration Points

### Current Integrations

- Google Cloud Run → Cloud Monitoring (automatic)
- Application → Prometheus → Cloud Monitoring
- Neon → OpenTelemetry → Cloud Monitoring
- Frontend → Vercel Analytics (automatic)
- Frontend → Sentry (manual setup)

### Future Integrations (Optional)

- GitHub → Deployment tracking in Sentry
- Slack → ChatOps for incident management
- PagerDuty → On-call rotation management
- StatusPage → Public status dashboard
- New Relic/Datadog → Alternative APM platform

---

**Created**: 2026-01-24
**Version**: 1.0.0
**Maintained By**: DevOps Team
