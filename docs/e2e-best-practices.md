# E2Eテスト ベストプラクティス集

**プロジェクト**: Lingo Keeper JP
**作成日**: 2026-01-12
**目的**: E2Eテストで成功したパターンを蓄積し、後続テストの試行錯誤を削減する

---

## 1. サーバー起動

### 1.1 フロントエンドサーバー
**成功パターン**:
（まだ蓄積なし）

**失敗パターンと解決策**:
（まだ蓄積なし）

### 1.2 バックエンドサーバー
**成功パターン**:
（まだ蓄積なし）

**失敗パターンと解決策**:
（まだ蓄積なし）

---

## 2. ページアクセス

### 2.1 URL遷移
**成功パターン**:
（まだ蓄積なし）

**失敗パターンと解決策**:
（まだ蓄積なし）

### 2.2 ページ読み込み待機
**成功パターン**:
（まだ蓄積なし）

**失敗パターンと解決策**:
（まだ蓄積なし）

---

## 3. 認証処理

### 3.1 ログイン
**成功パターン**:
- **MVPフェーズの公開ルート設定**: `/stories`, `/story`, `/quiz` などは認証不要のため、App.tsxで公開ルートに配置する

**失敗パターンと解決策**:
- **問題1**: E2E仕様書では「Guest (No authentication required)」だが、実装では認証保護されていた
  - **原因**: App.tsxで `/stories` が `ProtectedRoute` でラップされていた
  - **解決策**: ProtectedRouteを削除し、公開ルートに変更する
  - **学び**: E2E仕様書の「Permission Level」と実装の認証設定は必ず一致させる。CLAUDE.mdの「MVPフェーズは認証なし」方針を確認する。

- **問題2 (E2E-QUIZ-001)**: `/quiz` にアクセスするとログイン画面にリダイレクトされた
  - **原因**: App.tsxで `/quiz` が `ProtectedRoute` でラップされていた
  - **解決策**: ProtectedRouteを削除し、公開ルートに変更。さらに、QuizProgressPageを `/quiz` ルートで使用する（QuizPageはプレースホルダーだったため）
  - **学び**: ルート設定は E2E仕様書の要件と実装を一致させる。プレースホルダーページと実装済みページを混同しない。

### 3.2 セッション管理
**成功パターン**:
（まだ蓄積なし）

**失敗パターンと解決策**:
（まだ蓄積なし）

---

## 4. UI操作

### 4.1 要素の特定
**成功パターン**:
- **data-testid属性の使用**: `data-testid="story-card"`, `data-testid="story-title"` などを使用して要素を特定
- **一貫性の保持**: 同じ要素（例: レベルチップ）を複数箇所で表示する場合、すべてに同じ data-testid を付ける
- **SVG要素の特定 (E2E-QUIZ-001)**: 複数のSVGがある場合、`viewBox` などの属性で特定する
  ```typescript
  // ❌ 複数のSVGが存在する場合、strict mode violation
  const svg = page.locator('svg');

  // ✅ viewBox属性で特定のSVGを選択
  const svgGraph = page.locator('svg[viewBox="0 0 800 300"]');
  ```

**失敗パターンと解決策**:
- **問題1**: `data-testid="story-card"` が見つからない
  - **原因**: コンポーネントに data-testid 属性が付いていなかった
  - **解決策**: Card, Typography などに data-testid 属性を追加する
  - **学び**: E2Eテストが期待する data-testid 属性は必須で、欠落すると要素が見つからない

- **問題2**: `[role="button"]` セレクターで要素が見つからない
  - **原因**: MUI Chipコンポーネントはデフォルトで role="button" を持たない
  - **解決策**: data-testid を明示的に付与する
  - **学び**: role属性はアクセシビリティ用途であり、E2Eテストでは data-testid を使用すべき

- **問題3**: `dangerouslySetInnerHTML` 属性で要素を検索しようとして失敗
  - **原因**: dangerouslySetInnerHTML は React prop であり DOM属性ではない
  - **解決策**: data-testid を使用する
  - **学び**: DOM属性とReact propの違いを理解し、セレクターには常にDOM属性または data-testid を使用

