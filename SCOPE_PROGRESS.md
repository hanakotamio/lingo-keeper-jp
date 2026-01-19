# SCOPE_PROGRESS.md - Lingo Keeper JP

**プロジェクト名**: Lingo Keeper JP
**開始日**: 2026-01-10
**最終更新日**: 2026-01-16

---

## 🔒 本番運用診断履歴

### 第1回診断 (実施日: 2026-01-16)

**総合スコア**: 70.5/100点（C評価: Fair - 重要な改善が必要）

#### スコア内訳

| カテゴリ | スコア | 評価 | 主な問題 |
|---------|--------|------|---------|
| セキュリティ | 23/30 | C | JWT_SECRET動的生成不良、OpenAI API KEY平文露出、CSP unsafe-inline |
| パフォーマンス | 14/20 | C | N+1問題1件、キャッシング未実装、インデックス不足 |
| 信頼性 | 13/20 | D | トランザクション未実装、べき等性未実装 |
| 運用性 | 14/20 | C | メトリクス未実装、バックアップ手順なし |
| コード品質 | 6.5/10 | D | フロントエンドカバレッジ48%、大型ファイル2件 |

#### CVSS 3.1脆弱性詳細

**優秀**: 本番環境に影響する脆弱性はゼロ

- **Critical (9.0-10.0)**: 0件
- **High (7.0-8.9)**: 0件
- **Medium (4.0-6.9)**: 0件
- **Low (0.1-3.9)**: 8件（全てdevDependencies、本番環境影響なし）

#### ライセンス確認結果

✅ **全45パッケージが商用利用可能（MIT/Apache-2.0/ISC/BSD-3-Clause）**

---

## 🔧 改善タスク（優先度順）

### 🔴 Critical（即座に対応 - 合計3時間）

#### 1. JWT_SECRET動的生成形式修正（30分）`セキュリティ`

**ファイル**: `.env.local:24`

**現在の問題**:
```bash
JWT_SECRET=$(openssl rand -base64 32)
```
この形式はシェルで実行されないため、リテラル文字列として扱われる

**影響**: JWTトークンのセキュリティが確保されていない、認証バイパスの可能性

**修正手順**:

<details>
<summary>📋 Stage 1: 調査フェーズ</summary>

**影響範囲の特定**:
- 修正対象: `.env.local:24`
- 依存ファイル: `backend/src/middleware/auth.middleware.ts`（JWT検証処理）
- 環境変数使用箇所: `backend/src/index.ts`、認証ミドルウェア

**リスク評価**:
- 影響を受ける機能: ユーザー認証（現在MVPフェーズでは未使用）
- ロールバック難易度: Low（環境変数のみ）
- データ損失・破損: なし
- サービス停止リスク: なし（再起動のみ）

**テスト可能性**:
- 既存テスト: backend/tests/integration/auth.test.ts（存在確認済み）
- 新規テスト: 不要（環境変数のみの修正）

</details>

<details>
<summary>📝 Stage 2: 計画フェーズ</summary>

**実装計画**:
1. 新しいJWT_SECRETを生成（`openssl rand -base64 32`）
2. `.env.local`の該当行を修正
3. 同様にSESSION_SECRETも修正
4. バックエンドを再起動して環境変数読み込み確認
5. テスト実行で認証処理が正常に動作することを確認

**ロールバック計画**:
- `.env.local`のバックアップ作成
- 問題発生時は元の値に戻して再起動

</details>

<details>
<summary>🛠️ Stage 3: 実装フェーズ</summary>

**修正コマンド**:
```bash
# 1. バックアップ作成
cp .env.local .env.local.backup

# 2. 新しいシークレット生成
NEW_JWT_SECRET=$(openssl rand -base64 32)
NEW_SESSION_SECRET=$(openssl rand -base64 32)

# 3. .env.localを修正
# 手動編集または以下のsedコマンド
sed -i "s|JWT_SECRET=.*|JWT_SECRET=${NEW_JWT_SECRET}|" .env.local
sed -i "s|SESSION_SECRET=.*|SESSION_SECRET=${NEW_SESSION_SECRET}|" .env.local

# 4. 確認
grep -E "JWT_SECRET|SESSION_SECRET" .env.local
```

</details>

<details>
<summary>✅ Stage 4: テストフェーズ</summary>

