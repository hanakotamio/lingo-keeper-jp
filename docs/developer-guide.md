# Lingo Keeper JP - 開発者ガイド

**作成日**: 2026-01-12
**対象**: 新規開発者・コントリビューター

---

## 📋 目次

1. [開発環境セットアップ](#開発環境セットアップ)
2. [プロジェクト構造](#プロジェクト構造)
3. [開発ワークフロー](#開発ワークフロー)
4. [コーディング規約](#コーディング規約)
5. [テスト戦略](#テスト戦略)
6. [トラブルシューティング](#トラブルシューティング)
7. [よくある質問](#よくある質問)

---

## 🛠️ 開発環境セットアップ

### 必須ツール

```bash
# Node.js (LTS推奨)
node --version  # v20.x以上

# npm
npm --version   # v9.x以上

# Git
git --version   # v2.x以上
```

### 推奨ツール

- **エディタ**: VS Code
  - 拡張機能:
    - ESLint
    - Prettier
    - TypeScript and JavaScript Language Features
    - Prisma
- **ブラウザ**: Chrome (DevTools)
- **ターミナル**: iTerm2 / Windows Terminal / Bash

### 初回セットアップ

```bash
# 1. リポジトリクローン
git clone https://github.com/your-org/lingo-keeper-jp.git
cd lingo-keeper-jp

# 2. 環境変数設定
cp .env.example .env.local
# .env.localを編集して必要な値を設定

# 3. バックエンドセットアップ
cd backend
npm install
npx prisma generate
npx prisma db push
npm run dev  # http://localhost:8534

# 4. フロントエンドセットアップ（別ターミナル）
cd ../frontend
npm install
npm run dev  # http://localhost:3847
```

---

## 📂 プロジェクト構造

### Frontend構造

```
frontend/src/
├── pages/                    # ページコンポーネント
│   ├── StoryExperience/     # ストーリー体験ページ
│   │   ├── StoryExperiencePage.tsx
│   │   ├── StoryList.tsx
│   │   └── StoryViewer.tsx
│   └── QuizProgress/        # クイズ進捗ページ
│       └── QuizProgressPage.tsx
├── services/                 # ビジネスロジック
│   └── api/                 # API通信
│       ├── axios.ts         # Axiosインスタンス
│       ├── StoryApiService.ts
│       ├── QuizApiService.ts
│       └── ProgressApiService.ts
├── hooks/                    # カスタムフック
│   ├── useStoryData.ts
│   ├── useQuizData.ts
│   └── useStoryViewer.ts
├── types/                    # 型定義
│   └── index.ts
└── lib/                      # ユーティリティ
    └── logger.ts
```

### Backend構造

```
backend/src/
├── controllers/              # APIコントローラー
│   ├── story.controller.ts
│   ├── quiz.controller.ts
│   └── progress.controller.ts
├── routes/                   # ルート定義
│   ├── story.routes.ts
│   └── quiz.routes.ts
├── services/                 # ビジネスロジック
│   ├── story.service.ts
│   └── quiz.service.ts
├── repositories/             # データアクセス層
│   └── story.repository.ts
├── middleware/               # ミドルウェア
│   └── error.middleware.ts
└── lib/                      # ユーティリティ
    ├── logger.ts
    └── db.ts                # Prismaクライアント
```

---

## 🔄 開発ワークフロー

### 1. ブランチ戦略（Git Flow）

```
main          # 本番環境（デプロイ可能な状態）
└── develop   # 開発ブランチ
    └── feature/[feature-name]  # 機能開発ブランチ
    └── fix/[bug-name]          # バグ修正ブランチ
```

### 2. 機能開発フロー

```bash
# 1. 最新のdevelopブランチを取得
git checkout develop
git pull origin develop

# 2. 機能ブランチ作成
git checkout -b feature/add-dark-mode

# 3. 開発・コミット
git add .
git commit -m "feat: add dark mode toggle"

# 4. プッシュ・PR作成
git push origin feature/add-dark-mode
# GitHubでPull Request作成
```

### 3. コミットメッセージ規約

```
<type>: <subject>

[optional body]

[optional footer]
```

**Type一覧**:
- `feat`: 新機能追加
- `fix`: バグ修正
- `refactor`: リファクタリング
- `docs`: ドキュメント変更
- `test`: テスト追加・修正
- `chore`: ビルド・設定変更

**例**:
```
feat: add story filter by JLPT level

- Added dropdown filter in StoryList component
- Connected to useStoryData hook with levelFilter param
- Added E2E test for filter functionality

Closes #42
```

---

## 📐 コーディング規約

### TypeScript

```typescript
// ✅ Good: 明示的な型定義
function getStoryById(storyId: string): Promise<Story> {
  return StoryApiService.getStoryById(storyId);
}

// ❌ Bad: any型使用
function getStoryById(storyId: any): Promise<any> {
  return StoryApiService.getStoryById(storyId);
}
```

### React コンポーネント

```typescript
// ✅ Good: Functional Component with TypeScript
interface StoryCardProps {
  story: Story;
  onClick: (storyId: string) => void;
}

export const StoryCard: React.FC<StoryCardProps> = ({ story, onClick }) => {
  return (
    <Card onClick={() => onClick(story.story_id)}>
      <Typography>{story.title}</Typography>
    </Card>
  );
};

// ❌ Bad: Props型なし
export const StoryCard = ({ story, onClick }) => {
  // ...
};
```

### API通信

```typescript
// ✅ Good: 専用サービスクラス使用
const stories = await StoryApiService.getStoryList();

// ❌ Bad: 直接axios呼び出し
const stories = await axios.get('/api/stories');
```

### エラーハンドリング

```typescript
// ✅ Good: try-catch with logging
try {
  const data = await fetchData();
  logger.info('Data fetched', { count: data.length });
} catch (error) {
  logger.error('Failed to fetch data', {
    error: error instanceof Error ? error.message : String(error)
  });
  throw error;
}

// ❌ Bad: エラーを無視
try {
  await fetchData();
} catch {}
```

---

## 🧪 テスト戦略

### E2Eテスト（Playwright）

```typescript
// tests/e2e/story.spec.ts
test('E2E-STORY-001: Story List Display', async ({ page }) => {
  // Step 1: Navigate to page
  await page.goto('http://localhost:3847/stories');

  // Step 2: Verify elements
  await expect(page.locator('[data-testid="story-card"]').first())
    .toBeVisible({ timeout: 10000 });
});
```

**実行**:
```bash
cd frontend
npm run test:e2e
```

### テストカバレッジ目標

| 種類 | 目標カバレッジ |
|------|----------------|
| E2E | 100%（クリティカルフロー） |
| Unit | 80%以上 |
| Integration | 70%以上 |

---

## 🐛 トラブルシューティング

### 問題: E2Eテストが失敗する

**原因**: 開発サーバーが起動していない

**解決策**:
```bash
# ターミナル1: バックエンド起動
cd backend && npm run dev

# ターミナル2: フロントエンド起動
cd frontend && npm run dev

# ターミナル3: E2Eテスト実行
cd frontend && npm run test:e2e
```

### 問題: Prisma Client生成エラー

**原因**: スキーマ変更後にクライアント未再生成

**解決策**:
```bash
cd backend
npx prisma generate
npx prisma db push
```

### 問題: CORS エラー

**原因**: `.env.local`の`CORS_ORIGIN`設定が誤っている

**解決策**:
```bash
# .env.local
CORS_ORIGIN=http://localhost:3847  # フロントエンドURL
```

---

## ❓ よくある質問

### Q1: 新しいAPIエンドポイントを追加するには？

```typescript
// 1. backend/src/controllers/story.controller.ts
export const getStoryByTitle = async (req: Request, res: Response) => {
  const { title } = req.params;
  const story = await StoryService.getByTitle(title);
  res.json({ success: true, data: story });
};

// 2. backend/src/routes/story.routes.ts
router.get('/stories/title/:title', getStoryByTitle);

// 3. frontend/src/services/api/StoryApiService.ts
static async getStoryByTitle(title: string): Promise<Story> {
  const response = await apiClient.get(`/api/stories/title/${title}`);
  return response.data.data;
}
```

### Q2: 新しいページを追加するには？

```typescript
// 1. frontend/src/pages/NewPage/NewPage.tsx を作成

// 2. frontend/src/App.tsx にルート追加
<Route path="/new-page" element={<NewPage />} />

// 3. E2Eテスト作成
// frontend/tests/e2e/new-page.spec.ts
```

### Q3: データベーススキーマを変更するには？

```bash
# 1. backend/prisma/schema.prisma を編集

# 2. マイグレーション作成
npx prisma migrate dev --name add_new_field

# 3. クライアント再生成
npx prisma generate
```

### Q4: 環境変数を追加するには？

```bash
# 1. .env.local に追加
NEW_API_KEY=value

# 2. .env.example にテンプレート追加
NEW_API_KEY=your-api-key-here

# 3. コードで使用
// Frontend (Viteの場合)
const apiKey = import.meta.env.VITE_NEW_API_KEY;

// Backend
const apiKey = process.env.NEW_API_KEY;
```

---

## 🔗 関連ドキュメント

- [README.md](../README.md) - プロジェクト概要
- [CLAUDE.md](../CLAUDE.md) - プロジェクト設定詳細
- [deployment-guide.md](deployment-guide.md) - デプロイ手順
- [performance-report.md](performance-report.md) - パフォーマンス分析
- [API仕様書](api-specs/) - REST API仕様

---

## 📞 サポート

質問・問題が解決しない場合:
1. [GitHub Issues](https://github.com/your-org/lingo-keeper-jp/issues) で検索
2. 新しいIssueを作成（テンプレート使用）
3. チームチャットで質問

---

**Happy Coding! 🚀**
