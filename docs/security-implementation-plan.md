# セキュリティ実装プラン - 現状分析と優先順位

**作成日**: 2026-01-25
**プロジェクト**: Lingo Keeper JP
**対象環境**: Vercel（Frontend）+ Cloud Run（Backend）+ Neon（Database）

---

## 現状分析

### ✅ 既に実装済み

#### バックエンド（Cloud Run）

1. **Helmet.js によるセキュリティヘッダー**
   - ✅ Content-Security-Policy (CSP)
   - ✅ HSTS (HTTP Strict Transport Security)
   - ✅ X-Frame-Options は明示的には未設定（helmet デフォルト使用）
   - ✅ その他の基本的なセキュリティヘッダー

   **設定箇所**: `/home/hanakotamio0705/Lingo Keeper JP/backend/src/index.ts` (31-45行目)

2. **CORS 設定**
   - ✅ 許可オリジンの制限（localhost + Vercel ドメイン）
   - ✅ 正規表現パターンマッチング（プレビューデプロイ対応）
   - ✅ credentials: true（Cookie サポート）
   - ⚠️ 開発環境でワイルドカード許可の可能性（環境変数次第）

   **設定箇所**: `/home/hanakotamio0705/Lingo Keeper JP/backend/src/index.ts` (48-73行目)

3. **グレースフルシャットダウン**
   - ✅ SIGTERM/SIGINT ハンドリング
   - ✅ 8秒タイムアウト（CLAUDE.md 準拠）
   - ✅ データベース切断処理

   **設定箇所**: `/home/hanakotamio0705/Lingo Keeper JP/backend/src/index.ts` (125-172行目)

4. **ロギング・モニタリング**
   - ✅ 構造化ログ
   - ✅ リクエストID トラッキング
   - ✅ パフォーマンスモニタリング
   - ✅ エラー率モニタリング

#### フロントエンド（Vercel）

1. **vercel.json 存在**
   - ✅ ファイル存在: `/home/hanakotamio0705/Lingo Keeper JP/frontend/vercel.json`
   - ⚠️ セキュリティヘッダー未設定（Cache-Control のみ）
   - ⚠️ SPA リライト設定のみ

2. **ビルド設定**
   - ✅ Vite ビルド最適化
   - ✅ コード分割（react-vendor, mui-core, vendor）
   - ✅ チャンクサイズ制限（600KB）

#### データベース（Neon）

1. **接続セキュリティ**
   - ✅ SSL/TLS 接続（DATABASE_URL に sslmode=require 推奨）
   - ✅ Prisma ORM 使用（SQL インジェクション対策）
   - ⚠️ IP Allow 未設定（全 IP から接続可能）
   - ⚠️ Protected Branches 未設定

---

### ❌ 未実装（緊急対応が必要）

#### 優先度: 🔴 High（今すぐ実装）

1. **フロントエンド セキュリティヘッダー**
   - ❌ Content-Security-Policy
   - ❌ X-Frame-Options
   - ❌ X-Content-Type-Options
   - ❌ Referrer-Policy
   - ❌ Permissions-Policy
   - ❌ Strict-Transport-Security

   **影響**: XSS、クリックジャッキング、MIME スニッフィング攻撃のリスク

2. **API レート制限**
   - ❌ express-rate-limit 未インストール
   - ❌ DDoS/ブルートフォース攻撃対策なし

   **影響**: サービス停止、リソース枯渇のリスク

3. **依存パッケージ脆弱性管理**
   - ❌ Dependabot 未設定
   - ❌ 定期的な npm audit 実施なし

   **影響**: 既知の脆弱性を持つパッケージ使用の可能性

#### 優先度: 🟡 Medium（1週間以内に実装）

4. **自動セキュリティスキャン**
   - ❌ OWASP ZAP 自動スキャンなし
   - ❌ Lighthouse CI 未設定
   - ❌ SecurityHeaders.com 定期チェックなし
   - ❌ SSL Labs 定期チェックなし

   **影響**: 脆弱性の早期発見が困難

