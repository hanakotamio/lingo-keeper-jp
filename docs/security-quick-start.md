# セキュリティチェック クイックスタートガイド

**最終更新日**: 2026-01-25

このガイドは、本番環境のセキュリティチェックを今すぐ開始するための最短手順を示します。

---

## 前提条件

- GitHub リポジトリへのアクセス権限
- Vercel プロジェクトの管理者権限
- Google Cloud プロジェクトの管理者権限
- Neon データベースの管理者権限

---

## 5分でできる緊急対応

### 1. セキュリティヘッダーの現状確認

**現在のスコアを確認**:

```bash
# フロントエンド（Vercel）
open https://securityheaders.com/?q=frontend-seven-beta-72.vercel.app

# バックエンド（Cloud Run）
open https://securityheaders.com/?q=lingo-keeper-jp-backend-16378814888.asia-northeast1.run.app
```

**目標**: A または A+ 評価

---

### 2. SSL/TLS 設定確認

```bash
# フロントエンド
open https://www.ssllabs.com/ssltest/analyze.html?d=frontend-seven-beta-72.vercel.app

# バックエンド
open https://www.ssllabs.com/ssltest/analyze.html?d=lingo-keeper-jp-backend-16378814888.asia-northeast1.run.app
```

**目標**: A または A+ 評価

---

### 3. OWASP ZAP クイックスキャン（ローカル）

```bash
# Docker でクイックスキャン実行
docker run -t ghcr.io/zaproxy/zaproxy:stable zap-baseline.py \
  -t https://frontend-seven-beta-72.vercel.app \
  -r zap-report.html

# レポート確認
open zap-report.html
```

---

## 30分でできる基本対応

### Step 1: Vercel セキュリティヘッダー設定（10分）

```bash
# プロジェクトルートに移動
cd /home/hanakotamio0705/Lingo\ Keeper\ JP

# vercel.json 作成（既に存在する場合はマージ）
cat > vercel.json << 'EOF'
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
EOF

# デプロイ
git add vercel.json
git commit -m "Add security headers to Vercel config"
git push
```

**確認**（5分後）:
```bash
# デプロイ完了後、再度チェック
open https://securityheaders.com/?q=frontend-seven-beta-72.vercel.app
```

---

### Step 2: バックエンド レート制限実装（10分）

```bash
# バックエンドディレクトリに移動
cd backend

# express-rate-limit インストール
npm install express-rate-limit

# ミドルウェアファイル作成
mkdir -p src/middleware
cat > src/middleware/rate-limit.middleware.ts << 'EOF'
import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分
  max: 100, // 最大100リクエスト
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // 最大5回の試行
  skipSuccessfulRequests: true,
});
EOF
```

**index.ts に追加**:

```typescript
// backend/src/index.ts の適切な位置に追加
import { apiLimiter } from '@/middleware/rate-limit.middleware.js';

// メトリクスミドルウェアの後に追加
app.use('/api/', apiLimiter);
```

```bash
# デプロイ
git add .
git commit -m "Add rate limiting to API endpoints"
git push

# Cloud Run 再デプロイ
gcloud run deploy lingo-keeper-jp-backend \
  --source . \
  --platform managed \
  --region asia-northeast1 \
  --allow-unauthenticated
```

---

### Step 3: 依存パッケージ脆弱性チェック（10分）

```bash
# フロントエンド
cd frontend
npm audit
npm audit fix

# バックエンド
cd ../backend
npm audit
npm audit fix

# 変更があればコミット
git add package*.json
git commit -m "Fix npm audit vulnerabilities"
git push
```

---

## 1時間でできる自動化セットアップ

### GitHub Actions ワークフロー作成

```bash
# プロジェクトルートに移動
cd /home/hanakotamio0705/Lingo\ Keeper\ JP

# ワークフローディレクトリ作成
mkdir -p .github/workflows
```

#### 1. セキュリティスキャン（15分）

```bash
cat > .github/workflows/security-scan.yml << 'EOF'
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

      - name: ZAP Baseline Scan
        uses: zaproxy/action-baseline@v0.12.0
        with:
          target: 'https://frontend-seven-beta-72.vercel.app'
          cmd_options: '-a'

      - name: Upload ZAP Report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: zap-report
          path: report_html.html
EOF
```

#### 2. セキュリティヘッダーチェック（10分）

**SecurityHeaders.com API キー取得**:
1. https://securityheaders.com/api/ にアクセス
2. API キーを取得
3. GitHub リポジトリの Settings > Secrets and variables > Actions
4. New repository secret: `SECURITY_HEADERS_API_KEY`

```bash
cat > .github/workflows/security-headers.yml << 'EOF'
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
EOF
```

#### 3. Lighthouse CI（15分）

```bash
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

cat > .github/workflows/lighthouse.yml << 'EOF'
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
EOF
```

#### 4. SSL/TLS チェック（10分）

```bash
cat > .github/workflows/ssl-check.yml << 'EOF'
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

      - name: Upload SSL Reports
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: ssl-reports
          path: ssl-frontend.txt
EOF
```

#### 5. Dependabot 設定（10分）

```bash
cat > .github/dependabot.yml << 'EOF'
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
EOF
```

#### すべてコミット

```bash
git add .github/
git add lighthouserc.json
git commit -m "Add automated security scanning workflows"
git push
```

---

## 手動テスト実行

### OWASP ZAP

