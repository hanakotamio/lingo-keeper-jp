import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'user' | 'admin';
}

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuth();

  // 未認証の場合、ログインページにリダイレクト
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 権限チェック（必要な場合）
  if (requiredRole && user?.role !== requiredRole && user?.role !== 'admin') {
    // 管理者は全てのページにアクセス可能
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