5. **データベース IP 制限**
   - ❌ Neon IP Allow 未設定
   - ❌ Protected Branches 未設定

   **影響**: 不正アクセスのリスク（ただし認証情報が漏洩した場合）

6. **バックエンド セキュリティヘッダー強化**
   - ⚠️ helmet 設定の最適化
   - ❌ Permissions-Policy 未設定

#### 優先度: 🟢 Low（1ヶ月以内に実装）

7. **セキュリティモニタリング強化**
   - ❌ 疑わしい入力パターンの検出
   - ❌ セキュリティインシデント対応手順

8. **ISO27001 準拠**
   - ❌ 情報セキュリティポリシー策定
   - ❌ 定期的なセキュリティ監査計画

---

## 優先順位付きアクションプラン

### 🔴 Phase 1: 緊急対応（今日～3日以内）

**所要時間**: 約2時間

#### Action 1-1: Vercel セキュリティヘッダー追加（30分）

**ファイル**: `/home/hanakotamio0705/Lingo Keeper JP/frontend/vercel.json`

**現在の設定**:
```json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

**推奨設定**:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
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

**実行コマンド**:
```bash
cd /home/hanakotamio0705/Lingo\ Keeper\ JP

# 既存の vercel.json をバックアップ
cp frontend/vercel.json frontend/vercel.json.backup

# 新しい設定をマージ（手動編集推奨）
# または、用意した設定ファイルで上書き

git add frontend/vercel.json
git commit -m "Add security headers to Vercel frontend"
git push
```

**検証**:
```bash
# デプロイ完了後（約5分）
open https://securityheaders.com/?q=frontend-seven-beta-72.vercel.app
# 目標: A または A+ 評価
```

---

#### Action 1-2: API レート制限実装（45分）

**ファイル**:
- `/home/hanakotamio0705/Lingo Keeper JP/backend/src/middleware/rate-limit.middleware.ts` (新規作成)
- `/home/hanakotamio0705/Lingo Keeper JP/backend/src/index.ts` (修正)

**実行コマンド**:
```bash
cd /home/hanakotamio0705/Lingo\ Keeper\ JP/backend

# パッケージインストール
npm install express-rate-limit

# ミドルウェアファイル作成
cat > src/middleware/rate-limit.middleware.ts << 'EOF'
import rateLimit from 'express-rate-limit';

/**
 * API エンドポイント用レート制限
 * 15分間で最大100リクエスト
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * 認証エンドポイント用レート制限（Phase 2以降で使用）
 * 15分間で最大5回の試行
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
  message: 'Too many authentication attempts. Please try again later.',
});

/**
 * TTS エンドポイント用レート制限
 * リソース消費が大きいため、より厳格な制限
 */
export const ttsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // 15分間で最大20回
  message: 'Too many TTS requests. Please try again later.',
});
EOF
```

**index.ts への追加**:

`/home/hanakotamio0705/Lingo Keeper JP/backend/src/index.ts` の適切な位置に追加:

```typescript
// インポート（11行目付近に追加）
import { apiLimiter, ttsLimiter } from '@/middleware/rate-limit.middleware.js';

// メトリクスミドルウェアの後に追加（95行目付近）
// 全 API エンドポイントにレート制限適用
app.use('/api/', apiLimiter);

// TTS エンドポイントには個別の厳格な制限
app.use('/api/tts', ttsLimiter);
```

**コミット・デプロイ**:
```bash
git add .
git commit -m "Add rate limiting to API and TTS endpoints"
git push

# Cloud Run 再デプロイ
gcloud run deploy lingo-keeper-jp-backend \
  --source . \
  --platform managed \
  --region asia-northeast1 \
  --allow-unauthenticated
```

**検証**:
```bash
# レート制限が動作しているか確認（100回以上リクエスト）
for i in {1..110}; do
  curl -s -o /dev/null -w "%{http_code}\n" \
    https://lingo-keeper-jp-backend-16378814888.asia-northeast1.run.app/api/health
