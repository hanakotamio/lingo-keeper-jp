# Frontend Monitoring Setup Guide

## Overview

This guide covers monitoring setup for the Vercel-hosted frontend application, including error tracking, performance monitoring, and user analytics.

## Monitoring Stack

1. **Vercel Analytics**: Core Web Vitals, page views, unique visitors (built-in)
2. **Sentry**: Error tracking, performance monitoring, session replay
3. **Custom Events**: User interaction tracking

## Vercel Analytics Setup

### Enable Vercel Analytics

Vercel Analytics is automatically available for all Vercel deployments.

**Via Vercel Dashboard:**
1. Go to your project in Vercel Dashboard
2. Navigate to "Analytics" tab
3. Enable Web Analytics (free tier available)

**Via Code (Optional - for custom events):**

```bash
cd frontend
npm install @vercel/analytics
```

```typescript
// frontend/src/main.tsx
import { inject } from '@vercel/analytics';

inject(); // Add this before rendering

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### Metrics Tracked

Vercel Analytics automatically tracks:
- **Core Web Vitals**:
  - LCP (Largest Contentful Paint)
  - FID (First Input Delay)
  - CLS (Cumulative Layout Shift)
  - FCP (First Contentful Paint)
  - TTFB (Time to First Byte)
- **Page Views**: Total page loads
- **Unique Visitors**: Distinct users
- **Top Pages**: Most visited routes

## Sentry Setup (Recommended)

### 1. Create Sentry Account

1. Sign up at https://sentry.io
2. Create a new project for "React"
3. Copy the DSN (Data Source Name)

### 2. Install Sentry

```bash
cd frontend
npm install @sentry/react @sentry/tracing
```

### 3. Configure Sentry

Create `frontend/src/lib/sentry.ts`:

```typescript
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

export const initSentry = () => {
  if (process.env.NODE_ENV === 'production') {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      integrations: [
        new BrowserTracing(),
        new Sentry.Replay({
          maskAllText: true,
          blockAllMedia: true,
        }),
      ],

      // Performance Monitoring
      tracesSampleRate: 0.1, // 10% of transactions

      // Session Replay
      replaysSessionSampleRate: 0.1, // 10% of sessions
      replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors

      // Environment
      environment: import.meta.env.MODE,

      // Release tracking
      release: `lingo-keeper-jp-frontend@${import.meta.env.VITE_APP_VERSION || '1.0.0'}`,

      // Ignore certain errors
      ignoreErrors: [
        'ResizeObserver loop limit exceeded',
        'Non-Error promise rejection captured',
      ],

      // Scrub sensitive data
      beforeSend(event, hint) {
        // Remove sensitive data from error events
        if (event.request?.cookies) {
          delete event.request.cookies;
        }
        if (event.request?.headers?.Authorization) {
          event.request.headers.Authorization = '[Filtered]';
        }
        return event;
      },
    });
  }
};
```

### 4. Initialize in Main App

```typescript
// frontend/src/main.tsx
import { initSentry } from './lib/sentry';

// Initialize Sentry before React
initSentry();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### 5. Wrap Router with Sentry

```typescript
// frontend/src/App.tsx
import * as Sentry from '@sentry/react';
import { BrowserRouter } from 'react-router-dom';

const SentryRoutes = Sentry.withSentryRouting(BrowserRouter);

function App() {
  return (
    <SentryRoutes>
      {/* Your app content */}
    </SentryRoutes>
  );
}
```

### 6. Add Error Boundary

```typescript
// frontend/src/components/ErrorBoundary.tsx
import * as Sentry from '@sentry/react';
import { Box, Button, Typography } from '@mui/material';

const ErrorFallback = ({ error, resetError }: { error: Error; resetError: () => void }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      p={3}
    >
      <Typography variant="h4" gutterBottom>
        Oops! Something went wrong
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={3}>
        We've been notified and are working on a fix.
      </Typography>
      <Button variant="contained" onClick={resetError}>
        Try Again
      </Button>
    </Box>
  );
};

export const AppErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Sentry.ErrorBoundary fallback={ErrorFallback} showDialog>
      {children}
    </Sentry.ErrorBoundary>
  );
};
```

Use in App:
```typescript
import { AppErrorBoundary } from './components/ErrorBoundary';

function App() {
  return (
    <AppErrorBoundary>
      {/* Your app */}
    </AppErrorBoundary>
  );
}
```

### 7. Configure Environment Variables

Add to Vercel environment variables:

```bash
# In Vercel Dashboard > Settings > Environment Variables
VITE_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
VITE_APP_VERSION=1.0.0
```

## Custom Event Tracking

### Track User Actions

```typescript
// frontend/src/lib/analytics.ts
import * as Sentry from '@sentry/react';

export const trackEvent = (eventName: string, data?: Record<string, unknown>) => {
  // Sentry breadcrumb
  Sentry.addBreadcrumb({
    category: 'user-action',
    message: eventName,
    data,
    level: 'info',
  });

  // Custom analytics (if using Vercel Analytics with custom events)
  if (window.va) {
    window.va('track', eventName, data);
  }
};

// Usage examples
export const analytics = {
  storyStarted: (storyId: string, storyTitle: string) => {
    trackEvent('Story Started', { storyId, storyTitle });
  },

  storyCompleted: (storyId: string, duration: number) => {
    trackEvent('Story Completed', { storyId, duration });
  },

  quizAnswered: (quizId: string, isCorrect: boolean) => {
    trackEvent('Quiz Answered', { quizId, isCorrect });
  },

  ttsUsed: (language: string, textLength: number) => {
    trackEvent('TTS Used', { language, textLength });
  },

  errorOccurred: (errorType: string, context: string) => {
    Sentry.captureMessage(`${errorType}: ${context}`, 'error');
  },
};
```

