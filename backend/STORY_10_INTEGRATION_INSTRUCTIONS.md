# Story 10統合手順

**作成日**: 2026-02-12
**目的**: Story 10「初めての挨拶」をseed.tsに統合する

---

## 📁 作成済みファイル

1. **story-10-first-greetings.md** - 設計ドキュメント（完全な仕様）
2. **story-10-seed-code.ts** - ストーリー実装コード
3. **story-10-quiz-data.ts** - クイズデータ

---

## 🔧 統合手順

### Step 1: seed.tsを開く

```bash
cd /home/hanakotamio0705/Lingo\ Keeper\ JP/backend/prisma
```

### Step 2: Story 10のストーリーコードを挿入

**挿入位置**: 行1423の後（Story 9の完了ログの後、クイズセクションの前）

**Story 9完了ログ**:
```typescript
console.log('Created Story 9 (ビジネス交渉) with 5 chapters and branching structure');
```

**挿入するコード**: `story-10-seed-code.ts`の全内容

### Step 3: Story 10のクイズデータを挿入

**挿入位置**: quizData配列の最後（Story 9のクイズの後）

**既存のクイズ配列**:
```typescript
const quizData = [
  // Story 1 quizzes
  {...},
  // Story 2 quizzes
  {...},
  // ...
  // Story 9 quizzes
  {...},
  // ← ここにStory 10のクイズを追加
];
```

**挿入するコード**: `story-10-quiz-data.ts`の全内容

### Step 4: コンソールログの更新

**現在**（行1870）:
```typescript
console.log('Created 27 quizzes (3 per story) with choices');
```

**変更後**:
```typescript
console.log('Created 30 quizzes (3 per story x 10 stories) with choices');
```

---

## ✅ 検証手順

### Step 1: データベースをクリアしてseed実行

```bash
cd /home/hanakotamio0705/Lingo\ Keeper\ JP/backend
npx prisma db push --force-reset
npx prisma db seed
```

### Step 2: Story 10が作成されたことを確認

```typescript
// 確認スクリプト（backend/check-story-10.ts）
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const story10 = await prisma.story.findUnique({
    where: { story_id: '10' },
    include: {
      chapters: true,
      quizzes: {
        include: {
          choices: true,
        },
      },
    },
  });

  console.log('Story 10 exists:', !!story10);
  console.log('Title:', story10?.title);
  console.log('Chapters:', story10?.chapters.length);
  console.log('Quizzes:', story10?.quizzes.length);
}

main().then(() => prisma.$disconnect());
```

実行:
```bash
npx tsx check-story-10.ts
```

**期待される出力**:
```
Story 10 exists: true
Title: 初めての挨拶
Chapters: 9
Quizzes: 3
```

### Step 3: データ整合性チェック

```bash
npx tsx backend/check-data-integrity.ts
```

**期待される結果**:
- ストーリー数: 10
- チャプター数: 90（81 + 9）
- クイズ数: 30（27 + 3）
- すべての整合性チェック: ✅

---

## 🚀 自動統合スクリプト（推奨）

手動での統合が面倒な場合、以下のスクリプトで自動統合できます:

```bash
# 自動統合スクリプトを実行
npx tsx backend/integrate-story-10.ts
```

このスクリプトは:
1. seed.tsを読み込む
2. Story 10のコードを適切な位置に挿入
3. クイズデータを追加
4. コンソールログを更新
5. 新しいseed.tsを保存

---

## 📊 期待される最終状態

### ストーリー数
- **変更前**: 9ストーリー
- **変更後**: 10ストーリー

### JLPTレベル分布
- N5: 1個 → **2個**（初めてのコンビニ + **初めての挨拶**）
- N4: 2個
- N3: 2個
- N2: 2個
- N1: 2個

### チャプター数
- **変更前**: 81チャプター
- **変更後**: 90チャプター（+9）

### クイズ数
- **変更前**: 27クイズ
- **変更後**: 30クイズ（+3）

---

## 🐛 トラブルシューティング

### エラー1: "story_id '10' already exists"

**原因**: 既にStory 10が存在している

**解決**:
```bash
npx prisma db push --force-reset
npx prisma db seed
```

### エラー2: "Foreign key constraint failed"

**原因**: チャプターIDまたは選択肢のリンクが間違っている

**解決**:
- story-10-seed-code.tsのIDを確認
- next_chapter_idが正しいか確認

### エラー3: "Duplicate choice_id"

**原因**: 選択肢IDが重複している

**解決**:
- すべての choice_id が 'choice-10-' で始まっているか確認
- 重複がないか確認

---

## 📝 次のステップ

Story 10の統合が完了したら:

1. **Story 11「家族の紹介」** の作成準備
2. **Story 12「好きな食べ物」** の作成準備
3. Phase 1完了後、Phase 2計画の確認

---

**作成者**: Claude Code
**最終更新**: 2026-02-12