done
# 101回目以降は 429 (Too Many Requests) が返ることを確認
```

---

#### Action 1-3: 依存パッケージ脆弱性チェック（30分）

**実行コマンド**:
```bash
cd /home/hanakotamio0705/Lingo\ Keeper\ JP

# フロントエンド
cd frontend
npm audit
npm audit fix --force  # 自動修正可能なものを修正
npm audit  # 残りの脆弱性を確認

# バックエンド
cd ../backend
npm audit
npm audit fix --force
npm audit

# package.json が更新された場合はコミット
cd ..
git add frontend/package*.json backend/package*.json
git commit -m "Fix npm audit vulnerabilities"
git push
```

---

#### Action 1-4: Dependabot 設定（15分）

**ファイル**: `/home/hanakotamio0705/Lingo Keeper JP/.github/dependabot.yml` (新規作成)

**実行コマンド**:
```bash
cd /home/hanakotamio0705/Lingo\ Keeper\ JP

# Dependabot 設定ファイル作成
cat > .github/dependabot.yml << 'EOF'
version: 2
updates:
  # Frontend dependencies
  - package-ecosystem: "npm"
    directory: "/frontend"
    schedule:
      interval: "weekly"
      day: "monday"
      time: "09:00"
    open-pull-requests-limit: 10
    reviewers:
      - "mio-furumaki"  # GitHub ユーザー名に置き換え
    labels:
      - "dependencies"
      - "frontend"

  # Backend dependencies
  - package-ecosystem: "npm"
    directory: "/backend"
    schedule:
      interval: "weekly"
      day: "monday"
      time: "09:00"
    open-pull-requests-limit: 10
    reviewers:
      - "mio-furumaki"  # GitHub ユーザー名に置き換え
    labels:
      - "dependencies"
      - "backend"

  # GitHub Actions
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
      time: "09:00"
    open-pull-requests-limit: 5
    labels:
      - "dependencies"
      - "github-actions"
EOF

git add .github/dependabot.yml
git commit -m "Add Dependabot configuration for automated dependency updates"
git push
```

**検証**:
- GitHub リポジトリの "Insights > Dependency graph > Dependabot" で有効化確認
- 月曜日に最初の PR が作成されることを確認

---

### 🟡 Phase 2: 自動化セットアップ（1週間以内）

**所要時間**: 約3時間

#### Action 2-1: GitHub Actions セキュリティスキャン（60分）

**SecurityHeaders.com API キー取得**:
1. https://securityheaders.com/api/ にアクセス
2. API キーを取得
3. GitHub リポジトリの Settings > Secrets and variables > Actions
4. New repository secret: `SECURITY_HEADERS_API_KEY` に API キーを設定

**ワークフロー作成**:

```bash
cd /home/hanakotamio0705/Lingo\ Keeper\ JP

# 1. OWASP ZAP スキャン
cat > .github/workflows/security-scan.yml << 'EOF'
name: Security Scan

on:
  schedule:
    - cron: '0 2 * * 1' # 毎週月曜 2:00 AM (JST 11:00 AM)
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

      - name: Upload ZAP Report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: zap-frontend-report
          path: report_html.html
          retention-days: 30
EOF

# 2. Security Headers チェック
cat > .github/workflows/security-headers.yml << 'EOF'
name: Security Headers Check

on:
  schedule:
    - cron: '0 3 * * *' # 毎日 3:00 AM (JST 12:00 PM)
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
EOF

# 3. SSL/TLS チェック
cat > .github/workflows/ssl-check.yml << 'EOF'
name: SSL/TLS Check

on:
  schedule:
    - cron: '0 4 * * 0' # 毎週日曜 4:00 AM (JST 1:00 PM)
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

      - name: Upload SSL Reports
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: ssl-reports
          path: ssl-frontend.txt
          retention-days: 30
EOF

git add .github/workflows/
git commit -m "Add automated security scanning workflows (OWASP ZAP, Security Headers, SSL/TLS)"
git push
```

---

#### Action 2-2: Lighthouse CI セットアップ（60分）

```bash
cd /home/hanakotamio0705/Lingo\ Keeper\ JP

