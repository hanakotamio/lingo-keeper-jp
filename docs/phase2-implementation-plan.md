# Lingo Keeper JP - Phase 2 実装計画書

**作成日**: 2026-01-12
**対象**: Phase 2 機能拡張（認証・ダークモード・音声認識・ソーシャル）
**開始予定**: Phase 1.5完了後（2026-01-12時点で完了）

---

## 📋 Phase 2 概要

Phase 1 MVPで構築した基盤を拡張し、ユーザー体験を大幅に向上させる機能を追加します。

**主要目標**:
1. ✅ ユーザー認証・アカウント管理
2. ✅ 学習データのクラウド同期
3. ✅ ダークモード実装
4. ✅ 音声認識による発音評価
5. ✅ ソーシャル共有機能

---

## 🗓️ 実装スケジュール

### Week 1-2: P0-1 ユーザー認証システム

**目標**: JWT認証によるセキュアな認証システム構築

#### バックエンド実装

**1. データベーススキーマ拡張**
```sql
-- users テーブル追加
CREATE TABLE users (
  user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,  -- bcrypt
  display_name VARCHAR(100),
  avatar_url VARCHAR(500),
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- user_progress テーブル拡張
ALTER TABLE user_progress ADD COLUMN user_id UUID REFERENCES users(user_id);

-- quiz_results テーブル拡張
ALTER TABLE quiz_results ADD COLUMN user_id UUID REFERENCES users(user_id);

-- sessions テーブル（JWT Refresh Token管理）
CREATE TABLE sessions (
  session_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  refresh_token VARCHAR(500) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- インデックス
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_refresh_token ON sessions(refresh_token);
```

**2. 認証ライブラリ導入**
```bash
cd backend
npm install bcrypt jsonwebtoken @types/bcrypt @types/jsonwebtoken
```

**3. 認証ミドルウェア実装**
```typescript
// backend/src/middleware/auth.middleware.ts
import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

export const authenticateJWT = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: 'Access token required',
    });
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      email: string;
    };

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      error: 'Forbidden',
      message: 'Invalid or expired token',
    });
  }
};
```

**4. 認証コントローラー実装**
```typescript
// backend/src/controllers/auth.controller.ts
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/db.js';
import logger from '@/lib/logger.js';

const SALT_ROUNDS = 10;
const ACCESS_TOKEN_EXPIRES = '30m';
const REFRESH_TOKEN_EXPIRES = '7d';

class AuthController {
  // サインアップ
  async signup(req, res) {
    const { email, password, display_name } = req.body;

    try {
      // メールアドレス重複チェック
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        return res.status(409).json({
          success: false,
          error: 'Conflict',
          message: 'Email already registered',
        });
      }

      // パスワードハッシュ化
      const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

      // ユーザー作成
      const user = await prisma.user.create({
        data: { email, password_hash, display_name },
      });

      // トークン生成
      const tokens = this.generateTokens(user.user_id, user.email);

      // Refresh Tokenをデータベースに保存
      await this.saveRefreshToken(user.user_id, tokens.refreshToken);

      logger.info('User signed up', { userId: user.user_id, email });

      res.status(201).json({
        success: true,
        data: {
          user: {
            user_id: user.user_id,
            email: user.email,
            display_name: user.display_name,
          },
          access_token: tokens.accessToken,
          refresh_token: tokens.refreshToken,
        },
      });
    } catch (error) {
      logger.error('Signup failed', { error });
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Signup failed',
      });
    }
  }

  // ログイン
  async login(req, res) {
    const { email, password } = req.body;

    try {
      // ユーザー取得
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
          message: 'Invalid email or password',
        });
      }

      // パスワード確認
      const isValid = await bcrypt.compare(password, user.password_hash);
      if (!isValid) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
          message: 'Invalid email or password',
        });
      }

      // トークン生成
      const tokens = this.generateTokens(user.user_id, user.email);

      // Refresh Tokenを保存
      await this.saveRefreshToken(user.user_id, tokens.refreshToken);

      logger.info('User logged in', { userId: user.user_id, email });

      res.status(200).json({
        success: true,
        data: {
          user: {
            user_id: user.user_id,
            email: user.email,
            display_name: user.display_name,
          },
          access_token: tokens.accessToken,
          refresh_token: tokens.refreshToken,
        },
      });
    } catch (error) {
      logger.error('Login failed', { error });
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Login failed',
      });
    }
  }

  // トークンリフレッシュ
  async refresh(req, res) {
    const { refresh_token } = req.body;

    try {
      // Refresh Token検証
      const decoded = jwt.verify(refresh_token, process.env.JWT_SECRET!) as {
        userId: string;
        email: string;
      };

      // データベースで確認
      const session = await prisma.session.findFirst({
        where: {
          user_id: decoded.userId,
          refresh_token,
          expires_at: { gt: new Date() },
        },
      });

      if (!session) {
        return res.status(403).json({
          success: false,
          error: 'Forbidden',
          message: 'Invalid refresh token',
        });
      }

      // 新しいAccess Token生成
      const accessToken = jwt.sign(
        { userId: decoded.userId, email: decoded.email },
        process.env.JWT_SECRET!,
        { expiresIn: ACCESS_TOKEN_EXPIRES }
      );

      res.status(200).json({
        success: true,
        data: { access_token: accessToken },
      });
    } catch (error) {
      logger.error('Token refresh failed', { error });
      res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: 'Invalid or expired refresh token',
      });
    }
  }

  // ログアウト
  async logout(req, res) {
    const { refresh_token } = req.body;

    try {
      // Refresh Tokenを削除
      await prisma.session.deleteMany({
        where: { refresh_token },
      });

      logger.info('User logged out');

      res.status(200).json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error) {
      logger.error('Logout failed', { error });
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Logout failed',
      });
    }
  }

  // ヘルパーメソッド: トークン生成
  private generateTokens(userId: string, email: string) {
    const accessToken = jwt.sign(
      { userId, email },
      process.env.JWT_SECRET!,
      { expiresIn: ACCESS_TOKEN_EXPIRES }
    );

    const refreshToken = jwt.sign(
      { userId, email },
      process.env.JWT_SECRET!,
      { expiresIn: REFRESH_TOKEN_EXPIRES }
    );

    return { accessToken, refreshToken };
  }

  // ヘルパーメソッド: Refresh Token保存
  private async saveRefreshToken(userId: string, refreshToken: string) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7日後

    await prisma.session.create({
      data: {
        user_id: userId,
        refresh_token: refreshToken,
        expires_at: expiresAt,
      },
    });
  }
}

export const authController = new AuthController();
```

