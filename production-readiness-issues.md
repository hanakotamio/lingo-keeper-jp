# 本番運用診断 - Critical/High問題リスト

**診断日**: 2026-01-16
**総合スコア**: 70.5/100点（C評価: Fair - 重要な改善が必要）
**目標スコア**: 90点以上（A評価: Excellent）

---

## 🔴 Critical問題（即座に対応 - 合計3時間）

### 1. JWT_SECRET動的生成形式が機能していない（セキュリティ）
**ファイル**: `.env.local:24`
**現在の問題**:
```bash
JWT_SECRET=$(openssl rand -base64 32)
```
この形式はシェルで実行されないため、リテラル文字列として扱われる

**影響**: JWTトークンのセキュリティが確保されていない、認証バイパスの可能性

**修正方法**（30分）:
```bash
# 事前に生成した32文字以上のランダム文字列を直接記述
JWT_SECRET=aB3dE5fG7hI9jK1lM3nO5pQ7rS9tU1vW3xY5zA7bC9dE1fG3hI5j
```

**修正コマンド**:
```bash
# 新しいJWT_SECRETを生成
NEW_JWT_SECRET=$(openssl rand -base64 32)
# .env.localを更新
sed -i "s/JWT_SECRET=.*/JWT_SECRET=${NEW_JWT_SECRET}/" .env.local
```

---

### 2. SESSION_SECRET動的生成形式が機能していない（セキュリティ）
**ファイル**: `.env.local:27`
**現在の問題**:
```bash
SESSION_SECRET=$(openssl rand -base64 32)
```
JWT_SECRETと同じ問題

**影響**: セッション管理のセキュリティが確保されていない

**修正方法**（30分）:
```bash
# 事前に生成した32文字以上のランダム文字列を直接記述
SESSION_SECRET=xY9zA1bC3dE5fG7hI9jK1lM3nO5pQ7rS9tU1vW3xY5zA7bC9dE1fG
```

---

### 3. OpenAI API KEY平文露出（セキュリティ）
**ファイル**: `.env.local:20`
**現在の問題**: 実際のAPI KEYが平文で記載

**影響**: リポジトリ漏洩時にAPI KEYが流出し、不正利用される（月額課金の可能性）

**修正方法**（2時間）:
1. `.gitignore`に`.env.local`が含まれているか確認
2. Google Secret Manager / AWS Secrets Managerに移行
3. API KEYローテーション実施（OpenAIダッシュボード）

**Phase 2実装推奨**: 環境変数管理ツール導入

---

## 🟠 High問題（1週間以内 - 合計12時間）

### 4. LocalStorageでのトークン保存（セキュリティ）
**ファイル**: `frontend/src/contexts/AuthContext.tsx:33,75,90`
**現在の問題**: XSS攻撃時にトークンが盗まれる可能性

**影響**: アカウント乗っ取りリスク

**修正方法**（3時間）:
- Phase 2でhttpOnly Cookie + SameSite=Strict属性を使用した保存方式に移行
- バックエンドでCookieベース認証を実装

---

### 5. CSPでunsafe-inlineを許可（セキュリティ）
**ファイル**: `backend/src/index.ts:27`
**現在の問題**: styleSrcで'unsafe-inline'を許可

**影響**: XSS攻撃の一種に対して脆弱

**修正方法**（2時間）:
- nonce-basedまたはhash-based CSPに移行
- MUI v7のCSP対応機能を活用

---

### 6. N+1問題: ループ内DB呼び出し（パフォーマンス）
**ファイル**: `backend/src/services/progress.service.ts:44-47`
**現在の問題**: JLPT_LEVELSループ（5レベル）でgetTotalQuizCountByLevel()を呼び出し

**影響**: 5回のDB COUNT()クエリが毎回実行される

**修正方法**（2時間）:
```typescript
// backend/src/repositories/progress.repository.ts に追加
async getTotalQuizCountByAllLevels(): Promise<Record<JLPTLevel, number>> {
  const counts = await prisma.quiz.groupBy({
    by: ['difficulty_level'],
    _count: { quiz_id: true },
  });
  const result: Record<string, number> = {};
  counts.forEach((item) => {
    result[item.difficulty_level] = item._count.quiz_id;
  });
  return result as Record<JLPTLevel, number>;
}
```

**効果**: DB呼び出し 5回 → 1回（80%削減）