# Lighthouse CI 設定ファイル
cat > lighthouserc.json << 'EOF'
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
EOF

# GitHub Actions ワークフロー
cat > .github/workflows/lighthouse.yml << 'EOF'
name: Lighthouse CI

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]
  schedule:
    - cron: '0 5 * * 1' # 毎週月曜 5:00 AM (JST 2:00 PM)

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

      - name: Upload Lighthouse Reports
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: lighthouse-reports
          path: .lighthouseci/
          retention-days: 30
EOF

git add lighthouserc.json .github/workflows/lighthouse.yml
git commit -m "Add Lighthouse CI for performance and best practices monitoring"
git push
```

---

#### Action 2-3: バックエンド helmet.js 設定強化（30分）

**ファイル**: `/home/hanakotamio0705/Lingo Keeper JP/backend/src/index.ts`

**現在の設定** (31-45行目):
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

**推奨設定**:
```typescript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"], // MUI対応
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", "data:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
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

**コミット・デプロイ**:
```bash
cd /home/hanakotamio0705/Lingo\ Keeper\ JP

git add backend/src/index.ts
git commit -m "Enhance backend security headers with comprehensive helmet configuration"
git push

# Cloud Run 再デプロイ
cd backend
gcloud run deploy lingo-keeper-jp-backend \
  --source . \
  --platform managed \
  --region asia-northeast1 \
  --allow-unauthenticated
```

---

### 🟢 Phase 3: データベースセキュリティ（1週間以内）

**所要時間**: 約2時間

#### Action 3-1: Neon Protected Branches 設定（15分）

**手順**:
1. Neon Dashboard にログイン: https://console.neon.tech/
2. プロジェクト選択: `lingo_keeper_jp`
3. Settings > Branches
4. 本番ブランチ（`main`）を選択
5. "Protect branch" を有効化

**設定内容**:
- ブランチの削除を禁止
- ブランチのリセットを禁止
- 自動パスワードローテーション有効化

---

#### Action 3-2: データベース接続最適化（30分）

**ファイル**: `/home/hanakotamio0705/Lingo Keeper JP/backend/.env.production`

**現在の DATABASE_URL 確認**:
```bash
cd /home/hanakotamio0705/Lingo\ Keeper\ JP/backend
grep DATABASE_URL .env.production
```

**推奨設定**（PgBouncer 使用）:

```bash
# .env.production（Secret Manager 経由で設定）
DATABASE_URL=postgresql://user:password@host/db?sslmode=require&pgbouncer=true&connection_limit=10
```

**Cloud Run 環境変数更新**:
```bash
# Secret Manager に保存されている場合は Secret を更新
# 直接環境変数の場合は以下のコマンド

gcloud run services update lingo-keeper-jp-backend \
  --region=asia-northeast1 \
  --update-env-vars DATABASE_URL="postgresql://user:password@host/db?sslmode=require&pgbouncer=true&connection_limit=10"
```

---

#### Action 3-3: Neon IP Allow 設定（Cloud NAT経由）【オプション】（60分）

**注意**: Cloud NAT の使用には追加料金が発生します。セキュリティ要件が高い場合のみ実施してください。

**手順**:

```bash
# 1. Cloud NAT 用の静的 IP アドレス作成
gcloud compute addresses create lingo-keeper-nat-ip \
  --region=asia-northeast1

# 静的 IP アドレスを確認
gcloud compute addresses describe lingo-keeper-nat-ip \
  --region=asia-northeast1 \
  --format='value(address)'
# 例: 34.84.XXX.XXX

# 2. Cloud Router 作成
gcloud compute routers create lingo-keeper-router \
  --network=default \
  --region=asia-northeast1

# 3. Cloud NAT 作成
gcloud compute routers nats create lingo-keeper-nat \
  --router=lingo-keeper-router \
  --region=asia-northeast1 \
  --nat-external-ip-pool=lingo-keeper-nat-ip \
  --nat-all-subnet-ip-ranges

# 4. VPC コネクタ作成（Cloud Run から VPC 経由で接続）
gcloud compute networks vpc-access connectors create lingo-keeper-connector \
  --region=asia-northeast1 \
  --range=10.8.0.0/28

# 5. Cloud Run サービスを VPC コネクタ経由に変更
gcloud run services update lingo-keeper-jp-backend \
  --region=asia-northeast1 \
  --vpc-connector=lingo-keeper-connector \
  --vpc-egress=all-traffic
```