**テスト項目**:
1. バックエンド起動確認: `cd backend && npm run dev`
2. 環境変数読み込み確認: ログに「JWT_SECRET loaded」が表示されることを確認
3. 認証テスト実行: `cd backend && npm test -- auth.test.ts`
4. E2Eテスト実行（認証関連）: `cd frontend && npm run test:e2e -- auth`

**期待される結果**:
- ✅ バックエンドが正常に起動
- ✅ 環境変数が正しく読み込まれる
- ✅ 認証テストが全てパス
- ✅ E2Eテストが全てパス

</details>

**修正ステータス**: [ ] 未完了

---

#### 2. SESSION_SECRET動的生成形式修正（30分）`セキュリティ`

**ファイル**: `.env.local:27`

**修正手順**: タスク1と同時に実施

**修正ステータス**: [ ] 未完了

---

#### 3. OpenAI API KEY保護（2時間）`セキュリティ`

**ファイル**: `.env.local:20`

**現在の問題**: 実際のAPI KEYが平文で記載

**影響**: リポジトリ漏洩時にAPI KEYが流出し、不正利用される（月額課金の可能性）

**修正手順**:

<details>
<summary>📋 Stage 1: 調査フェーズ</summary>

**影響範囲の特定**:
- 修正対象: `.env.local:20`、`.gitignore`
- 依存ファイル: `backend/src/services/openai.service.ts`
- 使用箇所: クイズ自動生成機能

**リスク評価**:
- 影響を受ける機能: クイズ自動生成（現在使用中）
- ロールバック難易度: Medium（API KEY再発行が必要）
- データ損失・破損: なし
- サービス停止リスク: Medium（クイズ生成機能停止）

**テスト可能性**:
- 既存テスト: backend/tests/integration/openai.test.ts
- 新規テスト: 不要

</details>

<details>
<summary>📝 Stage 2: 計画フェーズ</summary>

**実装計画**:
1. `.gitignore`に`.env.local`が含まれているか確認
2. OpenAIダッシュボードで新しいAPI KEY発行
3. 古いAPI KEYをローテーション（無効化）
4. `.env.local`を更新
5. （Phase 2）Google Secret Manager導入検討

**セキュリティ対策**:
- `.gitignore`に`.env.local`を追加（既に存在する場合は確認のみ）
- `.env.example`ファイルを作成（ダミー値）
- README.mdに環境変数設定手順を明記

</details>

<details>
<summary>🛠️ Stage 3: 実装フェーズ</summary>

**修正コマンド**:
```bash
# 1. .gitignore確認
grep ".env.local" .gitignore || echo ".env.local" >> .gitignore

# 2. .env.exampleファイル作成
cp .env.local .env.example

# 3. .env.exampleの機密情報をダミー値に置換
sed -i 's/OPENAI_API_KEY=.*/OPENAI_API_KEY=sk-proj-YOUR_API_KEY_HERE/' .env.example
sed -i 's/DATABASE_URL=.*/DATABASE_URL=postgresql:\/\/user:password@host\/database/' .env.example
sed -i 's/JWT_SECRET=.*/JWT_SECRET=your_jwt_secret_here/' .env.example
sed -i 's/SESSION_SECRET=.*/SESSION_SECRET=your_session_secret_here/' .env.example

# 4. .env.exampleをgit追加
git add .env.example

# 5. OpenAI API KEY更新（手動でダッシュボードから新しいキー取得）
# .env.localの該当行を新しいキーに更新
```

**手動作業**:
1. OpenAI Platform（https://platform.openai.com/api-keys）にアクセス
2. 新しいAPI KEYを発行
3. 古いAPI KEYを無効化
4. `.env.local:20`を新しいキーに更新

</details>

<details>
<summary>✅ Stage 4: テストフェーズ</summary>

**テスト項目**:
1. `.gitignore`動作確認: `git status`で`.env.local`が表示されないことを確認
2. クイズ生成テスト: `cd backend && npm test -- openai.test.ts`
3. 実際のクイズ生成API呼び出し: `curl -X POST http://localhost:8534/api/quizzes/generate`
4. 古いAPI KEYが無効化されていることを確認

**期待される結果**:
- ✅ `.env.local`がgit statusに表示されない
- ✅ 新しいAPI KEYでクイズ生成が成功
- ✅ 古いAPI KEYで401エラーが返る
- ✅ テストが全てパス

</details>