---

### 7. データベースインデックス不足（パフォーマンス）
**ファイル**: `backend/prisma/schema.prisma`
**問題**: stories.level_jlpt, level_cefr, quizzes.difficulty_level にインデックス未設定

**影響**: レベル別フィルタリング時のクエリ性能低下

**修正方法**（1時間）:
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
  @@index([story_id, difficulty_level])
  @@map("quizzes")
}
```

**実行コマンド**:
```bash
cd backend
npx prisma migrate dev --name add_performance_indexes
```

---

### 8. キャッシング未実装（パフォーマンス）
**問題**: クイズ総数、ストーリー一覧を毎回DB取得

**影響**: 不要なDB負荷

**修正方法**（4時間）:
- node-cache導入
- 主要エンドポイントでキャッシュ活用
- TTL設定（クイズ総数: 1時間、ストーリー一覧: 5分）

---

### 9. トランザクション未実装（信頼性）
**問題**: 複数DB操作での原子性未保証

**影響**: Phase 2以降（ユーザー登録、決済処理等）でデータ不整合リスク

**修正方法**（3時間）:
- 今後の複合操作時にprisma.$transaction()導入

---

### 10. べき等性未実装（信頼性）
**ファイル**: `backend/src/repositories/quiz.repository.ts:212`
**問題**: クイズ結果の重複保存リスク

**影響**: ネットワーク障害時のリトライで同一回答が複数回記録

**修正方法**（2時間）:
- quiz_resultsテーブルにUNIQUE制約追加
- クライアント側でのリクエストID付与

---

### 11. /metricsエンドポイント未実装（運用性）
**問題**: Prometheusメトリクス公開なし

**影響**: 運用監視の標準化が困難

**修正方法**（3時間）:
- prom-clientパッケージ導入
- リクエスト数、レイテンシ、エラー率の監視エンドポイント実装

---

### 12. データベースバックアップ手順文書化なし（運用性）
**問題**: Neon自動バックアップの確認・復元手順が不明

**影響**: 災害復旧計画（DR）が不明確

**修正方法**（2時間）:
- バックアップ・リストア手順を文書化
- 定期バックアップスクリプト作成

---

## 🟡 Medium問題（1ヶ月以内）

### 13. フロントエンドテストカバレッジ不足（コード品質）
**問題**: 48%（基準70%未達）

**修正方法**:
- authService.ts（15.21%）のユニットテスト追加

---

### 14. 大型ページファイル（コード品質）
**ファイル**:
- `StoryExperiencePage.tsx`: 823行（700行基準を123行超過）
- `QuizProgressPage.tsx`: 882行（700行基準を182行超過）

**修正方法**:
- コンポーネント分割（StoryContent、ChoiceCards、ProgressBar）

---

### 15. API仕様書のSwagger化（コード品質）
**問題**: Markdown形式のみ

**修正方法**:
- swagger-jsdocまたはOpenAPI Generator導入

---

## 📊 修正優先順位（4段階プロセス適用）

### Stage 1: 調査フェーズ
各タスクの影響範囲とリスクを完全把握

### Stage 2: 計画フェーズ
安全な実装計画を立案

### Stage 3: 実装フェーズ
計画書に従って慎重に実装

### Stage 4: テストフェーズ
実装が正しく、既存機能を壊していないことを確認

---

## 🎯 90点達成のための推奨修正

**必須修正（Critical + 重要なHigh）**:
1. JWT_SECRET/SESSION_SECRET修正（30分×2）
2. OpenAI API KEY保護（2時間）
3. N+1問題解決（2時間）
4. データベースインデックス追加（1時間）
5. べき等性実装（2時間）

**合計**: 8時間

**予想スコア改善**:
- セキュリティ: 23 → 28点（+5点）
- パフォーマンス: 14 → 18点（+4点）
- 信頼性: 13 → 18点（+5点）
- 運用性: 14 → 14点（変更なし）
- コード品質: 6.5 → 6.5点（変更なし）

**修正後総合スコア**: 84.5/100点（B評価: Good）

**90点達成のための追加修正**:
- キャッシング実装（4時間）: +4点
- /metricsエンドポイント実装（3時間）: +2点

**最終スコア**: 90.5/100点（A評価: Excellent）

---

**次のステップ**: Phase 8で慎重な自動修正を開始します。
