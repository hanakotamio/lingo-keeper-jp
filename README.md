# 🇯🇵 Lingo Keeper JP

**日本語学習を革新する、インタラクティブストーリー型学習アプリケーション**

[![E2E Tests](https://img.shields.io/badge/E2E%20Tests-16%2F16%20Passed-brightgreen)](docs/SCOPE_PROGRESS.md)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-blue)](https://react.dev/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📖 プロジェクト概要

**Lingo Keeper JP**は、JLPTレベル別（N5-N1）の分岐型ストーリーとクイズを通じて、楽しく効果的に日本語を学習できるWebアプリケーションです。

### ✨ 主な機能

- **📚 分岐型ストーリー体験**
  - 6つのストーリー（N5～N1レベル対応）
  - プレイヤーの選択で物語が分岐する インタラクティブ体験
  - ルビ・翻訳表示の切り替え
  - 音声読み上げ機能（Google Cloud TTS）

- **🎯 適応型クイズシステム**
  - AI自動生成クイズ（GPT-4搭載）
  - 読解・語彙・文法問題
  - レベル別進捗追跡
  - グラフによる学習状況可視化

- **🎨 快適なユーザー体験**
  - Material-UI v7によるモダンなデザイン
  - レスポンシブ対応（PC/タブレット/スマートフォン）
  - 高速なページ遷移（React Router v7）
  - ダークモード対応（Phase 2予定）

---

## 🏗️ 技術スタック

### Frontend

| 技術 | バージョン | 用途 |
|------|------------|------|
| React | 19.0 | UIフレームワーク |
| TypeScript | 5.7 | 型安全性 |
| Material-UI | v7 | UIコンポーネント |
| Vite | 7.3 | ビルドツール |
| React Router | v7 | ルーティング |
| Zustand | 5.x | 状態管理 |
| React Query | - | データフェッチング |
| Axios | 1.x | HTTP通信 |

### Backend

| 技術 | バージョン | 用途 |
|------|------------|------|
| Node.js | 20 LTS | ランタイム |
| Express | 4.x | Webフレームワーク |
| TypeScript | 5.7 | 型安全性 |
| Prisma | 5.x | ORMツール |
| PostgreSQL | - | データベース（Neon） |

### External APIs

| サービス | 用途 |
|----------|------|
| Google Cloud Text-to-Speech | 音声合成 |
| OpenAI GPT-4 | クイズ自動生成 |

### Infrastructure

| サービス | 用途 |
|----------|------|
| Vercel | フロントエンドホスティング |
| Google Cloud Run | バックエンドコンテナ実行 |
| Neon PostgreSQL | サーバーレスデータベース |

---

## 🚀 クイックスタート

### 前提条件

- Node.js 18.0以上
- npm 9.0以上
- PostgreSQL（Neon推奨）
- Google Cloud Platform アカウント（TTS API有効化）
- OpenAI API キー

### 1. リポジトリクローン

```bash
git clone https://github.com/your-org/lingo-keeper-jp.git
cd lingo-keeper-jp
```

### 2. 環境変数設定

ルートディレクトリに `.env.local` を作成：

```bash
# テンプレートをコピー
cp .env.example .env.local

# 必要な環境変数を設定
DATABASE_URL=postgresql://user:password@host/database?sslmode=require
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_APPLICATION_CREDENTIALS=/path/to/gcp-key.json
OPENAI_API_KEY=sk-proj-...
VITE_API_URL=http://localhost:8534
```

詳細は `backend/.env.example` および `frontend/.env.example` を参照。

### 3. 依存関係インストール

```bash
# バックエンド
cd backend
npm install
npx prisma generate
npx prisma db push

# フロントエンド
cd ../frontend
npm install
```

### 4. 開発サーバー起動

**ターミナル1 - バックエンド**:
```bash
cd backend
npm run dev
# http://localhost:8534 で起動
```

**ターミナル2 - フロントエンド**:
```bash
cd frontend
npm run dev
# http://localhost:3847 で起動
```

### 5. アプリケーションにアクセス

ブラウザで [http://localhost:3847](http://localhost:3847) を開く

---

## 🧪 テスト

### E2Eテスト実行

```bash
cd frontend

# 開発サーバーが起動していることを確認
npm run test:e2e
```

**テスト実績**:
- ✅ Story Experience: 8/8項目パス
- ✅ Quiz Progress: 8/8項目パス
- ✅ 合計: **16/16項目パス（100%）**

詳細: [docs/SCOPE_PROGRESS.md](docs/SCOPE_PROGRESS.md)

### TypeScriptエラーチェック

```bash
# フロントエンド
cd frontend && npx tsc --noEmit

# バックエンド
cd backend && npm run typecheck
```

### Lint実行

```bash
# フロントエンド
cd frontend && npm run lint

# バックエンド
cd backend && npm run lint
```

---

## 📦 ビルド

### フロントエンド

```bash
cd frontend
npm run build
# 出力: dist/
```

**ビルドサイズ**:
- Main JS: 603.72 KB（gzip: 189.27 KB）
- CSS: 0.29 KB
- **合計**: 604.80 KB（gzip: 189.96 KB）

最適化推奨事項: [docs/performance-report.md](docs/performance-report.md)

### バックエンド

```bash
cd backend
npm run build
# 出力: dist/
```

---

## 🚢 デプロイ

詳細なデプロイ手順は [docs/deployment-guide.md](docs/deployment-guide.md) を参照。

### フロントエンド（Vercel）

```bash
cd frontend
vercel --prod
```

### バックエンド（Google Cloud Run）

```bash
cd backend

# Dockerイメージビルド
gcloud builds submit --tag gcr.io/[PROJECT-ID]/backend:latest

# Cloud Runデプロイ
gcloud run deploy lingo-keeper-backend \
  --image gcr.io/[PROJECT-ID]/backend:latest \
  --platform managed \
  --region asia-northeast1 \
  --allow-unauthenticated
```

### 環境変数設定

**本番環境の環境変数**:
- Vercel: Dashboard → Environment Variables
- Cloud Run: Secret Manager使用推奨

---

## 📂 プロジェクト構造

```
Lingo Keeper JP/
├── frontend/                 # React フロントエンド
│   ├── src/
│   │   ├── pages/           # ページコンポーネント
│   │   │   ├── StoryExperience/
│   │   │   └── QuizProgress/
│   │   ├── services/        # APIサービス
│   │   │   └── api/
│   │   ├── hooks/           # カスタムフック
│   │   ├── types/           # 型定義
│   │   └── lib/             # ユーティリティ
│   ├── tests/e2e/           # E2Eテスト（Playwright）
│   └── dist/                # ビルド出力
│
├── backend/                  # Node.js バックエンド
│   ├── src/
│   │   ├── controllers/     # APIコントローラー
│   │   ├── routes/          # ルート定義
│   │   ├── services/        # ビジネスロジック
│   │   ├── repositories/    # データアクセス層
│   │   └── middleware/      # ミドルウェア
│   ├── prisma/              # Prismaスキーマ・マイグレーション
│   ├── tests/               # バックエンドテスト
│   └── dist/                # ビルド出力
│
├── docs/                     # ドキュメント
│   ├── SCOPE_PROGRESS.md    # E2Eテスト進捗
│   ├── deployment-guide.md  # デプロイガイド
│   ├── performance-report.md # パフォーマンスレポート
│   ├── api-specs/           # API仕様書
│   ├── e2e-specs/           # E2Eテスト仕様書
│   └── e2e-test-history/    # テスト履歴
│
├── CLAUDE.md                 # Claude Code設定
├── .env.local                # 環境変数（gitignore）
└── README.md                 # このファイル
```

---

## 📖 ドキュメント

| ドキュメント | 説明 |
|--------------|------|
| [CLAUDE.md](CLAUDE.md) | プロジェクト設定・コーディング規約 |
| [docs/SCOPE_PROGRESS.md](docs/SCOPE_PROGRESS.md) | E2Eテスト進捗管理 |
| [docs/deployment-guide.md](docs/deployment-guide.md) | デプロイ完全ガイド |
| [docs/performance-report.md](docs/performance-report.md) | パフォーマンス分析・最適化 |
| [docs/e2e-specs/](docs/e2e-specs/) | E2Eテスト仕様書（16項目） |
| [docs/api-specs/](docs/api-specs/) | REST API仕様書 |

---

## 🎯 開発ロードマップ

### Phase 1 (MVP) - ✅ **完了**
- [x] フロントエンド基盤構築（React + MUI + TypeScript）
- [x] バックエンドAPI実装（Express + Prisma + PostgreSQL）
- [x] ストーリー体験機能（6ストーリー、分岐選択、音声合成）
- [x] クイズ進捗管理（ランダム出題、正誤判定、進捗グラフ）
- [x] E2Eテスト完全実装（16/16項目 100%）
- [x] デプロイ環境準備（Vercel + Cloud Run）

### Phase 1.5 (最適化) - 🔄 **進行中**
- [ ] コード分割（Route-based Lazy Loading）
- [ ] バンドルサイズ最適化（Manual Chunks）
- [ ] CI/CD パイプライン構築
- [ ] モニタリング導入（Vercel Analytics）

### Phase 2 (機能拡張)
- [ ] ユーザー認証・ログイン機能
- [ ] 学習進捗の永続化（データベース保存）
- [ ] ダークモード実装
- [ ] 音声認識（発音評価）
- [ ] ソーシャル共有機能

### Phase 3 (スケール)
- [ ] モバイルアプリ（React Native）
- [ ] 多言語対応（英語・中国語）
- [ ] ストーリー投稿機能（UGC）
- [ ] コミュニティ機能

---

## 🤝 コントリビューション

現在、このプロジェクトは開発初期段階のため、外部コントリビューションは受け付けておりません。Phase 2以降で公開予定です。

---

## 📄 ライセンス

MIT License - 詳細は [LICENSE](LICENSE) を参照

---

## 👥 開発チーム

**Lingo Keeper Team**
- プロジェクト開始: 2026-01-10
- 最終更新: 2026-01-12

---

## 📮 お問い合わせ

プロジェクトに関するお問い合わせ:
- GitHub Issues: [Issues](https://github.com/your-org/lingo-keeper-jp/issues)
- Email: [お問い合わせメールアドレス]

---

## 🙏 謝辞

このプロジェクトは以下の技術・サービスを利用しています:
- [React](https://react.dev/) - UIライブラリ
- [Material-UI](https://mui.com/) - UIコンポーネント
- [Google Cloud Platform](https://cloud.google.com/) - インフラストラクチャ
- [OpenAI](https://openai.com/) - AI技術
- [Vercel](https://vercel.com/) - ホスティング
- [Neon](https://neon.tech/) - データベース

---

**Made with ❤️ for Japanese learners worldwide**