### Use in Components

```typescript
import { analytics } from '@/lib/analytics';

const StoryPage = () => {
  useEffect(() => {
    if (story) {
      analytics.storyStarted(story.id, story.title);
    }
  }, [story]);

  const handleComplete = () => {
    const duration = Date.now() - startTime;
    analytics.storyCompleted(story.id, duration);
  };
};
```

## Performance Monitoring

### Track Component Performance

```typescript
import * as Sentry from '@sentry/react';

// Wrap expensive components
const StoryViewer = Sentry.withProfiler(StoryViewerComponent, {
  name: 'StoryViewer',
});
```

### Custom Performance Metrics

```typescript
// frontend/src/lib/performance.ts
import * as Sentry from '@sentry/react';

export const measurePerformance = (name: string, fn: () => void | Promise<void>) => {
  const transaction = Sentry.startTransaction({
    name,
    op: 'custom',
  });

  const span = transaction.startChild({
    op: 'function',
    description: name,
  });

  try {
    const result = fn();
    if (result instanceof Promise) {
      return result.finally(() => {
        span.finish();
        transaction.finish();
      });
    }
    span.finish();
    transaction.finish();
    return result;
  } catch (error) {
    span.finish();
    transaction.finish();
    throw error;
  }
};

// Usage
await measurePerformance('Load Story Content', async () => {
  const story = await fetchStory(id);
  setState(story);
});
```

## Monitoring Dashboard

### Sentry Dashboard

Access at: https://sentry.io/organizations/your-org/projects/

**Key Views:**
- **Issues**: All errors and exceptions
- **Performance**: Transaction performance, slow endpoints
- **Releases**: Track deployments and error rates per release
- **Alerts**: Configure notifications for error spikes

### Vercel Analytics Dashboard

Access at: https://vercel.com/your-team/your-project/analytics

**Metrics:**
- Real User Monitoring (RUM)
- Core Web Vitals scores
- Geographic distribution
- Device/browser breakdown

## Alert Configuration

### Sentry Alerts

**Create Alert Rules:**
1. Go to Sentry > Alerts
2. Create new alert rule
3. Configure conditions:

**Example Alert: High Error Rate**
```yaml
When: Error rate exceeds 5%
Over: 1 hour
Send notification to: Slack, Email
```

**Example Alert: New Issue**
```yaml
When: New error appears for the first time
Send notification to: Slack
Filter: environment = production
```

### Vercel Notifications

Configure in Vercel Dashboard > Settings > Notifications:
- Deployment succeeded/failed
- Performance degradation
- Core Web Vitals threshold violations

## Best Practices

### Error Handling

```typescript
// Wrap API calls with try-catch
const fetchData = async () => {
  try {
    const response = await api.getStories();
    setStories(response);
  } catch (error) {
    Sentry.captureException(error, {
      tags: {
        component: 'StoryList',
        action: 'fetchStories',
      },
      extra: {
        timestamp: new Date().toISOString(),
      },
    });

    // Show user-friendly error
    setError('Failed to load stories. Please try again.');
  }
};
```

### Privacy & GDPR Compliance

```typescript
// Mask user data in Sentry
Sentry.setUser({
  id: hashedUserId, // Use hashed/anonymized ID
  // Don't include email, name, or PII
});

// Scrub sensitive data
beforeSend: (event) => {
  // Remove localStorage data
  if (event.contexts?.localStorage) {
    delete event.contexts.localStorage;
  }
  return event;
}
```

### Performance Budget

Set thresholds for acceptable performance:

```typescript
// frontend/performance-budget.json
{
  "lcp": 2500,      // Largest Contentful Paint (ms)
  "fid": 100,       // First Input Delay (ms)
  "cls": 0.1,       // Cumulative Layout Shift
  "fcp": 1800,      // First Contentful Paint (ms)
  "ttfb": 600       // Time to First Byte (ms)
}
```

## Integration with Backend Monitoring

### Distributed Tracing

Link frontend and backend traces:

```typescript
// Pass trace context in API calls
const fetchStory = async (id: string) => {
  const transaction = Sentry.getCurrentHub().getScope()?.getTransaction();

  const response = await fetch(`/api/stories/${id}`, {
    headers: {
      'sentry-trace': transaction?.toTraceparent() || '',
    },
  });

  return response.json();
};
```

## Cost Optimization

### Sentry

- **Free Tier**: 5,000 errors/month, 10,000 performance events/month
- **Optimization**:
  - Set appropriate sample rates (10% for traces)
  - Filter out known/ignorable errors
  - Use error grouping to reduce unique issues

### Vercel Analytics

- **Free Tier**: Included with all Vercel plans
- **Pro Features**: Advanced filtering, custom events (paid)

## Troubleshooting

### Sentry Not Capturing Errors

1. Verify DSN is correct
2. Check Sentry is initialized before app renders
3. Verify production environment variable is set
4. Check browser console for Sentry errors

### Missing Performance Data

1. Increase `tracesSampleRate` temporarily
2. Verify BrowserTracing integration is enabled
3. Check Sentry quota limits

### Vercel Analytics Not Showing

1. Verify analytics is enabled in project settings
2. Wait 24 hours for initial data collection
3. Check ad blockers aren't blocking analytics

## Resources

- [Sentry React Documentation](https://docs.sentry.io/platforms/javascript/guides/react/)
- [Vercel Analytics Documentation](https://vercel.com/docs/analytics)
- [Core Web Vitals](https://web.dev/vitals/)
- [React Performance Optimization](https://react.dev/learn/render-and-commit)

---

**Last Updated**: 2026-01-24
**Version**: 1.0.0
