# Lingo Keeper JP - REST API 仕様書

**バージョン**: 1.0.0
**作成日**: 2026-01-12
**ベースURL**: `http://localhost:8534` (開発) / `https://your-domain.run.app` (本番)

---

## 📋 目次

1. [概要](#概要)
2. [認証](#認証)
3. [エラーハンドリング](#エラーハンドリング)
4. [APIエンドポイント](#apiエンドポイント)
   - [ヘルスチェック](#ヘルスチェック)
   - [ストーリー](#ストーリー)
   - [チャプター](#チャプター)
   - [クイズ](#クイズ)
   - [音声合成](#音声合成)
   - [進捗管理](#進捗管理)

---

## 📖 概要

### API設計原則

- **RESTful**: リソースベースのURL設計
- **JSON**: 全てのリクエスト/レスポンスはJSON形式
- **ステートレス**: セッション状態を保持しない
- **統一レスポンス**: 成功/エラーレスポンスの統一フォーマット

### 統一レスポンス形式

**成功レスポンス**:
```json
{
  "success": true,
  "data": { /* リソースデータ */ },
  "count": 10  // リスト取得時のみ
}
```

**エラーレスポンス**:
```json
{
  "success": false,
  "error": "エラーメッセージ",
  "details": { /* 追加情報（任意） */ }
}
```

---

## 🔐 認証

**Phase 1 (MVP)**: 認証なし（全エンドポイント公開）

**Phase 2予定**:
- JWT認証
- Bearerトークン使用

```http
Authorization: Bearer <JWT_TOKEN>
```

---

## ⚠️ エラーハンドリング

### HTTPステータスコード

| コード | 意味 | 使用例 |
|--------|------|--------|
| 200 | OK | 成功 |
| 201 | Created | リソース作成成功 |
| 400 | Bad Request | バリデーションエラー |
| 404 | Not Found | リソースが見つからない |
| 500 | Internal Server Error | サーバーエラー |
| 503 | Service Unavailable | DB接続エラー |

### エラーレスポンス例

```json
{
  "success": false,
  "error": "Story not found",
  "details": {
    "storyId": "invalid-id"
  }
}
```

---

## 🔌 APIエンドポイント

### ヘルスチェック

#### `GET /api/health`

**説明**: サーバーとデータベースの正常性確認

**リクエスト**: なし

**レスポンス**:
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2026-01-12T04:32:44.059Z",
  "database": "connected"
}
```

**エラーレスポンス** (503):
```json
{
  "success": false,
  "status": "unhealthy",
  "timestamp": "2026-01-12T04:32:44.059Z",
  "database": "disconnected"
}
```

---

### ストーリー

#### `GET /api/stories`

**説明**: ストーリー一覧取得

**クエリパラメータ**: なし（Phase 1）

**レスポンス** (200):
```json
{
  "success": true,
  "data": [
    {
      "story_id": "1",
      "title": "東京での新しい生活",
      "description": "初めて東京に来た留学生の1日を追体験...",
      "level_jlpt": "N3",
      "level_cefr": "B1",
      "estimated_time": 10,
      "thumbnail_url": null,
      "root_chapter_id": "ch-1-1",
      "created_at": "2026-01-11T23:07:00.423Z",
      "updated_at": "2026-01-11T23:07:00.423Z"
    }
  ],
  "count": 6
}
```

**フィールド説明**:
| フィールド | 型 | 説明 |
|------------|-----|------|
| story_id | string | ストーリーID |
| title | string | ストーリータイトル |
| description | string | ストーリー説明 |
| level_jlpt | string | JLPTレベル (N5-N1) |
| level_cefr | string | CEFRレベル (A1-C2) |
| estimated_time | number | 推定所要時間（分） |
| thumbnail_url | string\|null | サムネイル画像URL |
| root_chapter_id | string | ルートチャプターID |
| created_at | string | 作成日時（ISO 8601） |
| updated_at | string | 更新日時（ISO 8601） |

---

#### `GET /api/stories/:id`

**説明**: 特定ストーリーの詳細取得

**パスパラメータ**:
- `id` (string, required): ストーリーID

**レスポンス** (200):
```json
{
  "success": true,
  "data": {
    "story_id": "1",
    "title": "東京での新しい生活",
    "description": "初めて東京に来た留学生の1日を追体験...",
    "level_jlpt": "N3",
    "level_cefr": "B1",
    "estimated_time": 10,
    "thumbnail_url": null,
    "root_chapter_id": "ch-1-1",
    "created_at": "2026-01-11T23:07:00.423Z",
    "updated_at": "2026-01-11T23:07:00.423Z"
  }
}
```

**エラーレスポンス** (404):
```json
{
  "success": false,
  "error": "Story not found"
}
```

---

### チャプター

#### `GET /api/chapters/:id`

**説明**: 特定チャプターの取得

**パスパラメータ**:
- `id` (string, required): チャプターID

**レスポンス** (200):
```json
{
  "success": true,
  "data": {
    "chapter_id": "ch-1-1",
    "story_id": "1",
    "parent_chapter_id": null,
    "chapter_number": 1,
    "depth_level": 0,
    "content": "あなたは東京に到着したばかりの留学生です。",
    "content_with_ruby": "<p>あなたは<ruby>東京<rt>とうきょう</rt></ruby>に...</p>",
    "translation": "You are an international student who just arrived in Tokyo.",
    "created_at": "2026-01-11T23:07:00.800Z",
    "updated_at": "2026-01-11T23:07:00.800Z",
    "choices": [
      {
        "choice_id": "choice-1-1-a",
        "chapter_id": "ch-1-1",
        "choice_text": "渋谷に行く",
        "choice_description": "賑やかな渋谷を探索します",
        "next_chapter_id": "ch-1-2a",
        "display_order": 1,
        "created_at": "2026-01-11T23:07:00.800Z"
      }
    ]
  }
}
```

**フィールド説明**:
| フィールド | 型 | 説明 |
|------------|-----|------|
| chapter_id | string | チャプターID |
| story_id | string | 所属ストーリーID |
| parent_chapter_id | string\|null | 親チャプターID |
| chapter_number | number | チャプター番号 |
| depth_level | number | ツリー深度 (0=ルート) |
| content | string | プレーンテキスト |
| content_with_ruby | string | ルビ付きHTML |
| translation | string | 英語翻訳 |
| choices | array | 選択肢配列 |

---

### クイズ

#### `GET /api/quizzes`

**説明**: ランダムクイズ1問取得

**クエリパラメータ**: なし（Phase 1）

**レスポンス** (200):
```json
{
  "success": true,
  "data": {
    "quiz_id": "quiz-1",
    "story_id": "5",
    "question_text": "次の文章の内容に最も合うものを選びなさい。「京都には伝統工芸を守る職人がまだ存在する」",
    "question_type": "読解",
    "difficulty_level": "N1",
    "is_ai_generated": false,
    "source_text": "京都の伝統工芸職人との対話",
    "created_at": "2026-01-11T23:07:02.106Z",
    "updated_at": "2026-01-11T23:07:02.106Z",
    "quiz_choices": [
      {
        "choice_id": "quiz-1-choice-1",
        "quiz_id": "quiz-1",
        "choice_text": "京都には伝統工芸を守る職人がまだ存在する",
        "is_correct": true,
        "explanation": "本文の内容と一致しています"
      },
      {
        "choice_id": "quiz-1-choice-2",
        "quiz_id": "quiz-1",
        "choice_text": "京都の伝統工芸は完全に消えてしまった",
        "is_correct": false,
        "explanation": "本文の内容と矛盾します"
      }
    ]
  }
}
```

**フィールド説明**:
| フィールド | 型 | 説明 |
|------------|-----|------|
| quiz_id | string | クイズID |
| story_id | string | 関連ストーリーID |
| question_text | string | 問題文 |
| question_type | string | 問題種別（読解/語彙/文法/リスニング） |
| difficulty_level | string | 難易度（N5-N1） |
| is_ai_generated | boolean | AI生成フラグ |
| quiz_choices | array | 選択肢配列 |

---

#### `POST /api/quizzes/answer`

**説明**: クイズ回答送信

**リクエストボディ**:
```json
{
  "quiz_id": "quiz-1",
  "user_answer": "quiz-1-choice-1",
  "response_method": "text"
}
```

**リクエストフィールド**:
| フィールド | 型 | 必須 | 説明 |
|------------|-----|------|------|
| quiz_id | string | ✅ | クイズID |
| user_answer | string | ✅ | 選択したchoice_id |
| response_method | string | ✅ | 回答方法（"text" or "voice"） |

**レスポンス** (200):
```json
{
  "success": true,
  "data": {
    "is_correct": true,
    "correct_answer": "quiz-1-choice-1",
    "explanation": "本文の内容と一致しています",
    "feedback": "正解です！素晴らしい！"
  }
}
```

**エラーレスポンス** (400):
```json
{
  "success": false,
  "error": "Invalid choice_id"
}
```

---

### 音声合成 (TTS)

#### `POST /api/tts/synthesize`

**説明**: テキストを音声に変換

**リクエストボディ**:
```json
{
  "text": "こんにちは、元気ですか？",
  "language_code": "ja-JP",
  "voice_name": "ja-JP-Neural2-B"
}
```

**リクエストフィールド**:
| フィールド | 型 | 必須 | デフォルト | 説明 |
|------------|-----|------|------------|------|
| text | string | ✅ | - | 読み上げテキスト（最大5000文字） |
| language_code | string | ❌ | "ja-JP" | 言語コード |
| voice_name | string | ❌ | "ja-JP-Neural2-B" | 音声名 |

**レスポンス** (200):
```json
{
  "success": true,
  "data": {
    "audio_content": "//NExAASCCIIAAhEuKwAAA...",  // Base64エンコードMP3
    "audio_config": {
      "audio_encoding": "MP3",
      "sample_rate_hertz": 24000
    }
  }
}
```

**エラーレスポンス** (400):
```json
{
  "success": false,
  "error": "Text is required"
}
```

---

### 進捗管理

#### `GET /api/progress`

**説明**: 学習進捗データ取得

**クエリパラメータ**: なし（Phase 1）

**レスポンス** (200):
```json
{
  "success": true,
  "data": {
    "total_quizzes": 110,
    "correct_answers": 73,
    "accuracy_rate": 66.4,
    "level_progress": {
      "N5": { "completed": 10, "total": 20, "accuracy": 80.0 },
      "N4": { "completed": 15, "total": 25, "accuracy": 70.0 },
      "N3": { "completed": 20, "total": 30, "accuracy": 65.0 },
      "N2": { "completed": 18, "total": 30, "accuracy": 60.0 },
      "N1": { "completed": 10, "total": 25, "accuracy": 50.0 }
    },
    "recent_stories": [
      {
        "story_id": "1",
        "title": "東京での新しい生活",
        "last_accessed": "2026-01-12T10:30:00.000Z"
      }
    ]
  }
}
```

---

#### `GET /api/progress/graph`

**説明**: 進捗グラフデータ取得

**クエリパラメータ**:
- `period` (string, optional): 期間（"week" | "month" | "year"）デフォルト: "week"

**レスポンス** (200):
```json
{
  "success": true,
  "data": {
    "period": "week",
    "data_points": [
      {
        "date": "2026-01-06",
        "correct": 5,
        "incorrect": 2,
        "accuracy": 71.4
      },
      {
        "date": "2026-01-07",
        "correct": 8,
        "incorrect": 1,
        "accuracy": 88.9
      }
    ]
  }
}
```

---

## 📦 データモデル

### Story

```typescript
interface Story {
  story_id: string;
  title: string;
  description: string;
  level_jlpt: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  level_cefr: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  estimated_time: number;  // 分
  thumbnail_url: string | null;
  root_chapter_id: string;
  created_at: string;  // ISO 8601
  updated_at: string;  // ISO 8601
}
```

### Chapter

```typescript
interface Chapter {
  chapter_id: string;
  story_id: string;
  parent_chapter_id: string | null;
  chapter_number: number;
  depth_level: number;
  content: string;
  content_with_ruby: string;
  translation: string;
  created_at: string;
  updated_at: string;
  choices: Choice[];
}
```

### Choice

```typescript
interface Choice {
  choice_id: string;
  chapter_id: string;
  choice_text: string;
  choice_description: string;
  next_chapter_id: string;
  display_order: number;
  created_at: string;
}
```

### Quiz

```typescript
interface Quiz {
  quiz_id: string;
  story_id: string;
  question_text: string;
  question_type: '読解' | '語彙' | '文法' | 'リスニング';
  difficulty_level: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
  is_ai_generated: boolean;
  source_text: string;
  created_at: string;
  updated_at: string;
  quiz_choices: QuizChoice[];
}
```

### QuizChoice

```typescript
interface QuizChoice {
  choice_id: string;
  quiz_id: string;
  choice_text: string;
  is_correct: boolean;
  explanation: string;
}
```

---

## 🔄 レート制限

**Phase 1**: レート制限なし

**Phase 2予定**:
- 100リクエスト/15分/IP
- ヘッダー: `X-RateLimit-Limit`, `X-RateLimit-Remaining`

---

## 🌐 CORS

**許可オリジン**: `process.env.CORS_ORIGIN`
- 開発: `http://localhost:3847`
- 本番: `https://your-domain.vercel.app`

---

## 📝 変更履歴

| バージョン | 日付 | 変更内容 |
|------------|------|----------|
| 1.0.0 | 2026-01-12 | 初版リリース（Phase 1 MVP） |

---

## 📞 サポート

API仕様に関する質問:
- GitHub Issues: [Issues](https://github.com/your-org/lingo-keeper-jp/issues)
- Email: [お問い合わせメールアドレス]

---

**作成者**: Lingo Keeper Team
**最終更新**: 2026-01-12
