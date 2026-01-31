# 本番環境セキュリティチェック ベストプラクティス

**最終更新日**: 2026-01-25

## 目次

1. [概要](#概要)
2. [自動化ツール](#自動化ツール)
3. [セキュリティチェック項目](#セキュリティチェック項目)
4. [日本企業の基準](#日本企業の基準)
5. [実装手順](#実装手順)
6. [継続的な監視](#継続的な監視)

---

## 概要

### 対象環境

- **フロントエンド**: Vercel
- **バックエンド**: Google Cloud Run
- **データベース**: Neon PostgreSQL
- **技術スタック**: React + FastAPI + PostgreSQL

### セキュリティレベル

- **現在**: MVPフェーズ（認証なし）
- **目標**: 上場企業レベル（ISO27001基準準拠）

---

## 自動化ツール

### 1. OWASP ZAP（動的セキュリティテスト）

**概要**: Web アプリケーションの脆弱性を自動検出する DAST ツール

**主な機能**:
- SQL インジェクション検出
- XSS（クロスサイトスクリプティング）検出
- CSRF（クロスサイトリクエストフォージェリ）検出
- API セキュリティスキャン（REST/GraphQL）

**使い方**:

```bash
# Docker を使った基本スキャン
docker run -t ghcr.io/zaproxy/zaproxy:stable zap-baseline.py \
  -t https://frontend-seven-beta-72.vercel.app \
  -r zap-report.html

# API スキャン（FastAPI バックエンド）
docker run -t ghcr.io/zaproxy/zaproxy:stable zap-api-scan.py \
  -t https://lingo-keeper-jp-backend-16378814888.asia-northeast1.run.app/api \
  -f openapi \
  -r zap-api-report.html
```

**GitHub Actions 統合**:

```yaml
name: OWASP ZAP Security Scan

on:
  schedule:
    - cron: '0 2 * * 1' # 毎週月曜 2:00 AM
  workflow_dispatch:

jobs:
  zap-scan:
    runs-on: ubuntu-latest
    steps:
      - name: ZAP Baseline Scan
        uses: zaproxy/action-baseline@v0.12.0
        with:
          target: 'https://frontend-seven-beta-72.vercel.app'
          rules_file_name: '.zap/rules.tsv'
          cmd_options: '-a'
```

**参考**:
- [OWASP ZAP Getting Started](https://www.zaproxy.org/getting-started/)
- [Automated Web Security Testing with OWASP ZAP](https://medium.com/@ananthu33369/automated-web-security-testing-with-owasp-zap-ef010fcd3909)

---

### 2. Lighthouse CI（パフォーマンス・アクセシビリティ）

**概要**: パフォーマンス、アクセシビリティ、SEO、ベストプラクティスを自動監査

**主な機能**:
- パフォーマンス監視
- アクセシビリティチェック
- SEO 最適化検証
- セキュリティベストプラクティス

**使い方**:

```bash
# インストール
npm install -g @lhci/cli

# 設定ファイル作成（lighthouserc.json）
{
  "ci": {
    "collect": {
      "url": ["https://frontend-seven-beta-72.vercel.app"],
      "numberOfRuns": 3
    },
    "assert": {
      "preset": "lighthouse:recommended",
      "assertions": {
        "categories:performance": ["error", {"minScore": 0.9}],
        "categories:accessibility": ["error", {"minScore": 0.9}],
        "categories:best-practices": ["error", {"minScore": 0.9}],
        "categories:seo": ["error", {"minScore": 0.9}]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}

# 実行
lhci autorun
```

**GitHub Actions 統合**:

```yaml
name: Lighthouse CI

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install -g @lhci/cli

      - name: Run Lighthouse CI
        run: lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
```

**参考**:
- [Lighthouse CI GitHub](https://github.com/GoogleChrome/lighthouse-ci)
- [Performance Audits with Lighthouse CI & GitHub Actions](https://dev.to/jacobandrewsky/performance-audits-with-lighthouse-ci-github-actions-3g0g)

---

### 3. SecurityHeaders.com（HTTP セキュリティヘッダー）

**概要**: HTTP レスポンスヘッダーのセキュリティを評価

**主な機能**:
- CSP（Content Security Policy）検証
- HSTS（HTTP Strict Transport Security）検証
- X-Frame-Options 検証
- その他セキュリティヘッダー検証

**使い方（API）**:

```bash
# API キーを取得: https://securityheaders.com/api/

# スキャン実行
curl -H "x-api-key: YOUR_API_KEY" \
  "https://api-test.securityheaders.com/?q=frontend-seven-beta-72.vercel.app&hide=on&followRedirects=on"
```

**GitHub Actions 統合**:

```yaml
name: Security Headers Check

on:
  schedule:
    - cron: '0 3 * * *' # 毎日 3:00 AM
  workflow_dispatch:

jobs:
  check-headers:
    runs-on: ubuntu-latest
    steps:
      - name: Check Security Headers
        run: |
          response=$(curl -s -H "x-api-key: ${{ secrets.SECURITY_HEADERS_API_KEY }}" \
            "https://api-test.securityheaders.com/?q=frontend-seven-beta-72.vercel.app&hide=on&followRedirects=on")
          echo "$response"
          grade=$(echo "$response" | jq -r '.grade')
          if [[ "$grade" != "A" && "$grade" != "A+" ]]; then
            echo "Security headers grade is $grade. Expected A or A+."
            exit 1
          fi
```

**参考**:
- [SecurityHeaders.com API Docs](https://test.securityheaders.com/api/docs/)
- [SecurityHeaders.com](https://securityheaders.com/)

---

### 4. SSL Labs（SSL/TLS 設定）

**概要**: SSL/TLS 設定の安全性を評価

**主な機能**:
- 証明書検証
- プロトコルバージョンチェック
- 暗号スイート評価
- 脆弱性検出

**使い方**:

```bash
# ssllabs-scan CLI ツール
# インストール
go install github.com/ssllabs/ssllabs-scan@latest

# スキャン実行
ssllabs-scan --grade --hostcheck \
  frontend-seven-beta-72.vercel.app
```

**注意事項**:
- 商用利用には Qualys の許可が必要
- レート制限あり（キャッシュ結果の活用推奨）

**GitHub Actions 統合**:

```yaml
name: SSL/TLS Check

on:
  schedule:
    - cron: '0 4 * * 0' # 毎週日曜 4:00 AM
  workflow_dispatch:

jobs:
  ssl-check:
    runs-on: ubuntu-latest
    steps:
      - name: Install ssllabs-scan
        run: go install github.com/ssllabs/ssllabs-scan@latest

      - name: Run SSL Labs Scan
        run: |
          ~/go/bin/ssllabs-scan --grade --hostcheck \
            frontend-seven-beta-72.vercel.app > ssl-report.txt
          cat ssl-report.txt

          # A- 以上を要求
          if ! grep -q "Grade: A" ssl-report.txt; then
            echo "SSL grade is not A or higher"
            exit 1
          fi
```

**参考**:
- [SSL Labs Server Test](https://www.ssllabs.com/ssltest/)
- [ssllabs-scan GitHub](https://github.com/ssllabs/ssllabs-scan)

---

## セキュリティチェック項目

### 1. HTTPS/TLS 設定

#### 現在の状態（分析結果）

**Vercel（フロントエンド）**:
- ✅ 自動 HTTPS リダイレクト
- ✅ 無料 SSL 証明書（Let's Encrypt）
- ✅ TLS 1.3 サポート

**Cloud Run（バックエンド）**:
- ✅ デフォルトで HTTPS
- ✅ Google が管理する証明書
- ✅ HTTP/2 サポート

**Neon（データベース）**:
- ✅ SSL/TLS 接続必須
- ✅ AES-256 暗号化（データ保存時）

#### チェック項目

- [ ] TLS 1.2 以上のみ許可
- [ ] 強力な暗号スイート使用
- [ ] 証明書有効期限監視（30 日前に通知）
- [ ] HSTS ヘッダー設定（max-age=31536000）
- [ ] 証明書チェーン検証

---

### 2. セキュリティヘッダー

#### 現在の設定（backend/src/index.ts）

```typescript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
}));
```

#### 推奨設定（強化版）

**Vercel（vercel.json）**:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://lingo-keeper-jp-backend-16378814888.asia-northeast1.run.app; frame-ancestors 'none'; base-uri 'self'; form-action 'self'"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "geolocation=(), microphone=(), camera=(), payment=()"
        },
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains; preload"
        }
      ]
    }
  ]
}
```

**Cloud Run（Express + Helmet）**:

```typescript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"], // MUI 対応
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", "data:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  frameguard: {
    action: 'deny',
  },
  noSniff: true,
  referrerPolicy: {
    policy: 'strict-origin-when-cross-origin',
  },
  permissionsPolicy: {
    features: {
      geolocation: ["'none'"],
      microphone: ["'none'"],
      camera: ["'none'"],
      payment: ["'none'"],
    },
  },
}));
```

#### チェック項目

- [ ] **CSP（Content Security Policy）**: XSS 攻撃防止
- [ ] **HSTS**: HTTPS 強制（max-age=31536000）
- [ ] **X-Frame-Options**: クリックジャッキング防止（DENY）
- [ ] **X-Content-Type-Options**: MIME スニッフィング防止（nosniff）
- [ ] **Referrer-Policy**: リファラー情報制御
- [ ] **Permissions-Policy**: ブラウザ機能制御

---

### 3. CORS 設定

#### 現在の設定（backend/src/index.ts）

```typescript
const allowedOrigins = [
  'http://localhost:3847',
  'https://frontend-seven-beta-72.vercel.app', // Production alias
  /^https:\/\/frontend-[a-z0-9-]+-mio-furumakis-projects\.vercel\.app$/, // Preview deployments
  /^https:\/\/frontend-[a-z0-9-]+\.vercel\.app$/, // All Vercel deployments
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    const isAllowed = allowedOrigins.some(allowed => {
      if (typeof allowed === 'string') return allowed === origin;
      return allowed.test(origin);
    });

    if (isAllowed || process.env.CORS_ORIGIN === '*') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
```

#### 本番環境推奨設定

```typescript
// 環境変数から読み込み
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
  'https://frontend-seven-beta-72.vercel.app',
];

app.use(cors({
  origin: (origin, callback) => {
    // 本番環境では no-origin リクエストを拒否
    if (!origin && process.env.NODE_ENV === 'production') {
      return callback(new Error('Origin required in production'));
    }

    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // 必要なメソッドのみ
  allowedHeaders: ['Content-Type', 'Authorization'], // 必要なヘッダーのみ
  maxAge: 86400, // プリフライトキャッシュ（24時間）
}));
```

#### チェック項目

- [ ] **本番環境でワイルドカード禁止**（`*` 使用禁止）
- [ ] **具体的なオリジン指定**（ドメイン名を明記）
- [ ] **credentials フラグ適切設定**（Cookie 使用時のみ true）
- [ ] **許可メソッド限定**（GET, POST, PUT, DELETE のみ）
- [ ] **許可ヘッダー限定**（必要なもののみ）

**参考**:
- [CORS (Cross-Origin Resource Sharing) - FastAPI](https://fastapi.tiangolo.com/tutorial/cors/)
- [Blocked by CORS in FastAPI? Here's How to Fix It](https://davidmuraya.com/blog/fastapi-cors-configuration/)

---

### 4. 入力値検証

#### チェック項目

- [ ] **SQL インジェクション防止**: Prisma ORM 使用（パラメータ化クエリ）
- [ ] **XSS 防止**: 入力値サニタイゼーション
- [ ] **ファイルアップロード検証**: ファイルタイプ・サイズ制限
- [ ] **レート制限**: API エンドポイントへの過剰リクエスト防止
- [ ] **入力長制限**: 異常に長い入力の拒否

#### 実装例（FastAPI バックエンド）

```python
from pydantic import BaseModel, Field, validator
from typing import Optional

class StoryCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    content: str = Field(..., min_length=1, max_length=10000)
    level_jlpt: str = Field(..., regex="^(N5|N4|N3|N2|N1)$")

    @validator('title', 'content')
    def sanitize_html(cls, v):
        # HTML タグを除去
        import html
        return html.escape(v)
```

#### レート制限実装（Express）

```typescript
import rateLimit from 'express-rate-limit';

// API エンドポイント用レート制限
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分
  max: 100, // 最大100リクエスト
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', apiLimiter);

// 認証エンドポイント用（より厳格）
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 最大5回の試行
  skipSuccessfulRequests: true,
});

app.use('/api/auth/', authLimiter);
```

---

### 5. 認証・認可（Phase 2 以降）

#### 現在の状態

- **MVPフェーズ**: 認証なし（LocalStorage のみ）

#### Phase 2 実装計画

**推奨技術スタック**:
- **JWT（JSON Web Token）**: ステートレス認証
- **OAuth 2.0**: ソーシャルログイン
- **SCRAM-SHA-256**: PostgreSQL 認証（MD5 非推奨）

**チェック項目**:
- [ ] パスワード強度要件（8文字以上、英数字+記号）
- [ ] パスワードハッシュ化（bcrypt または Argon2）
- [ ] セッション管理（有効期限、リフレッシュトークン）
- [ ] ブルートフォース対策（レート制限）
- [ ] 2FA（二要素認証）サポート
- [ ] CSRF トークン実装

**参考**:
- [Neon PostgreSQL: OAuth 2.0 Authentication](https://neon.com/docs/changelog/2026-01-02)
- [PostgreSQL 18: SCRAM-SHA-256](https://neon.com/postgresql/postgresql-18-new-features)

---

### 6. データベースセキュリティ（Neon PostgreSQL）

#### 現在の設定

**接続セキュリティ**:
- ✅ SSL/TLS 接続必須
- ✅ 接続プール（PgBouncer）使用
- ✅ 暗号化（AES-256、保存時）

#### 推奨設定

**IP Allow（本番環境）**:

```bash
# Neon Dashboard で設定
# Cloud Run の送信 IP アドレスのみ許可

# Cloud Run の送信 IP を確認
gcloud run services describe lingo-keeper-jp-backend \
  --region=asia-northeast1 \
  --format='value(status.url)'
```

**Protected Branches（本番 DB）**:

- [ ] 本番ブランチを保護ブランチに設定
- [ ] 削除・リセット禁止
- [ ] パスワード自動ローテーション

**Connection Pooling**:

```typescript
// backend/src/lib/db.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  // 接続プール設定
  log: ['query', 'error', 'warn'],
  connectionLimit: 10, // 最大接続数
});

export default prisma;
```

**Private Networking（Scale プラン）**:

- AWS PrivateLink 経由接続（インターネット経由しない）
- SOC2 Type 2 準拠
- HIPAA 対応

#### チェック項目

- [ ] **SSL/TLS 接続強制**
- [ ] **IP Allow 設定**（Cloud Run IP のみ許可）
- [ ] **Protected Branches**（本番 DB 保護）
- [ ] **接続プール設定**（PgBouncer）
- [ ] **最小権限原則**（アプリケーション用ユーザーは必要最小限の権限）
- [ ] **定期バックアップ**（自動バックアップ有効化）
- [ ] **監査ログ有効化**

**参考**:
- [Neon Security Overview](https://neon.com/docs/security/security-overview)
- [Neon Private Networking](https://neon.com/docs/changelog/2026-01-02)

---

## 日本企業の基準

### ISO27001（ISMS）準拠

#### 概要

**ISO/IEC 27001:2022**（JIS Q 27001:2023）は情報セキュリティマネジメントシステムの国際規格です。

**日本の現状**（2025年12月現在）:
- ISO27001 取得企業: **8,323社**
- 特に IT・システム・ソフトウェア企業が多数取得

#### 2025年改正のポイント

**情報セキュリティ管理基準（令和7年改正版）**:
- 93の管理策（4つのテーマ）
  1. **組織的管理策**
  2. **人的管理策**
  3. **物理的管理策**
  4. **技術的管理策**

#### Web アプリケーション向けチェックリスト

##### 組織的管理策
- [ ] 情報セキュリティポリシーの策定
- [ ] セキュリティインシデント対応手順
- [ ] 定期的なセキュリティ監査（年1回以上）
- [ ] リスクアセスメント実施

##### 技術的管理策
- [ ] アクセス制御（認証・認可）
- [ ] ログ記録と監視
- [ ] データ暗号化（保存時・転送時）
- [ ] 脆弱性管理（定期スキャン）
- [ ] セキュアコーディング規約
- [ ] バックアップと復旧手順

##### 人的管理策
- [ ] セキュリティ教育（開発者向け）
- [ ] 責任の明確化
- [ ] アクセス権限の定期レビュー

##### 物理的管理策
- [ ] データセンターセキュリティ（Neon/GCP が対応）
- [ ] デバイス管理

**参考**:
- [情報セキュリティ管理基準（令和7年改正版）](https://www.meti.go.jp/policy/netsecurity/is-kansa/IS_Management_Standard_R7.pdf)
- [ISO27001内部監査チェックリスト](https://www.iso-mi.com/_p/acre/26359/documents/ISO27001_2022_naibukansa_checklist_sample.pdf)

---

### サプライチェーンセキュリティ（2026年度開始）

#### 経済産業省「サプライチェーン強化に向けたセキュリティ対策評価制度」

**運用開始時期**:
- ★3・★4レベル: 2026年10月～
- ★5レベル: 検討中

**対象企業**:
- 上場企業およびサプライチェーン関連企業

**対応事項**:
- セキュリティ対策の可視化
- 第三者評価の受入
- サプライヤー管理

**参考**:
- [サプライチェーン強化に向けたセキュリティ対策評価制度](https://www.nri-secure.co.jp/blog/security-measures-assessment-system-for-strengthening-the-supply-chain)

---

## 実装手順

### Phase 1: 緊急対応（1週間）

#### 1. セキュリティヘッダー強化

**Vercel（フロントエンド）**:

```bash
# プロジェクトルートに vercel.json 作成
```

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://lingo-keeper-jp-backend-16378814888.asia-northeast1.run.app; frame-ancestors 'none'; base-uri 'self'; form-action 'self'"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "geolocation=(), microphone=(), camera=(), payment=()"
        },
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains; preload"
        }
      ]
    }
  ]
}
```

```bash
# デプロイ
git add vercel.json
git commit -m "Add security headers to Vercel config"
git push
```

**Cloud Run（バックエンド）**:

```typescript
// backend/src/index.ts を更新
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", "data:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  frameguard: {
    action: 'deny',
  },
  noSniff: true,
  referrerPolicy: {
    policy: 'strict-origin-when-cross-origin',
  },
}));
```

```bash
# デプロイ
git add backend/src/index.ts
git commit -m "Enhance security headers in backend"
git push

# Cloud Run 再デプロイ
cd backend
gcloud run deploy lingo-keeper-jp-backend \
  --source . \
  --platform managed \
  --region asia-northeast1 \
  --allow-unauthenticated
```

#### 2. CORS 設定強化

```typescript
// backend/src/index.ts
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [
  'https://frontend-seven-beta-72.vercel.app',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin && process.env.NODE_ENV === 'production') {
      return callback(new Error('Origin required in production'));
    }

    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      logger.warn('CORS blocked', { origin, allowedOrigins });
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
  maxAge: 86400,
}));
```

```bash
# Cloud Run 環境変数設定
gcloud run services update lingo-keeper-jp-backend \
  --region=asia-northeast1 \
  --update-env-vars ALLOWED_ORIGINS=https://frontend-seven-beta-72.vercel.app
```

#### 3. レート制限実装

```bash
# インストール
cd backend
npm install express-rate-limit
```

```typescript
// backend/src/middleware/rate-limit.middleware.ts
import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
});
```

```typescript
// backend/src/index.ts に追加
import { apiLimiter } from '@/middleware/rate-limit.middleware.js';

app.use('/api/', apiLimiter);
```

---

### Phase 2: 自動化セットアップ（2週間）

#### 1. GitHub Actions ワークフロー作成

```bash
mkdir -p .github/workflows
```

**OWASP ZAP スキャン**:

```yaml
# .github/workflows/security-scan.yml
name: Security Scan

on:
  schedule:
    - cron: '0 2 * * 1' # 毎週月曜 2:00 AM
  workflow_dispatch:

jobs:
  owasp-zap-scan:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: ZAP Baseline Scan (Frontend)
        uses: zaproxy/action-baseline@v0.12.0
        with:
          target: 'https://frontend-seven-beta-72.vercel.app'
          cmd_options: '-a'

      - name: ZAP API Scan (Backend)
        run: |
          docker run -t ghcr.io/zaproxy/zaproxy:stable zap-api-scan.py \
            -t https://lingo-keeper-jp-backend-16378814888.asia-northeast1.run.app/api \
            -f openapi \
            -r zap-api-report.html

      - name: Upload ZAP Report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: zap-reports
          path: |
            zap-baseline-report.html
            zap-api-report.html
```

**Lighthouse CI**:

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Install Lighthouse CI
        run: npm install -g @lhci/cli

      - name: Run Lighthouse CI
        run: lhci autorun
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}
```

**Security Headers チェック**:

```yaml
# .github/workflows/security-headers.yml
name: Security Headers Check

on:
  schedule:
    - cron: '0 3 * * *' # 毎日 3:00 AM
  workflow_dispatch:

jobs:
  check-headers:
    runs-on: ubuntu-latest
    steps:
      - name: Check Frontend Headers
        run: |
          response=$(curl -s -H "x-api-key: ${{ secrets.SECURITY_HEADERS_API_KEY }}" \
            "https://api-test.securityheaders.com/?q=frontend-seven-beta-72.vercel.app&hide=on&followRedirects=on")
          echo "$response"
          grade=$(echo "$response" | jq -r '.grade')
          echo "Frontend Security Headers Grade: $grade"
          if [[ "$grade" != "A" && "$grade" != "A+" ]]; then
            echo "::warning::Security headers grade is $grade. Expected A or A+."
          fi

      - name: Check Backend Headers
        run: |
          response=$(curl -s -H "x-api-key: ${{ secrets.SECURITY_HEADERS_API_KEY }}" \
            "https://api-test.securityheaders.com/?q=lingo-keeper-jp-backend-16378814888.asia-northeast1.run.app&hide=on&followRedirects=on")
          echo "$response"
          grade=$(echo "$response" | jq -r '.grade')
          echo "Backend Security Headers Grade: $grade"
          if [[ "$grade" != "A" && "$grade" != "A+" ]]; then
            echo "::warning::Security headers grade is $grade. Expected A or A+."
          fi
```

**SSL Labs チェック**:

```yaml
# .github/workflows/ssl-check.yml
name: SSL/TLS Check

on:
  schedule:
    - cron: '0 4 * * 0' # 毎週日曜 4:00 AM
  workflow_dispatch:

jobs:
  ssl-check:
    runs-on: ubuntu-latest
    steps:
      - name: Setup Go
        uses: actions/setup-go@v4
        with:
          go-version: '1.21'

      - name: Install ssllabs-scan
        run: go install github.com/ssllabs/ssllabs-scan@latest

      - name: Run SSL Labs Scan (Frontend)
        run: |
          ~/go/bin/ssllabs-scan --grade --hostcheck \
            frontend-seven-beta-72.vercel.app > ssl-frontend.txt
          cat ssl-frontend.txt

          if ! grep -q "Grade: A" ssl-frontend.txt; then
            echo "::warning::Frontend SSL grade is not A or higher"
          fi

      - name: Run SSL Labs Scan (Backend)
        run: |
          ~/go/bin/ssllabs-scan --grade --hostcheck \
            lingo-keeper-jp-backend-16378814888.asia-northeast1.run.app > ssl-backend.txt
          cat ssl-backend.txt

          if ! grep -q "Grade: A" ssl-backend.txt; then
            echo "::warning::Backend SSL grade is not A or higher"
          fi

      - name: Upload SSL Reports
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: ssl-reports
          path: |
            ssl-frontend.txt
            ssl-backend.txt
```

#### 2. Lighthouse CI 設定ファイル

```bash
# プロジェクトルートに作成
```

```json
{
  "ci": {
    "collect": {
      "url": ["https://frontend-seven-beta-72.vercel.app"],
      "numberOfRuns": 3
    },
    "assert": {
      "preset": "lighthouse:recommended",
      "assertions": {
        "categories:performance": ["error", {"minScore": 0.9}],
        "categories:accessibility": ["error", {"minScore": 0.9}],
        "categories:best-practices": ["error", {"minScore": 0.9}],
        "categories:seo": ["error", {"minScore": 0.9}]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

#### 3. GitHub Secrets 設定

```bash
# GitHub リポジトリの Settings > Secrets and variables > Actions で設定

# SecurityHeaders.com API キー
SECURITY_HEADERS_API_KEY=your_api_key_here

# Lighthouse CI (オプション)
LHCI_GITHUB_APP_TOKEN=your_token_here
```

---

### Phase 3: データベースセキュリティ強化（1週間）

#### 1. Neon IP Allow 設定

```bash
# Cloud Run の送信 IP アドレスを確認
# （Cloud Run は動的 IP のため、Cloud NAT 使用を推奨）

# 1. Cloud NAT セットアップ
gcloud compute addresses create lingo-keeper-nat-ip \
  --region=asia-northeast1

gcloud compute routers create lingo-keeper-router \
  --network=default \
  --region=asia-northeast1

gcloud compute routers nats create lingo-keeper-nat \
  --router=lingo-keeper-router \
  --region=asia-northeast1 \
  --nat-external-ip-pool=lingo-keeper-nat-ip \
  --nat-all-subnet-ip-ranges

# 2. 静的 IP を Neon Dashboard の IP Allow に追加
# Neon Dashboard > Project Settings > IP Allow
```

#### 2. Protected Branches 設定

```bash
# Neon Dashboard で設定
# 1. Project Settings > Branches
# 2. 本番ブランチ（main）を選択
# 3. "Protect branch" を有効化
```

#### 3. 接続プール最適化

```typescript
// backend/src/lib/db.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  log: process.env.NODE_ENV === 'development'
    ? ['query', 'error', 'warn']
    : ['error'],
  // PgBouncer 使用時の推奨設定
  // DATABASE_URL に ?pgbouncer=true を追加
});

export default prisma;
```

```bash
# .env.production
DATABASE_URL=postgresql://user:password@host/db?sslmode=require&pgbouncer=true
```

---

### Phase 4: 継続的監視（継続）

#### 1. アラート設定

**Vercel（フロントエンド）**:
- Vercel Dashboard > Settings > Notifications
- デプロイ失敗時のメール通知

**Cloud Run（バックエンド）**:

```bash
# Cloud Monitoring でアラートポリシー作成
gcloud alpha monitoring policies create \
  --notification-channels=CHANNEL_ID \
  --display-name="High Error Rate Alert" \
  --condition-display-name="Error rate > 5%" \
  --condition-threshold-value=5 \
  --condition-threshold-duration=300s
```

**Neon（データベース）**:
- Neon Dashboard > Monitoring
- 接続数、クエリパフォーマンス監視

#### 2. ログ監視

```typescript
// backend/src/middleware/security-monitoring.middleware.ts
import logger from '@/lib/logger.js';

export const securityMonitoringMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // 疑わしいパターン検出
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /onerror=/i,
    /eval\(/i,
    /union.*select/i,
    /drop.*table/i,
  ];

  const body = JSON.stringify(req.body);
  const query = JSON.stringify(req.query);

  suspiciousPatterns.forEach(pattern => {
    if (pattern.test(body) || pattern.test(query)) {
      logger.warn('Suspicious input detected', {
        pattern: pattern.source,
        ip: req.ip,
        url: req.url,
        method: req.method,
      });
    }
  });

  next();
};
```

#### 3. 定期レビュー

**週次**:
- [ ] セキュリティスキャン結果確認（OWASP ZAP）
- [ ] エラーログレビュー
- [ ] 異常なアクセスパターン確認

**月次**:
- [ ] セキュリティヘッダー評価（SecurityHeaders.com）
- [ ] SSL/TLS 証明書有効期限確認
- [ ] 依存パッケージ脆弱性スキャン（npm audit）

**四半期**:
- [ ] 全体的なセキュリティ監査
- [ ] ISMS チェックリストレビュー
- [ ] インシデント対応手順の見直し

---

## 継続的な監視

### 依存パッケージ脆弱性スキャン

#### npm audit（自動）

```bash
# フロントエンド
cd frontend
npm audit

# バックエンド
cd backend
npm audit
```

#### GitHub Dependabot（自動）

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/frontend"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10

  - package-ecosystem: "npm"
    directory: "/backend"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
```

#### Snyk（オプション）

```bash
# インストール
npm install -g snyk

# 認証
snyk auth

# スキャン
snyk test

# CI/CD 統合
snyk monitor
```

---

### インシデント対応手順

#### 1. 検知

**アラート発生時**:
- Cloud Run エラー率 > 5%
- セキュリティスキャンで重大な脆弱性検出
- 異常なアクセスパターン

#### 2. 初期対応（15分以内）

```bash
# 1. ログ確認
gcloud logging read "resource.type=cloud_run_revision" \
  --limit=100 \
  --format=json

# 2. 現在のトラフィック確認
gcloud run services describe lingo-keeper-jp-backend \
  --region=asia-northeast1

# 3. 必要に応じてサービス停止
gcloud run services update lingo-keeper-jp-backend \
  --region=asia-northeast1 \
  --no-allow-unauthenticated
```

#### 3. 調査・対応（1時間以内）

- 脆弱性の特定
- 影響範囲の確認
- パッチ適用または緊急対応

#### 4. 復旧

```bash
# パッチ適用後、再デプロイ
git commit -m "Security patch: [vulnerability description]"
git push

# Cloud Run 再デプロイ
gcloud run deploy lingo-keeper-jp-backend \
  --source . \
  --region=asia-northeast1 \
  --allow-unauthenticated
```

#### 5. 事後対応

- インシデントレポート作成
- 再発防止策の実施
- チーム内での知見共有

---

## チェックリスト（実装確認用）

### 緊急対応（Phase 1）

- [ ] Vercel セキュリティヘッダー設定（vercel.json）
- [ ] Cloud Run セキュリティヘッダー強化（helmet.js）
- [ ] CORS 設定強化（allowedOrigins 限定）
- [ ] レート制限実装（express-rate-limit）
- [ ] SecurityHeaders.com で A 評価取得

### 自動化（Phase 2）

- [ ] GitHub Actions: OWASP ZAP スキャン
- [ ] GitHub Actions: Lighthouse CI
- [ ] GitHub Actions: Security Headers チェック
- [ ] GitHub Actions: SSL Labs チェック
- [ ] Lighthouse CI 設定ファイル作成
- [ ] GitHub Secrets 設定

### データベース（Phase 3）

- [ ] Neon IP Allow 設定（Cloud NAT 経由）
- [ ] Protected Branches 設定（本番 DB）
- [ ] 接続プール最適化（PgBouncer）
- [ ] SSL/TLS 接続確認

### 継続監視（Phase 4）

- [ ] Vercel デプロイ通知設定
- [ ] Cloud Run アラートポリシー作成
- [ ] Neon モニタリング設定
- [ ] セキュリティ監視ミドルウェア実装
- [ ] 定期レビュースケジュール策定
- [ ] インシデント対応手順文書化
- [ ] Dependabot 有効化

### 日本企業基準（ISO27001）

- [ ] 情報セキュリティポリシー策定
- [ ] セキュリティインシデント対応手順
- [ ] 定期セキュリティ監査計画
- [ ] リスクアセスメント実施
- [ ] セキュリティ教育資料作成
- [ ] アクセス権限レビュープロセス
- [ ] バックアップ・復旧手順確認

---

## 参考リンク

### 公式ドキュメント

- [Vercel Security Headers](https://vercel.com/docs/headers/security-headers)
- [Google Cloud Run Security](https://docs.cloud.google.com/run/docs/securing/security)
- [Neon Security Overview](https://neon.com/docs/security/security-overview)
- [OWASP ZAP](https://www.zaproxy.org/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)

### 日本の基準

- [経済産業省: 情報セキュリティ管理基準](https://www.meti.go.jp/policy/netsecurity/is-kansa/IS_Management_Standard_R7.pdf)
- [日本品質保証機構: ISO27001](https://www.jqa.jp/service_list/management/service/iso27001/)
- [サプライチェーンセキュリティ対策評価制度](https://www.nri-secure.co.jp/blog/security-measures-assessment-system-for-strengthening-the-supply-chain)

### セキュリティツール

- [SecurityHeaders.com](https://securityheaders.com/)
- [SSL Labs Server Test](https://www.ssllabs.com/ssltest/)
- [Mozilla Observatory](https://observatory.mozilla.org/)
- [Snyk](https://snyk.io/)

---

**次のステップ**: Phase 1（緊急対応）から順次実装を開始してください。
