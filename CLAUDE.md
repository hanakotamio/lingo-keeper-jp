# プロジェクト設定

## 基本設定
```yaml
プロジェクト名: Lingo Keeper JP
開始日: 2026-01-10
技術スタック:
  frontend:
    - React 18
    - TypeScript 5
    - MUI v6
    - Vite 5
    - React Router v6
    - Zustand
    - React Query
  backend:
    - Python 3.12
    - FastAPI
    - SQLAlchemy
  database:
    - PostgreSQL (Neon)
  external_apis:
    - Google Cloud Text-to-Speech
    - Web Speech API
    - OpenAI GPT-4 (クイズ自動生成)
```

## 開発環境
```yaml
ポート設定:
  # 複数プロジェクト並行開発のため、一般的でないポートを使用
  frontend: 3847
  backend: 8534
  database: 5434

環境変数:
  設定ファイル: .env.local（ルートディレクトリ）
  必須項目:
    - DATABASE_URL: Neon PostgreSQL接続URL
    - GOOGLE_CLOUD_PROJECT_ID: GCPプロジェクトID
    - GOOGLE_APPLICATION_CREDENTIALS: GCPサービスアカウントキーのパス
    - OPENAI_API_KEY: OpenAI APIキー
```

## テスト認証情報
```yaml
開発用アカウント:
  # MVPフェーズは認証なし、LocalStorageのみ使用
  note: Phase 2以降で認証機能を追加予定

外部サービス:
  Google Cloud Platform:
    - Text-to-Speech API有効化
    - Cloud Run使用
  Neon:
    - データベース名: lingo_keeper_jp_dev
  Vercel:
    - デプロイ先: production / preview
  OpenAI:
    - クイズ自動生成用
    - モデル: GPT-4
```

## コーディング規約

### 命名規則
```yaml
ファイル名:
  - コンポーネント: PascalCase.tsx (例: StoryViewer.tsx)
  - ユーティリティ: camelCase.ts (例: formatJapaneseText.ts)
  - 定数: UPPER_SNAKE_CASE.ts (例: JLPT_LEVELS.ts)

変数・関数:
  - 変数: camelCase
  - 関数: camelCase
  - 定数: UPPER_SNAKE_CASE
  - 型/インターフェース: PascalCase
```

### コード品質
```yaml
必須ルール:
  - TypeScript: strictモード有効
  - 未使用の変数/import禁止
  - console.log本番環境禁止
  - エラーハンドリング必須
  - 関数行数: 100行以下（96.7%カバー）
  - ファイル行数: 700行以下（96.9%カバー）
  - 複雑度(McCabe): 10以下
  - 行長: 120文字

フォーマット:
  - インデント: スペース2つ
  - セミコロン: あり
  - クォート: シングル
```

## プロジェクト固有ルール

### APIエンドポイント
```yaml
命名規則:
  - RESTful形式を厳守
  - 複数形を使用 (/stories, /quizzes)
  - ケバブケース使用 (/quiz-results)

エンドポイント一覧:
  ストーリー:
    - GET /api/stories: ストーリー一覧取得
    - GET /api/stories/{id}: 特定ストーリー取得
    - GET /api/stories/{id}/chapters: チャプター一覧取得

  クイズ:
    - GET /api/quizzes: クイズ一覧取得
    - POST /api/quizzes/answer: 回答送信

  音声:
    - POST /api/tts/synthesize: 音声合成

  ヘルスチェック:
    - GET /api/health: ヘルスチェック
```

### 型定義
```yaml
配置:
  frontend: src/types/index.ts
  backend: src/types/index.ts

同期ルール:
  - 両ファイルは常に同一内容を保つ
  - 片方を更新したら即座にもう片方も更新

主要型定義:
  - Story: ストーリーデータ
  - Chapter: チャプターデータ
  - Choice: 選択肢データ
  - Quiz: クイズデータ
  - QuizChoice: クイズ選択肢
  - UserProgress: ユーザー進捗（LocalStorage）
  - JLPTLevel: N5 | N4 | N3 | N2 | N1
  - CEFRLevel: A1 | A2 | B1 | B2 | C1 | C2
```

### ストーリー分岐管理
```yaml
実装方式:
  - React.useReducer使用
  - 状態管理はZustandと併用

ストーリー構造:
  - ツリー型（階層的分岐）
  - 循環参照なし（一方向のみ）
  - 各チャプターは1つの親と複数の子を持つ

状態構造:
  currentStoryId: string
  currentChapterId: string
  selectedChoices: Choice[]
  progress: number (0-100)

アクション:
  - SELECT_STORY
  - LOAD_CHAPTER
  - SELECT_CHOICE
  - UPDATE_PROGRESS

UI設計:
  - 選択肢: カード形式
  - ホバー時ハイライト
  - クリックでアニメーション遷移
```