**Neon Dashboard で IP Allow 設定**:
1. Neon Dashboard > Project Settings > IP Allow
2. 上記で取得した静的 IP（34.84.XXX.XXX）を追加
3. 保存

**検証**:
```bash
# バックエンドから DB 接続が正常に動作するか確認
curl https://lingo-keeper-jp-backend-16378814888.asia-northeast1.run.app/api/health
# {"success":true,"status":"healthy","database":"connected"}
```

---

### 🟢 Phase 4: 継続的監視と改善（継続）

**所要時間**: 月次1-2時間

#### Action 4-1: 定期レビュープロセス確立

**週次レビュー**（毎週月曜日、15分）:
```bash
# GitHub Actions の実行結果確認
open https://github.com/YOUR_USERNAME/Lingo-Keeper-JP/actions

# チェック項目:
# - Security Scan (OWASP ZAP) の結果
# - Security Headers Check の評価
# - Dependabot の PR 状況
```

**月次レビュー**（毎月第1月曜日、60分）:
```bash
# 1. 全セキュリティスキャン結果の総括
# 2. Lighthouse CI スコアの推移確認
# 3. npm audit 実施
cd /home/hanakotamio0705/Lingo\ Keeper\ JP/frontend && npm audit
cd ../backend && npm audit

# 4. SSL 証明書有効期限確認（自動更新されるが念のため）
open https://www.ssllabs.com/ssltest/analyze.html?d=frontend-seven-beta-72.vercel.app

# 5. Cloud Run ログの異常パターン確認
gcloud logging read "resource.type=cloud_run_revision AND severity>=WARNING" \
  --limit=100 \
  --format=json
```

---

#### Action 4-2: インシデント対応手順の文書化（30分）

**ファイル**: `/home/hanakotamio0705/Lingo Keeper JP/docs/security-incident-response.md` (新規作成)

**テンプレート**:
```markdown
# セキュリティインシデント対応手順

## 1. 検知
- アラート発生源: [GitHub Actions / Cloud Monitoring / Neon Alerts]
- 検知時刻: [YYYY-MM-DD HH:MM JST]
- 深刻度: [Critical / High / Medium / Low]

## 2. 初期対応（15分以内）
- [ ] 影響範囲の特定
- [ ] ログ確認
- [ ] 必要に応じてサービス一時停止

## 3. 調査・対応（1時間以内）
- [ ] 脆弱性の特定
- [ ] 原因分析
- [ ] パッチ適用または緊急対応

## 4. 復旧
- [ ] 修正版デプロイ
- [ ] 動作確認
- [ ] サービス再開

## 5. 事後対応
- [ ] インシデントレポート作成
- [ ] 再発防止策の実施
- [ ] チーム内での知見共有
```

---

## 実装チェックリスト

### 🔴 Phase 1: 緊急対応（完了目標: 3日以内）

- [ ] Action 1-1: Vercel セキュリティヘッダー追加
  - [ ] `frontend/vercel.json` 更新
  - [ ] デプロイ
  - [ ] SecurityHeaders.com で A 評価確認
- [ ] Action 1-2: API レート制限実装
  - [ ] `express-rate-limit` インストール
  - [ ] `rate-limit.middleware.ts` 作成
  - [ ] `index.ts` に統合
  - [ ] Cloud Run 再デプロイ
  - [ ] レート制限動作確認
- [ ] Action 1-3: 依存パッケージ脆弱性チェック
  - [ ] フロントエンド `npm audit` 実施・修正
  - [ ] バックエンド `npm audit` 実施・修正
  - [ ] コミット・プッシュ