**修正ステータス**: [ ] 未完了

---

### 🟠 High問題（1週間以内 - 合計12時間）

#### 4. LocalStorageでのトークン保存（3時間）`セキュリティ`

**ファイル**: `frontend/src/contexts/AuthContext.tsx:33,75,90`

**現在の問題**: XSS攻撃時にトークンが盗まれる可能性

**影響**: アカウント乗っ取りリスク

**Phase 2移行予定**: httpOnly Cookie + SameSite=Strict属性

**修正ステータス**: [ ] Phase 2で対応

---

#### 5. CSPでunsafe-inlineを許可（2時間）`セキュリティ`

**ファイル**: `backend/src/index.ts:27`

**現在の問題**: styleSrcで'unsafe-inline'を許可

**影響**: XSS攻撃の一種に対して脆弱

**修正手順**:

<details>
<summary>📋 Stage 1: 調査フェーズ</summary>

**影響範囲の特定**:
- 修正対象: `backend/src/index.ts:27`
- 依存ファイル: MUI v7のCSP対応機能
- 影響範囲: フロントエンド全体のスタイル適用

**リスク評価**:
- 影響を受ける機能: MUIコンポーネントのスタイル
- ロールバック難易度: Low（設定変更のみ）
- サービス停止リスク: High（スタイルが適用されない可能性）

</details>

<details>
<summary>📝 Stage 2: 計画フェーズ</summary>

**実装計画**:
1. MUI v7のnonce-based CSP機能調査
2. バックエンドでnonce生成機能実装
3. フロントエンドでnonce受け取り・適用
4. CSP設定からunsafe-inline削除
5. 全ページでスタイル適用確認

</details>

**修正ステータス**: [ ] 未完了

---

#### 6. N+1問題解決（2時間）`パフォーマンス`

**ファイル**: `backend/src/services/progress.service.ts:44-47`

**現在の問題**: JLPT_LEVELSループ（5レベル）でgetTotalQuizCountByLevel()を呼び出し

**影響**: 5回のDB COUNT()クエリが毎回実行される

**修正手順**:

<details>
<summary>📋 Stage 1: 調査フェーズ</summary>

**影響範囲の特定**:
- 修正対象: `backend/src/repositories/progress.repository.ts`、`backend/src/services/progress.service.ts`
- 依存ファイル: `backend/src/controllers/progress.controller.ts`
- データベーステーブル: `quizzes`

**リスク評価**:
- 影響を受ける機能: 進捗グラフ表示
- ロールバック難易度: Low（関数変更のみ）
- データ損失・破損: なし
- サービス停止リスク: Low

</details>

<details>
<summary>📝 Stage 2: 計画フェーズ</summary>

**実装計画**:
1. `progress.repository.ts`に`getTotalQuizCountByAllLevels()`関数追加
2. Prisma groupBy使用で1クエリで全レベル取得
3. `progress.service.ts`のループ処理を修正
4. テスト追加・実行

</details>

<details>
<summary>🛠️ Stage 3: 実装フェーズ</summary>

**修正コード**:

**backend/src/repositories/progress.repository.ts に追加**:
```typescript
async getTotalQuizCountByAllLevels(): Promise<Record<JLPTLevel, number>> {
  const counts = await this.prisma.quiz.groupBy({
    by: ['difficulty_level'],
    _count: {
      quiz_id: true,
    },
  });

  const result: Record<string, number> = {};
  counts.forEach((item) => {
    result[item.difficulty_level] = item._count.quiz_id;
  });

  return result as Record<JLPTLevel, number>;
}
```

**backend/src/services/progress.service.ts を修正**:
```typescript
// 修正前: ループ内でDB呼び出し（5回）
// for (const level of this.JLPT_LEVELS) {
//   const totalQuizzesForLevel = await progressRepository.getTotalQuizCountByLevel(level);
//   ...
// }

// 修正後: 1回のクエリで全レベル取得
const allLevelCounts = await progressRepository.getTotalQuizCountByAllLevels();
for (const level of this.JLPT_LEVELS) {
  const totalQuizzesForLevel = allLevelCounts[level] || 0;
  // ...
}
```

</details>

<details>
<summary>✅ Stage 4: テストフェーズ</summary>

