# マルチステージビルド（イメージサイズ最適化）
FROM node:18-slim AS builder

WORKDIR /app

# 必要なシステムパッケージをインストール
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

# 依存関係のみ先にインストール（キャッシュ最適化）
COPY package*.json ./
COPY prisma ./prisma/

# 依存関係のインストール（ビルドに必要なdevDependenciesも含む）
RUN npm ci && \
    npx prisma generate

# ソースコードのコピーとビルド
COPY . .
RUN npm run build

# 本番用依存関係のみ再インストール
RUN npm ci --only=production

# 本番用の最小イメージ
FROM node:18-slim

# 必要なシステムパッケージをインストール
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# 本番用依存関係のみコピー
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

# ⚠️ 環境変数はDockerfileに絶対に記載しない
# Cloud Runの--set-env-varsまたはSecret Managerで設定

# Cloud Runは8080ポートを使用
ENV PORT=8080
EXPOSE 8080

# ヘルスチェック
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080/api/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

# アプリケーション起動
CMD ["npm", "start"]