- **問題4 (E2E-QUIZ-001)**: `page.locator('svg')` で strict mode violation (6個のSVGが見つかった)
  - **原因**: ページ内に複数のSVG要素（MUIアイコン5個 + グラフ1個）が存在
  - **解決策**: `page.locator('svg[viewBox="0 0 800 300"]')` のように属性で特定する
  - **学び**: 曖昧なセレクターはPlaywrightのstrict modeでエラーになる。より具体的な属性（viewBox, data-testid等）で要素を特定すべき

### 4.2 クリック操作
**成功パターン**:
（まだ蓄積なし）

**失敗パターンと解決策**:
（まだ蓄積なし）

### 4.3 入力操作
**成功パターン**:
（まだ蓄積なし）

**失敗パターンと解決策**:
（まだ蓄積なし）

### 4.4 待機処理
**成功パターン**:
（まだ蓄積なし）

**失敗パターンと解決策**:
（まだ蓄積なし）

---

## 5. データ検証

### 5.1 表示内容の検証
**成功パターン**:
（まだ蓄積なし）

**失敗パターンと解決策**:
（まだ蓄積なし）

### 5.2 API通信の検証
**成功パターン**:
（まだ蓄積なし）

**失敗パターンと解決策**:
（まだ蓄積なし）

---

## 6. エラーハンドリング

### 6.1 タイムアウト対策
**成功パターン**:
（まだ蓄積なし）

**失敗パターンと解決策**:
（まだ蓄積なし）

### 6.2 要素が見つからない場合
**成功パターン**:
（まだ蓄積なし）

**失敗パターンと解決策**:
（まだ蓄積なし）

---

## 7. テスト環境設定

### 7.1 Playwright設定
**成功パターン**:
（まだ蓄積なし）

**失敗パターンと解決策**:
（まだ蓄積なし）

### 7.2 環境変数
**成功パターン**:
（まだ蓄積なし）

**失敗パターンと解決策**:
（まだ蓄積なし）

---

## 8. ページ別の特記事項

### 8.1 Quiz Progress Page (/quiz)
**実装とルーティングの注意点 (E2E-QUIZ-001)**:
- `/quiz` ルートでは `QuizProgressPage` コンポーネントを使用
- `QuizPage` はプレースホルダーなので E2E テストには不適切
- 正しいページタイトル: "理解度チェック" (not "理解度チェック＋進捗")
- SVGグラフの特定: `svg[viewBox="0 0 800 300"]` を使用

**成功パターン**:
```typescript
// App.tsx のルート設定
<Route path="/quiz" element={<QuizProgressPage />} />  // ✅ 実装済みページ

// E2Eテストのセレクター
const pageTitle = page.locator('h1, h2').filter({ hasText: '理解度チェック' });
const svgGraph = page.locator('svg[viewBox="0 0 800 300"]');  // 特定の属性で絞り込み
```

**クイズ自動読み込みとUI要素の確認 (E2E-QUIZ-002)**:
- ページマウント時にuseQuizDataフックが自動的にランダムクイズを取得
- クイズ問題文は `h2` 要素で表示される（`h5` ではない）
- クイズバッジ（問題タイプ・レベル）は最初の `MuiChip` 要素
- レベル表記は必ず "N1" ～ "N5" のいずれかを含む

**成功パターン (E2E-QUIZ-002)**:
```typescript
// クイズ問題文の待機（h2要素を使用）
const questionText = page.locator('h2').filter({ hasText: /.*/ }).first();
await expect(questionText).toBeVisible({ timeout: 10000 });

// クイズバッジの確認
const badge = page.locator('[class*="MuiChip"]').first();
await expect(badge).toBeVisible();
const badgeText = await badge.textContent();
expect(badgeText).toMatch(/N[1-5]/);  // N1～N5のいずれか

// 音声再生ボタンの確認
const audioButton = page.locator('button').filter({ hasText: '問題文を聞く' });
await expect(audioButton).toBeVisible();

// 音声回答ボタンの確認
const voiceButton = page.locator('button').filter({ hasText: '音声で回答' });
await expect(voiceButton).toBeVisible();
```

**失敗パターンと解決策 (E2E-QUIZ-002)**:
- **問題1**: `page.locator('h5')` で問題文を探したが見つからない
  - **原因**: QuizProgressPageでは問題文を `h2` 要素（Typography variant="h5" component="h2"）で表示している
  - **解決策**: `page.locator('h2')` を使用する
  - **学び**: MUIの Typography では `variant` と `component` が異なる場合があるため、実際のHTML要素（component prop）を確認すること

---

**最終更新**: 2026-01-12 12:08