**テスト項目**:
1. ユニットテスト: `cd backend && npm test -- progress.repository.test.ts`
2. 統合テスト: `cd backend && npm test -- progress.test.ts`
3. E2Eテスト: `cd frontend && npm run test:e2e -- progress`
4. パフォーマンス確認: ログでDB呼び出し回数を確認（5回→1回）

**期待される結果**:
- ✅ テストが全てパス
- ✅ DB呼び出しが5回→1回に削減
- ✅ 進捗グラフが正常に表示

</details>

**効果**: DB呼び出し 5回 → 1回（80%削減）

**修正ステータス**: [ ] 未完了

---

#### 7. データベースインデックス追加（1時間）`パフォーマンス`

**ファイル**: `backend/prisma/schema.prisma`

**問題**: stories.level_jlpt, level_cefr, quizzes.difficulty_level にインデックス未設定

**影響**: レベル別フィルタリング時のクエリ性能低下

**修正手順**:

<details>
<summary>📋 Stage 1: 調査フェーズ</summary>

**影響範囲の特定**:
- 修正対象: `backend/prisma/schema.prisma`
- データベーステーブル: `stories`, `quizzes`
- 既存インデックス: 7個（chapters.story_id, chapters.parent_chapter_id等）

**リスク評価**:
- 影響を受ける機能: ストーリー一覧、クイズ一覧のフィルタリング
- ロールバック難易度: Medium（マイグレーション実行必要）
- データ損失・破損: なし（インデックス追加のみ）
- サービス停止リスク: Low（インデックス作成中は一時的な遅延のみ）

</details>

<details>
<summary>📝 Stage 2: 計画フェーズ</summary>

**実装計画**:
1. schema.prismaに@@index追加
2. prisma migrate dev実行（開発環境）
3. マイグレーションファイル確認
4. テスト環境でマイグレーション実行
5. クエリ性能改善確認

</details>

<details>
<summary>🛠️ Stage 3: 実装フェーズ</summary>

**修正コード**:

**backend/prisma/schema.prisma**:
```prisma
model Story {
  // ... 既存フィールド

  @@index([level_jlpt, level_cefr]) // 複合インデックス
  @@index([level_jlpt])              // 単体インデックス
  @@map("stories")
}

model Quiz {
  // ... 既存フィールド

  @@index([difficulty_level])
  @@index([story_id, difficulty_level]) // 複合クエリ用
  @@map("quizzes")
}
```

**実行コマンド**:
```bash
cd backend
npx prisma migrate dev --name add_performance_indexes
```

</details>

<details>
<summary>✅ Stage 4: テストフェーズ</summary>

**テスト項目**:
1. マイグレーション実行確認: `npx prisma migrate status`
2. インデックス作成確認: PostgreSQLで`\d stories`実行
3. クエリ性能確認: `EXPLAIN ANALYZE`でクエリプラン確認
4. 統合テスト: `cd backend && npm test`

**期待される結果**:
- ✅ マイグレーションが正常に完了
- ✅ インデックスが作成されている
- ✅ クエリがインデックスを使用している（EXPLAIN ANALYZEで確認）
- ✅ テストが全てパス

</details>

**修正ステータス**: [ ] 未完了

---

#### 8. キャッシング実装（4時間）`パフォーマンス`

**問題**: クイズ総数、ストーリー一覧を毎回DB取得

**影響**: 不要なDB負荷

**修正手順**:

<details>
<summary>📋 Stage 1: 調査フェーズ</summary>

**影響範囲の特定**:
- 新規パッケージ: `node-cache`
- 修正対象: `backend/src/lib/cache.ts`（新規）、各repository
- キャッシュ対象データ: クイズ総数、ストーリー一覧、ユーザー進捗

**リスク評価**:
- 影響を受ける機能: 全API（キャッシュヒット時の高速化）
- ロールバック難易度: Low（パッケージ削除のみ）
- データ整合性リスク: Medium（キャッシュ無効化戦略が必要）
- サービス停止リスク: Low

</details>

<details>
<summary>📝 Stage 2: 計画フェーズ</summary>

**実装計画**:
1. `node-cache`パッケージ導入
2. `backend/src/lib/cache.ts`作成（キャッシュ管理）
3. TTL設定（クイズ総数: 1時間、ストーリー一覧: 5分）
4. repositoryでキャッシュ活用
5. キャッシュ無効化戦略実装（POST/PUT/DELETE時）

</details>

<details>
<summary>🛠️ Stage 3: 実装フェーズ</summary>

