# 選択肢多言語化マイグレーションガイド

## 概要

このドキュメントは、ストーリー選択肢（choices）にルビと英語翻訳を追加するためのデータベースマイグレーション手順を説明します。

## 実施日
2026-03-10

## 変更内容

### データベーススキーマ変更
- **テーブル**: `choices`
- **新フィールド**:
  - `choice_text_ruby` VARCHAR(1000) NULL - ルビ付き日本語テキスト
  - `choice_text_en` VARCHAR(1000) NULL - 英語翻訳

### コード変更
- Prisma schema更新
- TypeScript型定義更新（backend & frontend）
- フロントエンド表示更新

## マイグレーション手順

### ステップ1: 本番データベースにスキーマ変更を適用

**方法A: Prismaマイグレーション（推奨）**

```bash
cd backend
npx prisma migrate deploy
```

**方法B: 直接SQL実行**

```sql
ALTER TABLE "choices"
ADD COLUMN "choice_text_ruby" VARCHAR(1000),
ADD COLUMN "choice_text_en" VARCHAR(1000);
```

### ステップ2: サンプルデータ追加（Story ID: 1）

```bash
cd backend
psql $DATABASE_URL -f scripts/add-sample-choice-translations.sql
```

または、NeonダッシュボードのSQL Editorから：

```sql
-- 内容は backend/scripts/add-sample-choice-translations.sql を参照
```

### ステップ3: 動作確認

1. **バックエンドAPI確認**:
```bash
curl https://lingo-keeper-jp-backend-16378814888.asia-northeast1.run.app/api/stories/1/chapters
```

レスポンスに `choice_text_ruby` と `choice_text_en` が含まれていることを確認。

2. **フロントエンド確認**:
   - https://lingo-keeper-jp.vercel.app/stories/1 にアクセス
   - 選択肢カードにルビと英語翻訳が表示されることを確認

## サンプルデータ内容

### ストーリー1: 東京での新しい生活

#### チャプター1の選択肢

| 日本語 | ルビ | 英語 |
|--------|------|------|
| カフェで休憩する | カフェで<ruby>休憩<rt>きゅうけい</rt></ruby>する | Take a break at a cafe |
| 観光スポットを探す | <ruby>観光<rt>かんこう</rt></ruby>スポットを<ruby>探<rt>さが</rt></ruby>す | Look for tourist spots |
| アパートへ直行する | アパートへ<ruby>直行<rt>ちょっこう</rt></ruby>する | Go straight to the apartment |

#### その他の選択肢

| 日本語 | ルビ | 英語 |
|--------|------|------|
| 次へ進む | <ruby>次<rt>つぎ</rt></ruby>へ<ruby>進<rt>すす</rt></ruby>む | Continue |

## ロールバック手順

マイグレーションに問題があった場合：

```sql
ALTER TABLE "choices"
DROP COLUMN "choice_text_ruby",
DROP COLUMN "choice_text_en";
```

## 今後の展開

### Phase 2: 全ストーリーへの展開

すべてのストーリー（18個）の選択肢に英語翻訳とルビを追加する場合：

1. **オプションA: 手動追加**
   - ストーリーごとにSQLスクリプトを作成
   - 段階的に適用

2. **オプションB: AI自動生成**
   - OpenAI APIを使用して自動生成
   - スクリプト: `backend/scripts/generate-all-choice-translations.ts` (作成予定)

### Phase 3: 管理画面での編集

- 管理画面から選択肢の翻訳を編集可能にする
- バリデーション: ルビのHTML形式チェック

## 関連ファイル

- **マイグレーション**: `backend/prisma/migrations/20260310074000_add_choice_multilang_fields/migration.sql`
- **サンプルデータ**: `backend/scripts/add-sample-choice-translations.sql`
- **Prismaスキーマ**: `backend/prisma/schema.prisma`
- **TypeScript型**: `backend/src/types/index.ts`, `frontend/src/types/index.ts`
- **表示コンポーネント**: `frontend/src/pages/StoryExperience/StoryExperiencePage.tsx`

## 注意事項

- ⚠️ 本番データベースへの変更は慎重に実施してください
- ⚠️ バックアップを取得してから実行することを推奨します
- ⚠️ マイグレーション中はサービス停止不要（NULL許容フィールド追加のため）
- ✅ フィールドはNULL許容なので、既存データへの影響なし

## トラブルシューティング

### 問題: マイグレーションが失敗する

```
Error: P3006 Migration failed to apply
```

**解決策**:
1. shadow databaseの問題の可能性
2. 直接SQL実行（方法B）を試してください

### 問題: 本番環境で翻訳が表示されない

**確認事項**:
1. APIレスポンスに新フィールドが含まれているか
2. フロントエンドが最新版にデプロイされているか
3. ブラウザキャッシュをクリア

## 実施記録

- **2026-03-10 07:50**: マイグレーションファイル作成
- **2026-03-10 08:00**: サンプルデータSQLスクリプト作成
- **実施予定**: TBD

## 承認

- **実装者**: Claude Sonnet 4.5
- **レビュー**: Pending
- **承認**: Pending
