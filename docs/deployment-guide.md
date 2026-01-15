# Lingo Keeper JP - デプロイガイド

**作成日**: 2026-01-12
**最終更新**: 2026-01-12
**対象環境**: Production / Staging

---

## 📋 デプロイ前チェックリスト

### 必須確認事項
- [ ] E2Eテスト全件実行完了（16/16項目）
- [ ] TypeScriptビルドエラーなし（frontend/backend両方）
- [ ] リントエラー修正完了
- [ ] 環境変数設定確認（.env.example参照）
- [ ] データベースマイグレーション完了
- [ ] GCPサービスアカウント権限確認
- [ ] CORS設定確認（本番URLに更新）

### 推奨確認事項
- [ ] パフォーマンステスト実施
- [ ] アクセシビリティチェック
- [ ] セキュリティ監査
- [ ] ドキュメント更新（README, API仕様書）

---

## 🎯 デプロイアーキテクチャ

```
┌─────────────────────────────────────────────┐
│  Frontend (Vercel)                          │
│  - React 18 + TypeScript + Vite            │
│  - Domain: [your-domain].vercel.app        │
│  - Auto SSL, CDN, Edge Network             │
└─────────────────┬───────────────────────────┘
                  │ HTTPS API Calls
                  │ (VITE_API_URL)
                  ▼
┌─────────────────────────────────────────────┐
│  Backend (Google Cloud Run)                 │
│  - Node.js 20 + Express + Prisma           │
│  - Containerized (Docker)                  │
│  - Auto-scaling, Serverless                │
└─────────────────┬───────────────────────────┘
                  │ DATABASE_URL
                  ▼
┌─────────────────────────────────────────────┐
│  Database (Neon PostgreSQL)                 │
│  - Serverless PostgreSQL                    │
│  - Auto-scaling Storage                     │
│  - Built-in Backups                         │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│  External Services                          │
│  - Google Cloud Text-to-Speech             │
│  - OpenAI GPT-4 (Quiz Generation)          │
└─────────────────────────────────────────────┘
```

---

## 🚀 フロントエンド（Vercel）デプロイ

### 1. 初回セットアップ

#### 1.1 Vercelプロジェクト作成

```bash
cd frontend
vercel login
vercel
```

対話形式で以下を入力：
- **Set up and deploy?**: Y
- **Which scope?**: [Your Vercel Account]
- **Link to existing project?**: N
- **What's your project's name?**: lingo-keeper-jp
- **In which directory is your code located?**: ./
- **Want to override the settings?**: Y
  - **Build Command**: `npm run build`
  - **Output Directory**: `dist`
  - **Development Command**: `npm run dev`

#### 1.2 環境変数設定（Vercel Dashboard）

Vercel Dashboard → Settings → Environment Variables

**Production環境変数**:
```bash
# Backend API URL (Cloud Run URL取得後に設定)
VITE_API_URL=https://your-backend-url.run.app

# Optional: Monitoring
# VITE_SENTRY_DSN=https://...
# VITE_GA_MEASUREMENT_ID=G-...
```

**注意**:
- `VITE_`プレフィックスは必須（Viteの仕様）
- Cloud RunデプロイURL取得後に`VITE_API_URL`を更新

### 2. デプロイ実行

#### 2.1 Production デプロイ

```bash
cd frontend

# ビルド検証
npm run build

# 本番デプロイ
vercel --prod
```

#### 2.2 デプロイ確認

1. デプロイURL取得: `https://lingo-keeper-jp.vercel.app`
2. ヘルスチェック: ブラウザでアクセス確認
3. 動作確認:
   - ストーリー一覧表示（`/stories`）
   - クイズ進捗表示（`/quiz`）
   - フィルター機能動作
   - API連携確認（DevToolsでNetworkタブ確認）

### 3. カスタムドメイン設定（オプション）

Vercel Dashboard → Settings → Domains

```bash
# DNSレコード追加（例: example.com）
CNAME: www -> cname.vercel-dns.com
A: @ -> 76.76.21.21
```

### 4. デプロイメトリクス確認

Vercel Dashboard → Analytics

- **Core Web Vitals**: LCP, FID, CLS
- **Performance Score**: 目標 > 90
- **Visitor Count**: トラフィック監視

---

## ☁️ バックエンド（Google Cloud Run）デプロイ

### 1. 事前準備

#### 1.1 GCPプロジェクト設定確認

```bash
# プロジェクト確認
gcloud config get-value project

# プロジェクト設定（必要に応じて）
gcloud config set project lingo-keeper

# 必要なAPI有効化
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable texttospeech.googleapis.com
```