**実装コード**:

**package.json に追加**:
```bash
cd backend
npm install node-cache
```

**backend/src/lib/cache.ts 新規作成**:
```typescript
import NodeCache from 'node-cache';
import logger from './logger.js';

const cache = new NodeCache({
  stdTTL: 300, // デフォルト5分
  checkperiod: 60,
  useClones: false,
});

export const CacheKeys = {
  QUIZ_COUNT_BY_LEVEL: 'quiz_count_by_level',
  STORY_LIST_ALL: 'story_list_all',
  STORY_LIST_PREFIX: 'story_list_',
};

export const CacheTTL = {
  QUIZ_COUNT: 3600,
  STORY_LIST: 300,
  USER_PROGRESS: 30,
};

cache.on('set', (key, value) => {
  logger.debug('Cache SET', { key });
});

export default cache;
```

**使用例（story.repository.ts）**:
```typescript
import cache, { CacheKeys, CacheTTL } from '@/lib/cache.js';

async findAllStories(levelFilter?: LevelFilter): Promise<Story[]> {
  const cacheKey = levelFilter
    ? `${CacheKeys.STORY_LIST_PREFIX}${levelFilter}`
    : CacheKeys.STORY_LIST_ALL;

  const cached = cache.get<Story[]>(cacheKey);
  if (cached) {
    logger.debug('Cache HIT', { cacheKey });
    return cached;
  }

  const stories = await this.prisma.story.findMany({...});
  const result = stories.map((story) => this.toDomainStory(story));
  cache.set(cacheKey, result, CacheTTL.STORY_LIST);

  return result;
}
```

</details>

<details>
<summary>✅ Stage 4: テストフェーズ</summary>

**テスト項目**:
1. キャッシュヒット確認: ログで「Cache HIT」が表示されることを確認
2. キャッシュミス確認: 初回はDB取得、2回目はキャッシュ使用
3. TTL確認: 設定時間後にキャッシュが期限切れになることを確認
4. 統合テスト: `cd backend && npm test`

**期待される結果**:
- ✅ キャッシュが正常に動作
- ✅ 2回目以降のリクエストが高速化
- ✅ TTL後にキャッシュが期限切れ
- ✅ テストが全てパス

</details>

**修正ステータス**: [ ] 未完了

---

#### 9. トランザクション実装（3時間）`信頼性`

**問題**: 複数DB操作での原子性未保証

**影響**: Phase 2以降（ユーザー登録、決済処理等）でデータ不整合リスク

**修正ステータス**: [ ] Phase 2で対応

---

#### 10. べき等性実装（2時間）`信頼性`

**ファイル**: `backend/src/repositories/quiz.repository.ts:212`

**問題**: クイズ結果の重複保存リスク

**影響**: ネットワーク障害時のリトライで同一回答が複数回記録

**修正手順**:

<details>
<summary>📋 Stage 1: 調査フェーズ</summary>

**影響範囲の特定**:
- 修正対象: `backend/prisma/schema.prisma`、`quiz.repository.ts`
- データベーステーブル: `quiz_results`
- 既存制約: なし（UNIQUE制約未設定）

**リスク評価**:
- 影響を受ける機能: クイズ回答保存
- ロールバック難易度: Medium（スキーマ変更必要）
- データ整合性リスク: High（既存重複データの処理が必要）
- サービス停止リスク: Low

</details>

<details>
<summary>📝 Stage 2: 計画フェーズ</summary>

**実装計画**:
1. 既存の重複データ確認・クリーンアップ
2. schema.prismaにUNIQUE制約追加
3. マイグレーション実行
4. クライアント側でリクエストID付与検討

</details>

<details>
<summary>🛠️ Stage 3: 実装フェーズ</summary>

**修正コード**:

**backend/prisma/schema.prisma**:
```prisma
model QuizResult {
  // ... 既存フィールド

  @@unique([quiz_id, user_id, answered_at], name: "unique_quiz_answer")
  // または
  @@unique([quiz_id, user_id], name: "unique_quiz_per_user")
  @@map("quiz_results")
}
```

**実行コマンド**:
```bash
cd backend

# 既存の重複データ確認
npx prisma studio
# または
# SELECT quiz_id, user_id, COUNT(*) FROM quiz_results GROUP BY quiz_id, user_id HAVING COUNT(*) > 1;

# マイグレーション実行
npx prisma migrate dev --name add_quiz_result_unique_constraint
```

