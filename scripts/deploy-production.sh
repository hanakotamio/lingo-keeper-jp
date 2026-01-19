#!/bin/bash
set -e

echo "=========================================="
echo "本番環境デプロイスクリプト（Cloud Build使用）"
echo "=========================================="
echo ""

# プロジェクト設定
PROJECT_ID="lingo-keeper"
SERVICE_NAME="lingo-keeper-jp-backend"
REGION="asia-northeast1"

# Step 1: バックエンドデプロイ（初回）
echo "=== Step 1: バックエンドをCloud Runにデプロイ（Cloud Build使用） ==="
cd backend

# Cloud Buildでビルド＆デプロイ（Secret Managerを使用）
echo "Cloud Buildでビルド＆デプロイ中..."
gcloud run deploy $SERVICE_NAME \
  --source . \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --concurrency 80 \
  --timeout 300s \
  --set-secrets="DATABASE_URL=DATABASE_URL:latest,GOOGLE_CLOUD_PROJECT_ID=GOOGLE_CLOUD_PROJECT_ID:latest,OPENAI_API_KEY=OPENAI_API_KEY:latest,JWT_SECRET=JWT_SECRET:latest,SESSION_SECRET=SESSION_SECRET:latest,NODE_ENV=NODE_ENV:latest,CORS_ORIGIN=CORS_ORIGIN:latest,PORT=PORT:latest"

# バックエンドURLを取得
BACKEND_URL=$(gcloud run services describe $SERVICE_NAME --region $REGION --format='value(status.url)')
echo ""
echo "✅ バックエンドURL: $BACKEND_URL"
echo ""

cd ..

# Step 2: フロントエンドをVercelにデプロイ
echo "=== Step 2: フロントエンドをVercelにデプロイ ==="
cd frontend

# Vercelに環境変数を設定してデプロイ
echo "Vercelにデプロイ中..."
vercel --prod --yes -e VITE_API_URL=$BACKEND_URL

# フロントエンドURLを取得
echo "Vercel URLを取得中..."
FRONTEND_URL=$(vercel inspect --wait | grep -oP '(?<=https://)[^"]+' | head -1)

if [ -z "$FRONTEND_URL" ]; then
  echo "⚠️  フロントエンドURLを自動取得できませんでした。手動で確認してください。"
  echo "Vercel Dashboard: https://vercel.com/dashboard"
  read -p "フロントエンドURL (例: your-app.vercel.app): " FRONTEND_URL
fi

echo ""
echo "✅ フロントエンドURL: https://$FRONTEND_URL"
echo ""

cd ..

# Step 3: CORS_ORIGINを更新
echo "=== Step 3: CORS_ORIGINをフロントエンドURLで更新 ==="
echo "https://$FRONTEND_URL" | gcloud secrets versions add CORS_ORIGIN --data-file=-
echo "✅ CORS_ORIGINを更新しました"
echo ""

# Step 4: バックエンドを再デプロイ（CORS設定反映）
echo "=== Step 4: バックエンドを再デプロイ（CORS設定反映） ==="
cd backend

gcloud run deploy $SERVICE_NAME \
  --source . \
  --region $REGION \
  --platform managed \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --concurrency 80 \
  --timeout 300s \
  --set-secrets="DATABASE_URL=DATABASE_URL:latest,GOOGLE_CLOUD_PROJECT_ID=GOOGLE_CLOUD_PROJECT_ID:latest,OPENAI_API_KEY=OPENAI_API_KEY:latest,JWT_SECRET=JWT_SECRET:latest,SESSION_SECRET=SESSION_SECRET:latest,NODE_ENV=NODE_ENV:latest,CORS_ORIGIN=CORS_ORIGIN:latest,PORT=PORT:latest"

echo ""
echo "✅ バックエンドを再デプロイしました（CORS設定反映）"
echo ""

cd ..

# 完了メッセージ
echo "=========================================="
echo "🎉 デプロイ完了！"
echo "=========================================="
echo ""
echo "本番環境URL:"
echo "  フロントエンド: https://$FRONTEND_URL"
echo "  バックエンド: $BACKEND_URL"
echo ""
echo "次のステップ:"
echo "  1. ブラウザでフロントエンドにアクセス"
echo "  2. ログイン機能をテスト"
echo "  3. 主要機能の動作確認"
echo ""