#### 1.2 サービスアカウント権限確認

```bash
# 現在のサービスアカウント確認
gcloud iam service-accounts list

# 必要な権限:
# - Cloud Run Admin
# - Cloud SQL Client (if using Cloud SQL)
# - Text-to-Speech User
# - Storage Object Viewer (for GCS access)
```

### 2. Docker イメージビルド

```bash
cd backend

# ローカルビルドテスト（任意）
docker build -t lingo-keeper-backend:test .

# Cloud Buildでビルド（推奨）
gcloud builds submit --tag gcr.io/lingo-keeper/backend:latest
```

### 3. Cloud Run デプロイ

#### 3.1 初回デプロイ

```bash
cd backend

gcloud run deploy lingo-keeper-backend \
  --image gcr.io/lingo-keeper/backend:latest \
  --platform managed \
  --region asia-northeast1 \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10 \
  --timeout 60s \
  --set-env-vars "NODE_ENV=production" \
  --set-env-vars "CORS_ORIGIN=https://lingo-keeper-jp.vercel.app"
```

#### 3.2 環境変数設定（Secret Manager推奨）

**⚠️ 重要**: 機密情報は必ずSecret Managerを使用

```bash
# Secretの作成
echo -n "postgresql://user:pass@host/db" | gcloud secrets create database-url --data-file=-
echo -n "sk-proj-..." | gcloud secrets create openai-api-key --data-file=-

# Cloud RunサービスにSecret付与
gcloud run services update lingo-keeper-backend \
  --update-secrets DATABASE_URL=database-url:latest \
  --update-secrets OPENAI_API_KEY=openai-api-key:latest \
  --update-secrets JWT_SECRET=jwt-secret:latest \
  --update-secrets SESSION_SECRET=session-secret:latest
```

**非機密情報は環境変数で設定**:
```bash
gcloud run services update lingo-keeper-backend \
  --set-env-vars "GOOGLE_CLOUD_PROJECT_ID=lingo-keeper" \
  --set-env-vars "CORS_ORIGIN=https://lingo-keeper-jp.vercel.app" \
  --set-env-vars "FRONTEND_URL=https://lingo-keeper-jp.vercel.app"
```

#### 3.3 データベースマイグレーション

**⚠️ デプロイ前に必ず実行**

```bash
# ローカルから本番DBにマイグレーション（DATABASE_URL設定必要）
cd backend
export DATABASE_URL="postgresql://..."
npx prisma migrate deploy

# または、Cloud Runコンテナ内で実行（Cloud Run Jobsを使用）
gcloud run jobs create db-migrate \
  --image gcr.io/lingo-keeper/backend:latest \
  --region asia-northeast1 \
  --task-timeout 5m \
  --set-env-vars DATABASE_URL=... \
  --command "npx" \
  --args "prisma,migrate,deploy"

gcloud run jobs execute db-migrate --region asia-northeast1
```

### 4. デプロイ確認

#### 4.1 ヘルスチェック

```bash
# デプロイURL取得
BACKEND_URL=$(gcloud run services describe lingo-keeper-backend \
  --region asia-northeast1 \
  --format 'value(status.url)')

echo "Backend URL: $BACKEND_URL"

# ヘルスチェック実行
curl $BACKEND_URL/api/health

# 期待レスポンス:
# {
#   "success": true,
#   "status": "healthy",
#   "timestamp": "2026-01-12T...",
#   "database": "connected"
# }
```

#### 4.2 API動作確認

```bash
# ストーリー一覧取得
curl $BACKEND_URL/api/stories

# クイズ一覧取得
curl $BACKEND_URL/api/quizzes

# 詳細ログ確認
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=lingo-keeper-backend" \
  --limit 50 \
  --format json
```

### 5. フロントエンド環境変数更新

**バックエンドデプロイURL取得後、Vercelの環境変数を更新**:

```bash
# Vercel CLIで更新
cd frontend
vercel env add VITE_API_URL production
# 入力: [Cloud Run URL] (例: https://lingo-keeper-backend-xxx-an.a.run.app)

# または、Vercel Dashboardで手動更新
# Settings → Environment Variables → VITE_API_URL → Edit
```

**更新後、フロントエンドを再デプロイ**:
```bash
cd frontend
vercel --prod
```

---

## 🔒 セキュリティベストプラクティス

### 1. 環境変数管理

- ✅ **Secret Manager使用**: API Keys, Database URL, JWT Secret
- ✅ **環境変数分離**: `.env.local`は`.gitignore`に追加
- ❌ **絶対禁止**: コードに直接ハードコード

