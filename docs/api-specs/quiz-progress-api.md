# 理解度チェック＋進捗ページAPI仕様書

生成日: 2026-01-11
収集元: frontend/src/services/mock/QuizService.ts
@MOCK_TO_APIマーク数: 6
@BACKEND_COMPLEXマーク数: 1

## エンドポイント一覧

### 1. ストーリー別クイズ取得
- **エンドポイント**: `GET /api/quizzes/story/:storyId`
- **APIパス定数**: `API_PATHS.QUIZZES.BY_STORY(storyId)`
- **Request**:
  - Path Parameters:
    - `storyId`: ストーリーID (string)
- **Response**: `Quiz[]`
  ```typescript
  {
    quiz_id: string;
    story_id: string;
    question_text: string;
    question_type: 'reading' | 'vocabulary' | 'grammar' | 'listening';
    difficulty_level: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
    is_ai_generated: boolean; // AI生成フラグ
    source_text?: string; // 生成元テキスト
    created_at: string;
    updated_at: string;
    choices: QuizChoice[];
  }[]
  ```
- **説明**: 指定されたストーリーに関連するクイズを取得

---

### 2. ランダムクイズ取得
- **エンドポイント**: `GET /api/quizzes`
- **APIパス定数**: `API_PATHS.QUIZZES.LIST`
- **Request**: なし
- **Response**: `Quiz`
  ```typescript
  {
    quiz_id: string;
    story_id: string;
    question_text: string;
    question_type: 'reading' | 'vocabulary' | 'grammar' | 'listening';
    difficulty_level: 'N5' | 'N4' | 'N3' | 'N2' | 'N1';
    is_ai_generated: boolean;
    source_text?: string;
    created_at: string;
    updated_at: string;
    choices: QuizChoice[];
  }
  ```
  ```typescript
  // QuizChoice型
  {
    choice_id: string;
    quiz_id: string;
    choice_text: string;
    is_correct: boolean;
    explanation?: string; // 解説
    created_at: string;
  }
  ```
- **説明**: ランダムに1問のクイズを取得

---

### 3. 回答送信
- **エンドポイント**: `POST /api/quizzes/answer`
- **APIパス定数**: `API_PATHS.QUIZZES.ANSWER`
- **Request**:
  ```typescript
  {
    quiz_id: string;
    user_answer: string; // ユーザーが選択した選択肢ID
    response_method: 'voice' | 'text'; // 回答方法（音声/テキスト）
  }
  ```
- **Response**: `QuizFeedback`
  ```typescript
  {
    is_correct: boolean;
    correct_answer: string;
    explanation: string;
    sample_answer?: string; // サンプル回答（不正解時のみ）
  }
  ```
- **説明**: ユーザーの回答を送信し、即時フィードバックを取得

---

### 4. 学習進捗取得
- **エンドポイント**: `GET /api/progress`
- **APIパス定数**: `/api/progress`
- **Request**: なし
- **Response**: `UserLearningProgress`
  ```typescript
  {
    total_quizzes: number; // 総問題数
    correct_count: number; // 正解数
    accuracy_rate: number; // 正答率（%）
    level_progress: {
      [key in JLPTLevel]: {
        completed: number;
        total: number;
        accuracy: number;
      }
    };
    last_updated: string;
    completed_stories: string[]; // 完了ストーリーIDリスト
  }
  ```
- **説明**: ユーザーの学習進捗データを取得

---

### 5. 進捗グラフデータ取得
- **エンドポイント**: `GET /api/progress/graph`
- **APIパス定数**: `/api/progress/graph`
- **Request**:
  - Query Parameters:
    - `period`: `'week' | 'month' | 'year'`（デフォルト: week）
- **Response**: `ProgressGraphData`
  ```typescript
  {
    data_points: ProgressDataPoint[];
    levels: JLPTLevel[];
  }
  ```
  ```typescript
  // ProgressDataPoint型
  {
    date: string; // ISO 8601形式
    accuracy: number; // 正答率（%）
    level: JLPTLevel;
  }
  ```
- **説明**: レベル別進捗グラフ用のデータを取得
- **グラフ仕様**:
  - X軸: 時間（日/週/月）
  - Y軸: 正答率（%）
  - レベル別に色分け表示

---

### 6. 音声合成（TTS）
- **エンドポイント**: `POST /api/tts/synthesize`
- **APIパス定数**: `API_PATHS.TTS.SYNTHESIZE`
- **Request**:
  ```typescript
  {
    text: string; // 読み上げるテキスト（問題文）
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

## 複合API処理

### 複合処理-001: 音声クイズの処理（音声認識誤認識対応含む）

**トリガー**: ユーザーが音声回答ボタンをクリック

**フロントエンドAPI**: POST /api/quizzes/answer

**バックエンド内部処理**:
1. Web Speech APIで音声をテキストに変換（クライアント側）
2. 変換されたテキストをバックエンドに送信
3. データベースから正解を取得
4. 回答判定（正解/不正解）
5. **誤認識検出**: 回答が選択肢のいずれとも大きく異なる場合、サンプル回答を生成
6. フィードバック生成（解説付き）
7. 結果を返却

**結果**:
- 正解/不正解
- 解説
- 正答率更新
- サンプル回答（誤認識時）

**外部サービス依存**: Web Speech API（クライアント側）

**音声認識誤認識対応**:
- 認識結果をテキスト表示
- 「もう一度試す」ボタン
- サンプル回答を音声+テキストで提示
- 手動入力への切り替えオプション

---

## モックサービス参照

実装時はこのモックサービスの挙動を参考にする：
```
frontend/src/services/mock/QuizService.ts
```

### モックデータ詳細

**クイズ数**: 6問
- N5（語彙）: コンビニの会話
- N4（読解）: カフェでの出会い
- N3（文法）: 敬語の使い方
- N3（読解）: 新しい生活
- N2（文法）: ビジネス日本語
- N1（読解）: 京都の伝統文化

**進捗グラフデータ**:
- 過去7日間のデータポイント
- レベル別の正答率推移
- SVG線グラフで可視化

**学習履歴**:
- 完了したストーリー一覧
- ストーリー別正答率
- 次のおすすめストーリー提案

---

## バックエンド実装時の注意事項

### データベーステーブル
- `quizzes`: クイズマスター（AI生成フラグ含む）
- `quiz_choices`: 選択肢（解説含む）
- `user_quiz_results`: ユーザー回答履歴（LocalStorage → DB移行）
- `user_progress`: ユーザー学習進捗

### Google Cloud TTS API連携
- エンドポイント: `/api/tts/synthesize`
- 音声タイプ: `ja-JP-Neural2-B`（標準）
- 言語: `ja-JP`
- 月間無料枠: 100万文字

### Web Speech API（クライアント側）
- ブラウザ対応: Chrome、Edge推奨（Safari制限あり）
- HTTPS必須
- オフライン不可
- 誤認識対応ロジック必須

### エラーハンドリング
- 404: リソースが見つからない（Quiz）
- 400: 不正なリクエスト（無効な回答など）
- 500: サーバーエラー（Google TTS API障害等）

### LocalStorage → DB移行
MVPフェーズはLocalStorageで進捗管理、Phase 2以降でDB移行予定：
- `lingo_keeper_quiz_results`
- `lingo_keeper_progress`

---

**作成日**: 2026-01-11
**最終更新日**: 2026-01-11
