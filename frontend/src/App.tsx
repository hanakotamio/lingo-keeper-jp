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
const QuizPage = lazy(() => import('@/pages/QuizPage').then(m => ({ default: m.QuizPage })));
const QuizProgressPage = lazy(() => import('@/pages/QuizProgress/QuizProgressPage').then(m => ({ default: m.QuizProgressPage })));
const BeginnerPage = lazy(() => import('@/pages/Beginner/BeginnerPage').then(m => ({ default: m.BeginnerPage })));
const HiraganaPage = lazy(() => import('@/pages/Beginner/HiraganaPage').then(m => ({ default: m.HiraganaPage })));
const KatakanaPage = lazy(() => import('@/pages/Beginner/KatakanaPage').then(m => ({ default: m.KatakanaPage })));
const PhrasesPage = lazy(() => import('@/pages/Beginner/PhrasesPage').then(m => ({ default: m.PhrasesPage })));
const LevelCheckPage = lazy(() => import('@/pages/Beginner/LevelCheckPage').then(m => ({ default: m.LevelCheckPage })));

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
        <Route path="/story-experience" element={<StoryExperiencePage />} />
        <Route path="/stories" element={<StoriesPage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/quiz-progress" element={<QuizProgressPage />} />
        <Route path="/beginner" element={<BeginnerPage />} />
        <Route path="/beginner/hiragana" element={<HiraganaPage />} />
        <Route path="/beginner/katakana" element={<KatakanaPage />} />
        <Route path="/beginner/phrases" element={<PhrasesPage />} />
        <Route path="/beginner/level-check" element={<LevelCheckPage />} />

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