- [ ] Action 1-4: Dependabot 設定
  - [ ] `.github/dependabot.yml` 作成
  - [ ] GitHub で有効化確認

### 🟡 Phase 2: 自動化セットアップ（完了目標: 1週間以内）

- [ ] Action 2-1: GitHub Actions セキュリティスキャン
  - [ ] SecurityHeaders.com API キー取得・設定
  - [ ] `security-scan.yml` 作成（OWASP ZAP）
  - [ ] `security-headers.yml` 作成
  - [ ] `ssl-check.yml` 作成
  - [ ] 手動実行で動作確認
- [ ] Action 2-2: Lighthouse CI セットアップ
  - [ ] `lighthouserc.json` 作成
  - [ ] `lighthouse.yml` 作成
  - [ ] 手動実行で動作確認
- [ ] Action 2-3: バックエンド helmet.js 設定強化
  - [ ] `backend/src/index.ts` 更新
  - [ ] Cloud Run 再デプロイ
  - [ ] SecurityHeaders.com で評価確認

### 🟢 Phase 3: データベースセキュリティ（完了目標: 1週間以内）

- [ ] Action 3-1: Neon Protected Branches 設定
  - [ ] Neon Dashboard で本番ブランチ保護
- [ ] Action 3-2: データベース接続最適化
  - [ ] DATABASE_URL に PgBouncer パラメータ追加
  - [ ] Cloud Run 環境変数更新
  - [ ] 動作確認
- [ ] Action 3-3: Neon IP Allow 設定（オプション）
  - [ ] Cloud NAT セットアップ
  - [ ] VPC コネクタ作成
  - [ ] Cloud Run VPC 経由接続設定
  - [ ] Neon IP Allow 設定
  - [ ] 動作確認

### 🟢 Phase 4: 継続的監視（継続）

- [ ] Action 4-1: 定期レビュープロセス確立
  - [ ] 週次レビュー実施（毎週月曜）
  - [ ] 月次レビュー実施（毎月第1月曜）
- [ ] Action 4-2: インシデント対応手順の文書化
  - [ ] `docs/security-incident-response.md` 作成

---

## コスト見積もり

### 追加料金が発生する項目

1. **SecurityHeaders.com API**:
   - 無料プラン: 10,000 リクエスト/月
   - 超過分: 検討が必要
   - **予想**: 無料枠内（1日1回×2エンドポイント = 60回/月）

2. **SSL Labs API**:
   - 無料（レート制限あり）
   - 商用利用には許可が必要

3. **Cloud NAT**（オプション）:
   - NAT ゲートウェイ料金: ~$0.045/時間 = 約$32/月
   - データ処理料金: $0.045/GB
   - **推奨**: 高セキュリティ要件の場合のみ

4. **VPC コネクタ**（Cloud NAT 使用時）:
   - 料金: ~$0.007/時間/vCPU = 約$10/月

5. **Neon Scale プラン**（Protected Branches 等の高度な機能使用時）:
   - Free プランでは Protected Branches 未対応
   - Scale プラン: $69/月～

**総コスト見積もり**:
- **最小構成**（Cloud NAT なし、Neon Free プラン）: **$0/月**
- **推奨構成**（Cloud NAT あり、Neon Scale プラン）: **約$111/月**

---

## 次のステップ

1. **今すぐ開始**: Phase 1（緊急対応）を今日から実施
2. **1週間以内**: Phase 2（自動化）を完了
3. **2週間以内**: Phase 3（データベース）を完了
4. **継続**: Phase 4（監視）プロセスを確立

---

## 参考ドキュメント

- [セキュリティベストプラクティス詳細](/home/hanakotamio0705/Lingo Keeper JP/docs/security-best-practices.md)
- [セキュリティクイックスタートガイド](/home/hanakotamio0705/Lingo Keeper JP/docs/security-quick-start.md)
- [CLAUDE.md](/home/hanakotamio0705/Lingo Keeper JP/CLAUDE.md)

---

**最終更新日**: 2026-01-25
