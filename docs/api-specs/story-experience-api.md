# ストーリー体験ページAPI仕様書

生成日: 2026-01-11
収集元: frontend/src/services/mock/StoryService.ts
@MOCK_TO_APIマーク数: 4
@BACKEND_COMPLEXマーク数: 0

## エンドポイント一覧

### 1. ストーリー一覧取得
- **エンドポイント**: `GET /api/stories`
- **APIパス定数**: `API_PATHS.STORIES.LIST`
- **Request**:
  - Query Parameters:
    - `levelFilter` (optional): `'all' | 'N5-A1' | 'N4-A2' | 'N3-B1' | 'N2-B2' | 'N1-C1'`
- **Response**: `Story[]`
  ```typescript
  {
    story_id: string;
    title: string;
    description: string;
    level_jlpt: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
    level_cefr: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
    estimated_time: number; // 分
    root_chapter_id: string;
    created_at: string;
    updated_at: string;
  }[]
  ```
- **説明**: レベルフィルター条件に基づいてストーリー一覧を取得

---

### 2. 特定ストーリー取得
- **エンドポイント**: `GET /api/stories/:id`
- **APIパス定数**: `API_PATHS.STORIES.DETAIL(id)`
- **Request**:
  - Path Parameters:
    - `id`: ストーリーID (string)
- **Response**: `Story`
  ```typescript
  {
    story_id: string;
    title: string;
    description: string;
    level_jlpt: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
    level_cefr: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
    estimated_time: number;
    root_chapter_id: string;
    created_at: string;
    updated_at: string;
  }
  ```
- **エラー**: 404 Not Found（存在しないストーリーID）
- **説明**: 指定されたIDのストーリー詳細を取得

---

### 3. チャプター取得
- **エンドポイント**: `GET /api/chapters/:id`
- **APIパス定数**: `API_PATHS.CHAPTERS.DETAIL(id)`
- **Request**:
  - Path Parameters:
    - `id`: チャプターID (string)
- **Response**: `Chapter`
  ```typescript
  {
    chapter_id: string;
    story_id: string;
    chapter_number: number;
    depth_level: number;
    content: string;
    content_with_ruby?: string; // ルビ付き本文（HTML）
    translation?: string; // 翻訳テキスト
    created_at: string;
    updated_at: string;
    choices: Choice[];
  }
  ```
  ```typescript
  // Choice型
  {
    choice_id: string;
    chapter_id: string;
    choice_text: string;
    choice_description?: string; // カードUI用説明
    next_chapter_id: string;
    display_order: number;
    created_at: string;
  }
  ```
- **エラー**: 404 Not Found（存在しないチャプターID）
- **説明**: 指定されたIDのチャプター内容と選択肢を取得

---

### 4. 音声合成（TTS）
- **エンドポイント**: `POST /api/tts/synthesize`
- **APIパス定数**: `API_PATHS.TTS.SYNTHESIZE`
- **Request**:
  ```typescript
  {
    text: string; // 読み上げるテキスト
  }
  ```
- **Response**:
  ```typescript
  {
    audioUrl: string; // 音声データURL（実装時はGoogle Cloud TTS APIを使用）
  }
  ```
- **説明**: テキストを音声に変換（Google Cloud Text-to-Speech API使用予定）
- **外部サービス依存**: Google Cloud Text-to-Speech API

---

## モックサービス参照

実装時はこのモックサービスの挙動を参考にする：
```
frontend/src/services/mock/StoryService.ts
```

### モックデータ詳細

**ストーリー数**: 6件
- N5/A1: 初めてのコンビニ（5分）
- N4/A2: カフェでの出会い（8分）
- N3/B1: 東京での新しい生活（10分）、週末の旅行計画（12分）
- N2/B2: 就職活動の挑戦（15分）
- N1/C1: 京都の伝統文化（20分）

**チャプターデータ**:
- ツリー構造の分岐型ストーリー
- 各チャプターに2-3個の選択肢
- ルビ付き本文と翻訳を含む

---

## バックエンド実装時の注意事項

### データベーステーブル
- `stories`: ストーリーマスター
- `chapters`: チャプター（ツリー構造: parent_chapter_id）
- `choices`: 選択肢（分岐先チャプターへの参照）

### Google Cloud TTS API連携
- エンドポイント: `/api/tts/synthesize`
- 音声タイプ: `ja-JP-Neural2-B`（標準）
- 言語: `ja-JP`
- 月間無料枠: 100万文字

### エラーハンドリング
- 404: リソースが見つからない（Story/Chapter）
- 400: 不正なリクエスト（無効なlevelFilter等）
- 500: サーバーエラー（Google TTS API障害等）

---

**作成日**: 2026-01-11
**最終更新日**: 2026-01-11
