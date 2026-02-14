# デプロイメントガイド

## 本番環境URL（⚠️ 変更禁止）

- **フロントエンド**: https://lingo-keeper-jp.vercel.app
  - Production URL: https://lingo-keeper-gj3yxt6vz-mio-furumakis-projects.vercel.app
- **バックエンド**: https://lingo-keeper-jp-backend-16378814888.asia-northeast1.run.app
- **データベース**: Neon PostgreSQL（本番環境用DB）

## デプロイ方法

### クイックデプロイ（推奨）

```bash
./scripts/deploy-production.sh
```

このスクリプトは以下を自動実行します：
1. バックエンドをCloud Runにデプロイ（Cloud Build使用）
2. フロントエンドをVercelにデプロイ
3. CORS_ORIGINをフロントエンドURLで更新
4. バックエンドを再デプロイ（CORS設定反映）

### 個別デプロイ

#### バックエンドのみデプロイ

```bash
cd backend
gcloud run deploy lingo-keeper-jp-backend \
  --source . \
  --region asia-northeast1 \
  --platform managed \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --concurrency 80 \
  --timeout 300s \
  --port 8080 \
  --set-secrets="DATABASE_URL=DATABASE_URL:latest,GOOGLE_CLOUD_PROJECT_ID=GOOGLE_CLOUD_PROJECT_ID:latest,OPENAI_API_KEY=OPENAI_API_KEY:latest,JWT_SECRET=JWT_SECRET:latest,SESSION_SECRET=SESSION_SECRET:latest,NODE_ENV=NODE_ENV:latest,CORS_ORIGIN=CORS_ORIGIN:latest"
```

#### フロントエンドのみデプロイ

```bash
cd frontend
vercel --prod
```

## 環境変数管理

### バックエンド環境変数（Secret Manager）

以下の環境変数はGoogle Cloud Secret Managerで管理されています：

| 環境変数名 | 説明 | 設定方法 |
|-----------|------|---------|
| DATABASE_URL | Neon PostgreSQL接続URL | `echo -n "..." \| gcloud secrets create DATABASE_URL --data-file=-` |
| GOOGLE_CLOUD_PROJECT_ID | GCPプロジェクトID | `echo -n "lingo-keeper" \| gcloud secrets create GOOGLE_CLOUD_PROJECT_ID --data-file=-` |
| OPENAI_API_KEY | OpenAI APIキー（クイズ自動生成） | `echo -n "sk-..." \| gcloud secrets create OPENAI_API_KEY --data-file=-` |
| JWT_SECRET | JWT署名用秘密鍵 | `echo -n "$(openssl rand -base64 32)" \| gcloud secrets create JWT_SECRET --data-file=-` |
| SESSION_SECRET | セッション署名用秘密鍵 | `echo -n "$(openssl rand -base64 32)" \| gcloud secrets create SESSION_SECRET --data-file=-` |
| NODE_ENV | 環境（production/development） | `echo -n "production" \| gcloud secrets create NODE_ENV --data-file=-` |
| CORS_ORIGIN | CORS許可オリジン | `echo -n "https://lingo-keeper-jp.vercel.app" \| gcloud secrets create CORS_ORIGIN --data-file=-` |

### Secret Managerでの環境変数更新

```bash
# シークレットの現在の値を確認
gcloud secrets versions access latest --secret="CORS_ORIGIN"

# シークレットの値を更新（新しいバージョンを追加）
echo -n "新しい値" | gcloud secrets versions add CORS_ORIGIN --data-file=-
```

### フロントエンド環境変数（Vercel）

Vercel環境変数はVercel Dashboardまたはコマンドラインで管理：

| 環境変数名 | 値 | 設定方法 |
|-----------|---|---------|
| VITE_API_URL | バックエンドAPI URL | Vercel Dashboard または `vercel env add VITE_API_URL` |

**Vercel Dashboard**: https://vercel.com/dashboard → プロジェクト選択 → Settings → Environment Variables

## デプロイ前チェックリスト

- [ ] TypeScriptエラーが0件（`npm run type-check`）
- [ ] フロントエンドビルドが成功（`cd frontend && npm run build`）
- [ ] バックエンドビルドが成功（`cd backend && npm run build`）
- [ ] 環境変数が全て設定済み（Secret Manager / Vercel Dashboard）
- [ ] データベースマイグレーションが完了（`npx prisma db push`）

## デプロイ後の確認事項

### 1. バックエンドヘルスチェック

```bash
curl https://lingo-keeper-jp-backend-16378814888.asia-northeast1.run.app/api/health
```

期待されるレスポンス：
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2026-02-05T00:00:00.000Z",
  "database": "connected"
}
```

### 2. フロントエンドアクセス確認

ブラウザで以下を確認：
- [ ] https://lingo-keeper-jp.vercel.app にアクセス可能
- [ ] ストーリー一覧が表示される（25個のストーリーカード）
- [ ] ストーリー詳細ページが開く
- [ ] クイズページが開く

### 3. API動作確認

```bash
# ストーリー一覧取得
curl https://lingo-keeper-jp-backend-16378814888.asia-northeast1.run.app/api/stories

# 特定のストーリー取得
curl https://lingo-keeper-jp-backend-16378814888.asia-northeast1.run.app/api/stories/1
```

## トラブルシューティング

### バックエンドがエラーを返す場合

```bash
# Cloud Runログを確認
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=lingo-keeper-jp-backend" --limit 50 --format json

# 最新のリビジョン情報を確認
gcloud run revisions list --service=lingo-keeper-jp-backend --region=asia-northeast1
```

### フロントエンドが表示されない場合

```bash
# Vercelデプロイログを確認
vercel logs https://lingo-keeper-jp.vercel.app

# Vercelビルドログを確認（Vercel Dashboardで確認）
```

### CORS エラーが発生する場合

```bash
# CORS_ORIGIN シークレットを確認
gcloud secrets versions access latest --secret="CORS_ORIGIN"

# 正しいフロントエンドURLに更新
echo -n "https://lingo-keeper-jp.vercel.app" | gcloud secrets versions add CORS_ORIGIN --data-file=-

# バックエンドを再デプロイ（CORS設定反映のため）
./scripts/deploy-production.sh
```

## 参考リンク

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Google Cloud Console**: https://console.cloud.google.com
- **Neon Console**: https://console.neon.tech
- **Cloud Run Console**: https://console.cloud.google.com/run?project=lingo-keeper

## デプロイ履歴

| 日付 | バージョン | 変更内容 |
|------|----------|---------|
| 2026-01-17 | v1.0 | 初回デプロイ（母国語選択機能削除、英語固定） |
| 2026-01-20 | v1.1 | ストーリーカード表示問題修正（VITE_API_URL修正） |
| 2026-01-26 | v1.2 | TypeScriptエラー修正、Git作者メール変更対応 |
| 2026-02-05 | v1.3 | デプロイメントガイド作成、動作確認完了 |
| 2026-02-05 | v1.4 | 正しいVercelプロジェクト（lingo-keeper-jp）へ再デプロイ、CORS設定更新 |

---

**最終更新**: 2026-02-05
**メンテナンス担当**: Lingo Keeper JP Development Team