</details>

<details>
<summary>✅ Stage 4: テストフェーズ</summary>

**テスト項目**:
1. 制約確認: PostgreSQLで`\d quiz_results`実行
2. 重複保存テスト: 同一回答を2回送信し、エラーが返ることを確認
3. 統合テスト: `cd backend && npm test -- quiz.test.ts`
4. E2Eテスト: `cd frontend && npm run test:e2e -- quiz`

**期待される結果**:
- ✅ UNIQUE制約が作成されている
- ✅ 重複保存時にエラーが返る
- ✅ テストが全てパス

</details>

**修正ステータス**: [ ] 未完了

---

#### 11. /metricsエンドポイント実装（3時間）`運用性`

**問題**: Prometheusメトリクス公開なし

**影響**: 運用監視の標準化が困難

**修正手順**:

<details>
<summary>📋 Stage 1: 調査フェーズ</summary>

**影響範囲の特定**:
- 新規パッケージ: `prom-client`
- 修正対象: `backend/src/index.ts`、`backend/src/middleware/metrics.middleware.ts`（新規）
- 収集メトリクス: リクエスト数、レイテンシ、エラー率

**リスク評価**:
- 影響を受ける機能: 全API（メトリクス収集）
- ロールバック難易度: Low（パッケージ削除のみ）
- サービス停止リスク: Low

</details>

<details>
<summary>📝 Stage 2: 計画フェーズ</summary>

**実装計画**:
1. `prom-client`パッケージ導入
2. メトリクス収集ミドルウェア実装
3. `/api/metrics`エンドポイント実装
4. Cloud Monitoring設定（Phase 2）

</details>

**修正ステータス**: [ ] 未完了

---

#### 12. バックアップ手順文書化（2時間）`運用性`

**問題**: Neon自動バックアップの確認・復元手順が不明

**影響**: 災害復旧計画（DR）が不明確

**修正手順**:

<details>
<summary>📋 Stage 1: 調査フェーズ</summary>

**影響範囲の特定**:
- 新規ドキュメント: `docs/database-backup.md`
- Neon機能: 自動バックアップ、ポイントインタイムリカバリ

</details>

<details>
<summary>📝 Stage 2: 計画フェーズ</summary>

**実装計画**:
1. Neon自動バックアップ機能の調査
2. 手動バックアップスクリプト作成
3. リストア手順の文書化
4. 定期バックアップ設定

</details>

**修正ステータス**: [ ] 未完了

---

### 🟡 Medium問題（1ヶ月以内）

#### 13. フロントエンドテストカバレッジ向上（4時間）`コード品質`

**問題**: 48%（基準70%未達）、特にauthService.ts（15.21%）

**修正ステータス**: [ ] 未完了

---

#### 14. 大型ページファイル分割（4時間）`コード品質`

**ファイル**:
- `StoryExperiencePage.tsx`: 823行（700行基準を123行超過）
- `QuizProgressPage.tsx`: 882行（700行基準を182行超過）

**修正ステータス**: [ ] 未完了

---

#### 15. API仕様書のSwagger化（3時間）`コード品質`

**問題**: Markdown形式のみ、自動生成ツール未使用

**修正ステータス**: [ ] 未完了

---

## 📊 スコア推移予測

### 現在（第1回診断）
**総合スコア**: 70.5/100点（C評価: Fair）

### Critical修正後（予測）
**総合スコア**: 78.5/100点（C→B評価）
- セキュリティ: 23 → 28点（+5点）

### High修正後（予測）
**総合スコア**: 90.5/100点（A評価: Excellent）
- セキュリティ: 28 → 30点（+2点）
- パフォーマンス: 14 → 18点（+4点）
- 信頼性: 13 → 18点（+5点）
- 運用性: 14 → 18点（+4点）

---

## 🎯 次回診断予定

**予定日**: Critical/High修正完了後、または1週間後（2026-01-23）

**目標**: 90点以上（A評価: Excellent）

---

## 📄 生成ファイル

1. **production-readiness-report.html**: 経営層・技術責任者向けHTMLレポート
2. **production-readiness-issues.md**: 問題リスト詳細（Markdown形式）
3. **SCOPE_PROGRESS.md**: 本ファイル（進捗管理）

---

**最終更新**: 2026-01-16