### LocalStorage管理
```yaml
キー命名規則:
  - プレフィックス: "lingo_keeper_"
  - 形式: lingo_keeper_{データ種別}

使用キー:
  - lingo_keeper_progress: ユーザー進捗データ
  - lingo_keeper_quiz_results: クイズ結果
  - lingo_keeper_settings: ユーザー設定

注意事項:
  - 容量制限: 5MB以内
  - JSONシリアライズ必須
  - エラーハンドリング実装
```

### 音声機能
```yaml
TTS（音声読み上げ）:
  - API: Google Cloud Text-to-Speech
  - 言語: ja-JP
  - 音声タイプ: ja-JP-Neural2-B（標準）
  - 実装場所: バックエンドAPI

STT（音声認識）:
  - API: Web Speech API
  - 言語: ja-JP
  - 実装場所: フロントエンド
  - ブラウザ対応: Chrome推奨

Phase 2拡張:
  - Azure Speech Services（発音評価）
  - CEFR基準評価

クイズ自動生成:
  - API: OpenAI GPT-4
  - 実装場所: バックエンドAPI
  - トリガー: 新ストーリー追加時、またはクイズ補充時
  - 生成内容: 読解/語彙/文法問題
  - JLPT/CEFRレベル考慮

進捗可視化:
  - 形式: 線グラフ
  - X軸: 時間（日/週/月）
  - Y軸: 正答率（%）またはレベル
  - レベル別色分け表示

音声認識誤認識対応:
  - 認識結果テキスト表示
  - 「もう一度試す」ボタン
  - サンプル回答提示（音声+テキスト）
  - 手動入力切替オプション
```

## 🆕 最新技術情報（知識カットオフ対応）
```yaml
# Web検索で解決した破壊的変更を記録

React 18関連:
  - useReducer + Zustandの併用パターン確立
  - Suspenseの標準化

MUI v7関連:
  - Grid2がGridに統合（Grid2 importは廃止、Gridを使用）
  - item propが削除（size={{ xs: 12, md: 4 }}を使用）
  - TypographyOptionsがTypographyVariantsOptionsに変更
  - type-only importが必須（verbatimModuleSyntax有効時）

FastAPI関連:
  - Python 3.12対応
  - Pydantic v2使用

Web Speech API:
  - Chrome/Edge推奨（Safari制限あり）
  - オフライン不可
  - HTTPS必須

Google Cloud TTS:
  - Neural2音声の利用可能
  - 月100万文字無料枠

Neon PostgreSQL:
  - サーバーレス対応
  - ブランチ機能活用可能
```

## セキュリティ要件
```yaml
MVPフェーズ:
  - HTTPS強制（本番環境）
  - セキュリティヘッダー設定
  - 入力値サニタイゼーション
  - CORS適切設定
  - エラーメッセージの情報漏洩防止

Phase 2以降:
  - 認証機能追加時にブルートフォース対策
  - パスワードポリシー（8文字以上）
  - セッション管理
```

## 運用要件
```yaml
ヘルスチェック:
  - エンドポイント: /api/health
  - レスポンス時間: 5秒以内
  - DB接続確認含む

グレースフルシャットダウン:
  - SIGTERM対応
  - タイムアウト: 8秒
  - 進行中リクエスト完了待機
```

## データベース設計
```yaml
主要テーブル:
  stories:
    - story_id (UUID, PK)
    - title (VARCHAR)
    - level_jlpt (ENUM)
    - level_cefr (ENUM)
    - created_at, updated_at

  chapters:
    - chapter_id (UUID, PK)
    - story_id (UUID, FK)
    - parent_chapter_id (UUID, FK, nullable) # ツリー構造
    - chapter_number (INT)
    - depth_level (INT) # ツリー深度
    - content (TEXT)
    - created_at, updated_at

  choices:
    - choice_id (UUID, PK)
    - chapter_id (UUID, FK)
    - choice_text (VARCHAR)
    - choice_description (TEXT) # カードUI用説明
    - next_chapter_id (UUID, FK)
    - display_order (INT)

  quizzes:
    - quiz_id (UUID, PK)
    - story_id (UUID, FK)
    - question_text (TEXT)
    - difficulty_level (ENUM)
    - is_ai_generated (BOOLEAN) # AI生成フラグ
    - source_text (TEXT) # 生成元テキスト
    - created_at, updated_at

  quiz_choices:
    - choice_id (UUID, PK)
    - quiz_id (UUID, FK)
    - choice_text (VARCHAR)
    - is_correct (BOOLEAN)
    - explanation (TEXT) # 解説
```