```bash
# フロントエンド
docker run -t ghcr.io/zaproxy/zaproxy:stable zap-baseline.py \
  -t https://frontend-seven-beta-72.vercel.app \
  -r zap-frontend-report.html

# バックエンド API
docker run -t ghcr.io/zaproxy/zaproxy:stable zap-api-scan.py \
  -t https://lingo-keeper-jp-backend-16378814888.asia-northeast1.run.app/api \
  -f openapi \
  -r zap-backend-report.html

# レポート確認
open zap-frontend-report.html
open zap-backend-report.html
```

---

### Lighthouse CI

```bash
# インストール（未インストールの場合）
npm install -g @lhci/cli

# 実行
lhci autorun

# レポートURL が表示されます
```

---

### SecurityHeaders.com

```bash
# API キー取得: https://securityheaders.com/api/

# フロントエンド
curl -H "x-api-key: YOUR_API_KEY" \
  "https://api-test.securityheaders.com/?q=frontend-seven-beta-72.vercel.app&hide=on&followRedirects=on" | jq

# バックエンド
curl -H "x-api-key: YOUR_API_KEY" \
  "https://api-test.securityheaders.com/?q=lingo-keeper-jp-backend-16378814888.asia-northeast1.run.app&hide=on&followRedirects=on" | jq
```

---

### SSL Labs

```bash
# オンラインテスト（推奨）
open https://www.ssllabs.com/ssltest/analyze.html?d=frontend-seven-beta-72.vercel.app

# CLI（オプション）
go install github.com/ssllabs/ssllabs-scan@latest
~/go/bin/ssllabs-scan --grade --hostcheck frontend-seven-beta-72.vercel.app
```

---

## 結果の見方

### SecurityHeaders.com

**評価基準**:
- **A+**: すべての推奨ヘッダーが適切に設定
- **A**: 主要なヘッダーが設定済み
- **B-F**: 重要なヘッダーが不足

**必須ヘッダー**:
- Content-Security-Policy
- Strict-Transport-Security (HSTS)
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy

---

### SSL Labs

**評価基準**:
- **A+**: 完璧な設定
- **A**: 推奨設定
- **B**: 許容範囲
- **C-F**: 改善が必要

**チェック項目**:
- TLS 1.2/1.3 のみサポート
- 強力な暗号スイート
- 証明書の有効性
- Forward Secrecy サポート

---

### OWASP ZAP

**リスクレベル**:
- **High**: 即座に対応が必要
- **Medium**: 早急に対応
- **Low**: 計画的に対応
- **Informational**: 情報提供のみ

**優先順位**:
1. High リスクを全て解決
2. Medium リスクを確認・対応
3. Low リスクは必要に応じて対応

---

### Lighthouse

**スコア目標**:
- Performance: 90+
- Accessibility: 90+
- Best Practices: 90+
- SEO: 90+

**主要メトリクス**:
- **FCP (First Contentful Paint)**: < 1.8s
- **LCP (Largest Contentful Paint)**: < 2.5s
- **TBT (Total Blocking Time)**: < 200ms
- **CLS (Cumulative Layout Shift)**: < 0.1

---

## トラブルシューティング

### Q1: SecurityHeaders.com で A 評価が取れない

**原因**: CSP ヘッダーが適切に設定されていない

**解決策**:

```bash
# Vercel の場合: vercel.json を確認
cat vercel.json

# デプロイ後、5分待ってから再テスト
# キャッシュクリアが必要な場合も
```

---

### Q2: OWASP ZAP で大量のアラートが出る

**原因**: デフォルト設定では過検知する場合がある

**解決策**:

```bash
# ルールファイルを作成して誤検知を除外
mkdir -p .zap
cat > .zap/rules.tsv << 'EOF'
10021	IGNORE	(CSP: Wildcard Directive)
10055	IGNORE	(CSP: Script Unsafe Inline)
EOF

# ルールファイルを指定してスキャン
docker run -t -v $(pwd)/.zap:/zap/wrk/:rw \
  ghcr.io/zaproxy/zaproxy:stable zap-baseline.py \
  -t https://frontend-seven-beta-72.vercel.app \
  -c rules.tsv \
  -r zap-report.html
```

---

### Q3: Cloud Run のセキュリティヘッダーが反映されない

**原因**: helmet.js の設定が不完全

**解決策**:

```typescript
// backend/src/index.ts を確認
// helmet() の設定が正しいか確認

// デプロイ後、curl でヘッダー確認
curl -I https://lingo-keeper-jp-backend-16378814888.asia-northeast1.run.app/api/health
```

---

### Q4: Lighthouse CI のスコアが低い

**原因**: パフォーマンス最適化が不足

**解決策**:

```bash
# 画像最適化
# コード分割の確認
# CDN 使用の検討

# 詳細レポートで具体的な改善点を確認
lhci autorun --view
```

---

## 次のステップ

### 完了したらチェック

- [ ] SecurityHeaders.com で A 評価取得
- [ ] SSL Labs で A 評価取得
- [ ] OWASP ZAP で High リスクゼロ
- [ ] Lighthouse で全カテゴリ 90+ スコア
- [ ] GitHub Actions ワークフロー動作確認
- [ ] Dependabot 有効化

### 継続的な監視

**毎日**:
- GitHub Actions の実行結果確認（自動）

**毎週**:
- セキュリティスキャン結果レビュー
- 依存パッケージ更新（Dependabot PR）

**毎月**:
- 全体的なセキュリティ評価
- インシデントレビュー

---

## サポート

詳細な情報は以下を参照:
- [セキュリティベストプラクティス全文](/home/hanakotamio0705/Lingo Keeper JP/docs/security-best-practices.md)
- [CLAUDE.md](/home/hanakotamio0705/Lingo Keeper JP/CLAUDE.md)

---

**最終更新日**: 2026-01-25
