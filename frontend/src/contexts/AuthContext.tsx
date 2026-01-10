import React, { createContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { AuthState } from '@/types';
import * as authService from '@/services/mockAuthService';

interface AuthContextType extends AuthState {
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'lingo_keeper_token';
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30分

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    token: null,
  });

  const [lastActivity, setLastActivity] = useState<number>(() => Date.now());

  // LocalStorageからトークンを取得してユーザー情報を復元
  const initializeAuth = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      return;
    }

    try {
      const isValid = await authService.validateToken(token);

      if (!isValid) {
        localStorage.removeItem(TOKEN_KEY);
        return;
      }

      const user = await authService.getUserFromToken(token);

      if (user) {
        setAuthState({
          isAuthenticated: true,
          user,
          token,
        });
      } else {
        localStorage.removeItem(TOKEN_KEY);
      }
    } catch (error) {
      console.error('認証初期化エラー:', error);
      localStorage.removeItem(TOKEN_KEY);
    }
  }, []);

  // ログイン
  const login = useCallback(
    async (email: string, password: string, rememberMe: boolean = false) => {
      const { user, token } = await authService.login(email, password, rememberMe);

      setAuthState({
        isAuthenticated: true,
        user,
        token,
      });

      localStorage.setItem(TOKEN_KEY, token);
      setLastActivity(Date.now());
    },
    []
  );

  // ログアウト
  const logout = useCallback(async () => {
    try {
      await authService.logout();
      setAuthState({
        isAuthenticated: false,
        user: null,
        token: null,
      });
      localStorage.removeItem(TOKEN_KEY);
    } catch (error) {
      console.error('ログアウトエラー:', error);
    }
  }, []);

  // 認証状態をリフレッシュ
  const refreshAuth = useCallback(async () => {
    const { token } = authState;

    if (!token) {
      return;
    }

    try {
      const newToken = await authService.refreshToken(token);
      const user = await authService.getUserFromToken(newToken);

      if (user) {
        setAuthState({
          isAuthenticated: true,
          user,
          token: newToken,
        });
        localStorage.setItem(TOKEN_KEY, newToken);
        setLastActivity(Date.now());
      }
    } catch (error) {
      console.error('トークンリフレッシュエラー:', error);
      await logout();
    }
  }, [authState, logout]);

  // セッションタイムアウトチェック
  useEffect(() => {
    const checkSession = () => {
      if (!authState.isAuthenticated) {
        return;
      }

      const elapsed = Date.now() - lastActivity;

      if (elapsed > SESSION_TIMEOUT) {
        logout();
      }
    };

    const interval = setInterval(checkSession, 60 * 1000); // 1分ごとにチェック

    return () => clearInterval(interval);
  }, [authState.isAuthenticated, lastActivity, logout]);

  // ユーザーアクティビティを記録
  useEffect(() => {
    const updateActivity = () => {
      if (authState.isAuthenticated) {
        setLastActivity(Date.now());
      }
    };

    window.addEventListener('mousedown', updateActivity);
    window.addEventListener('keydown', updateActivity);
    window.addEventListener('scroll', updateActivity);

    return () => {
      window.removeEventListener('mousedown', updateActivity);
      window.removeEventListener('keydown', updateActivity);
      window.removeEventListener('scroll', updateActivity);
    };
  }, [authState.isAuthenticated]);

  // 初期化
  useEffect(() => {
    void initializeAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