**5. APIルート追加**
```typescript
// backend/src/routes/auth.routes.ts
import express from 'express';
import { authController } from '@/controllers/auth.controller.js';

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);

export default router;
```

**6. 既存APIの保護**
```typescript
// backend/src/index.ts
import authRoutes from '@/routes/auth.routes.js';
import { authenticateJWT } from '@/middleware/auth.middleware.js';

// Public routes
app.use('/api/auth', authRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/stories', storyRoutes); // Phase 2では認証必須にするか検討

// Protected routes
app.use('/api/progress', authenticateJWT, progressRoutes);
app.use('/api/quizzes', authenticateJWT, quizRoutes);
```

#### フロントエンド実装

**1. 認証ライブラリ導入**
```bash
cd frontend
npm install @tanstack/react-query axios
```

**2. 認証Context作成**
```typescript
// frontend/src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  user_id: string;
  email: string;
  display_name?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, displayName?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    // ページ読み込み時にトークンを確認
    const token = localStorage.getItem('access_token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      setAccessToken(token);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
      email,
      password,
    });

    const { user, access_token, refresh_token } = res.data.data;

    setUser(user);
    setAccessToken(access_token);
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const signup = async (email: string, password: string, displayName?: string) => {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/signup`, {
      email,
      password,
      display_name: displayName,
    });

    const { user, access_token, refresh_token } = res.data.data;

    setUser(user);
    setAccessToken(access_token);
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem('refresh_token');

    if (refreshToken) {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {
        refresh_token: refreshToken,
      });
    }

    setUser(null);
    setAccessToken(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  };

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem('refresh_token');

    if (!refreshToken) {
      throw new Error('No refresh token');
    }

    const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/refresh`, {
      refresh_token: refreshToken,
    });

    const { access_token } = res.data.data;

    setAccessToken(access_token);
    localStorage.setItem('access_token', access_token);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

**3. Axios Interceptor設定**
```typescript
// frontend/src/lib/axios.ts
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Request Interceptor: Access Tokenを自動付与
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: 401エラー時にトークンリフレッシュ
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/refresh`, {
          refresh_token: refreshToken,
        });

        const { access_token } = res.data.data;
        localStorage.setItem('access_token', access_token);

        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh Token失敗 → ログアウト
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
```

**4. ログインページ実装**
```typescript
// frontend/src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
} from '@mui/material';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await login(email, password);
      navigate('/stories');
    } catch (err: any) {
      setError(err.response?.data?.message || 'ログインに失敗しました');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={8}>
        <Typography variant="h4" component="h1" mb={3} textAlign="center">
          ログイン
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            label="メールアドレス"
            type="email"
            fullWidth
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
          />
          <TextField
            label="パスワード"
            type="password"
            fullWidth
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            sx={{ mt: 3 }}
          >
            ログイン
          </Button>
        </form>

        <Box mt={2} textAlign="center">
          <Link href="/signup" underline="hover">
            アカウントを作成
          </Link>
        </Box>
      </Box>
    </Container>
  );
};
```

#### テスト

**1. E2Eテスト追加**
```typescript
// frontend/tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should sign up successfully', async ({ page }) => {
    await page.goto('/signup');

    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'TestPassword123');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/stories');
  });

  test('should login successfully', async ({ page }) => {
    await page.goto('/login');

    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'TestPassword123');
    await page.click('button[type="submit"]');

    await expect(page).toHaveURL('/stories');
  });

  test('should logout successfully', async ({ page }) => {
    // ログイン後
    await page.goto('/stories');
    await page.click('[aria-label="ユーザーメニュー"]');
    await page.click('text=ログアウト');

    await expect(page).toHaveURL('/login');
  });
});
```

---

### Week 3: P0-2 学習進捗の永続化

**目標**: LocalStorageからデータベースへ移行

（実装詳細は省略 - phase2-requirements.mdを参照）

---

### Week 4: P1-1 ダークモード

**目標**: Material-UIテーマ切り替え機能実装

（実装詳細は省略）

---

### Week 5-6: P1-2 音声認識（発音評価）

**目標**: Azure Speech Servicesによる発音評価機能

（実装詳細は省略）

---

### Week 7: P2-1 ソーシャル共有機能

**目標**: Twitter/Facebook/LINE共有機能

（実装詳細は省略）

---

### Week 8: P2-2 アクセシビリティ強化

**目標**: WCAG 2.1 Level AA完全準拠

（実装詳細は省略）

---

## 🔗 関連ドキュメント

- [docs/phase2-requirements.md](phase2-requirements.md) - Phase 2要件定義
- [docs/deployment-guide.md](deployment-guide.md) - デプロイ手順
- [docs/developer-guide.md](developer-guide.md) - 開発者ガイド

---

**作成者**: Claude Sonnet 4.5
**最終更新**: 2026-01-12
**ステータス**: 準備完了（Phase 1.5完了後、即座に開始可能）