## デプロイ
```yaml
フロントエンド (Vercel):
  - ビルドコマンド: npm run build
  - 出力ディレクトリ: dist
  - 環境変数: VITE_API_URL

バックエンド (Google Cloud Run):
  - Dockerコンテナ使用
  - ポート: 8080（Cloud Run標準）
  - 環境変数: DATABASE_URL, GOOGLE_CLOUD_PROJECT_ID

データベース (Neon):
  - 接続プール使用
  - SSL接続必須
```

---

### 13. E2Eテスト自律実行の絶対原則

**【重要】セッション開始時・compact後の自動判定**

このセクションはE2Eテストオーケストレーターによって自動生成されました。

---

**最初に必ず専門知識を注入してください**

E2Eテスト実行中の場合、以下を実行してから開始してください：

```
inject_knowledge ツールで keyword: "@E2Eテストオーケストレーター"
を実行してから開始してください。（初回必須・compact後も必須）
```

重要：キーワードは "@E2Eテストオーケストレーター"
をそのまま使用してください。変換や推測は不要です。

準備完了です。まず知識注入を実行してから、タスクを開始してください。

---

**E2Eテストオーケストレーター実行中の判定**:
- SCOPE_PROGRESS.mdに「## 📊 E2Eテスト全体進捗」が存在する場合
- または、セッション再開時に前回のメッセージに「E2Eテスト」「オーケストレーター」キーワードがある場合

**セッション開始時・compact後の自動処理**:
1. 上記の判定基準でE2Eテスト実行中と判定
2. inject_knowledge('@E2Eテストオーケストレーター') を必ず実行
3. docs/e2e-best-practices.md の存在確認（なければ初期テンプレート作成）
4. SCOPE_PROGRESS.mdから [ ] テストの続きを自動で特定
5. [x] のテストは絶対にスキップ
6. ユーザー確認不要、完全自律モードで継続
7. ページ選定も自動（未完了ページを上から順に選択）
8. 停止条件：全テスト100%完了のみ

**5回エスカレーション後の処理**:
- チェックリストに [-] マークを付ける
- docs/e2e-test-history/skipped-tests.md に記録
- 次のテストへ自動で進む（停止しない）

**ベストプラクティス自動蓄積**:
- 各テストで成功した方法を docs/e2e-best-practices.md に自動保存
- 後続テストが前のテストの知見を自動活用
- 試行錯誤が減っていく（学習効果）

**重要**:
- この原則はCLAUDE.mdに記載されているため、compact後も自動で適用される
- セッション開始時にこのセクションがない場合、オーケストレーターが自動で追加する

---

**作成日**: 2026-01-10
**最終更新日**: 2026-01-12

---

## 🚀 デプロイ準備完了 (2026-01-15)

### ビルド状況
- ✅ フロントエンドビルド: 成功 (28.30s)
- ✅ バックエンドビルド: 成功
- ✅ TypeScriptエラー: 0件

### E2Eテスト結果
- **成功率**: 93.2% (41/44テスト)
- **成功**: 41テスト
- **失敗**: 3テスト
  - E2E-QUIZ-003: Correct Answer Flow (送信ボタン有効化問題)
  - E2E-QUIZ-007: Progress Graph Display (グラフデータポイント)
  - E2E-STORY-007: Choice Selection Flow (進捗バー更新)

### 修正完了項目 (18件)
1. LanguageSelectionModal (localStorage対応)
2. Sidebar aria-label追加
3. Dashboard テスト×6
4. Login テスト×2  
5. Quiz テスト×5 (quiz_choices→choices型名修正)
6. Story テスト×2
7. Layout verification×2

### デプロイ手順

#### 1. フロントエンド (Vercel)
```bash
cd frontend
vercel --prod
```

**環境変数設定 (Vercel Dashboard)**:
- `VITE_API_URL`: バックエンドURL (Cloud RunのURL)

#### 2. バックエンド (Google Cloud Run)
```bash
cd backend
gcloud run deploy lingo-keeper-jp-backend \
  --source . \
  --platform managed \
  --region asia-northeast1 \
  --allow-unauthenticated \
  --port 8080
```

**環境変数設定 (Cloud Run)**:
- `DATABASE_URL`: Neon PostgreSQL接続URL
- `GOOGLE_CLOUD_PROJECT_ID`: GCPプロジェクトID
- `OPENAI_API_KEY`: OpenAI APIキー

#### 3. データベース (Neon)
- 既存のNeonデータベースを使用
- マイグレーション実行:
  ```bash
  cd backend
  npx prisma migrate deploy
  npx prisma db seed
  ```

### 本番環境確認チェックリスト
- [ ] フロントエンドがアクセス可能
- [ ] バックエンドAPIが応答
- [ ] データベース接続確認
- [ ] ログイン機能動作確認
- [ ] ストーリー一覧表示確認
- [ ] クイズページ表示確認

**最終更新日**: 2026-01-15
