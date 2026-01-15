import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import { ProtectedRoute } from '@/components/ProtectedRoute';

// Lazy load all page components for code splitting
const LoginPage = lazy(() => import('@/pages/LoginPage').then(m => ({ default: m.LoginPage })));
const DashboardPage = lazy(() => import('@/pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const StoriesPage = lazy(() => import('@/pages/StoriesPage').then(m => ({ default: m.StoriesPage })));
const ProfilePage = lazy(() => import('@/pages/ProfilePage').then(m => ({ default: m.ProfilePage })));
const AdminPage = lazy(() => import('@/pages/AdminPage').then(m => ({ default: m.AdminPage })));
const StoryExperiencePage = lazy(() => import('@/pages/StoryExperience/StoryExperiencePage').then(m => ({ default: m.StoryExperiencePage })));
const QuizProgressPage = lazy(() => import('@/pages/QuizProgress/QuizProgressPage').then(m => ({ default: m.QuizProgressPage })));

// Loading fallback component
const LoadingFallback = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="100vh"
  >
    <CircularProgress />
  </Box>
);

function App() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* 公開ルート */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/story" element={<StoryExperiencePage />} />
        <Route path="/stories" element={<StoriesPage />} />
        <Route path="/quiz" element={<QuizProgressPage />} />

        {/* 認証が必要なルート */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* 管理者専用ルート */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminPage />
            </ProtectedRoute>
          }
        />

        {/* 404ページ */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