### 2. CORS設定

```javascript
// backend/src/index.ts
app.use(cors({
  origin: process.env.CORS_ORIGIN, // 本番URL設定
  credentials: true,
}));
```

**本番環境**:
- `CORS_ORIGIN=https://lingo-keeper-jp.vercel.app`
- ワイルドカード (`*`) 使用禁止

### 3. Cloud Run セキュリティ

```bash
# 認証必要なエンドポイント設定（Phase 2以降）
gcloud run services update lingo-keeper-backend \
  --no-allow-unauthenticated \
  --ingress internal-and-cloud-load-balancing
```

### 4. データベースセキュリティ

- ✅ SSL接続必須（Neonはデフォルト有効）
- ✅ 接続プール設定
- ✅ クエリタイムアウト設定
- ✅ 定期バックアップ設定

---

## 📊 モニタリング & ロギング

### 1. Cloud Run ログ確認

```bash
# リアルタイムログ監視
gcloud logging tail "resource.type=cloud_run_revision AND resource.labels.service_name=lingo-keeper-backend"

# エラーログのみ抽出
gcloud logging read "resource.type=cloud_run_revision AND severity>=ERROR" \
  --limit 100 \
  --format json
```

### 2. パフォーマンスメトリクス

**Cloud Run Console → Metrics**:
- **Request Count**: リクエスト数
- **Request Latency**: レイテンシ（目標: p99 < 1秒）
- **Container CPU Utilization**: CPU使用率
- **Container Memory Utilization**: メモリ使用率
- **Billable Instance Time**: 課金時間

### 3. アラート設定（推奨）

```bash
# エラー率アラート作成（例: 5分間でエラー率5%超過）
gcloud alpha monitoring policies create \
  --notification-channels=[CHANNEL_ID] \
  --display-name="Backend Error Rate Alert" \
  --condition-display-name="Error rate > 5%" \
  --condition-threshold-value=0.05 \
  --condition-threshold-duration=300s
```

---

## 🔄 CI/CD パイプライン（将来実装）

### GitHub Actions例

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run E2E Tests
        run: |
          npm install
          npx playwright test

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: google-github-actions/setup-gcloud@v1
      - name: Build and Deploy
        run: |
          gcloud builds submit --tag gcr.io/lingo-keeper/backend:latest
          gcloud run deploy lingo-keeper-backend --image gcr.io/lingo-keeper/backend:latest

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        run: vercel --prod --token ${{ secrets.VERCEL_TOKEN }}
```

---

## 🆘 トラブルシューティング

### 問題: Cloud Runデプロイ失敗

**原因1: イメージビルドエラー**
```bash
# ローカルでビルドテスト
cd backend
docker build -t test .

# エラーログ確認
gcloud builds log [BUILD_ID]
```

**原因2: 環境変数未設定**
```bash
# 環境変数確認
gcloud run services describe lingo-keeper-backend \
  --region asia-northeast1 \
  --format yaml
```

### 問題: フロントエンドがバックエンドに接続できない

**確認1: CORS設定**
```bash
# DevTools Consoleでエラー確認
# "Access-Control-Allow-Origin" エラーの場合、CORS_ORIGIN設定確認
```

**確認2: VITE_API_URL確認**
```bash
# Vercel環境変数確認
cd frontend
vercel env ls
```

### 問題: データベース接続エラー

**確認1: DATABASE_URL正確性**
```bash
# Prismaで接続テスト
cd backend
npx prisma db execute --sql "SELECT 1"
```

**確認2: Neon接続制限**
- Neon Freeプランは接続数制限あり（検討: 接続プール設定）

---

## 📝 デプロイ後チェックリスト

- [ ] フロントエンドURL正常アクセス確認
- [ ] バックエンドヘルスチェック成功確認
- [ ] `/stories`ページ正常表示確認
- [ ] `/quiz`ページ正常表示確認
- [ ] API連携動作確認（DevTools Network）
- [ ] E2Eテスト全件再実行（本番URL使用）
- [ ] パフォーマンステスト実施
- [ ] エラーログ監視（最初の24時間）
- [ ] Cloud Runメトリクス確認
- [ ] Vercel Analyticsデータ確認

---

## 📚 参考リンク

- [Vercel Documentation](https://vercel.com/docs)
- [Google Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Neon PostgreSQL Documentation](https://neon.tech/docs)
- [Prisma Deployment Guide](https://www.prisma.io/docs/guides/deployment)

---

**作成者**: Lingo Keeper Team
**最終更新**: 2026-01-12
