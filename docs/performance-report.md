# Lingo Keeper JP - パフォーマンステストレポート

**実施日**: 2026-01-12
**テスト環境**: Local Development (WSL2)
**対象**: Frontend (React + Vite)

---

## 📊 ビルドサイズ分析

### 現状

| ファイル | サイズ（未圧縮） | サイズ（gzip） |
|----------|------------------|----------------|
| index.html | 0.79 KB | 0.47 KB |
| index.css | 0.29 KB | 0.22 KB |
| index.js | **603.72 KB** | **189.27 KB** |
| **合計** | **604.80 KB** | **189.96 KB** |

### 📈 分析結果

#### ✅ 良好な指標
- **Gzip圧縮率**: 68.7%（未圧縮604KB → gzip 190KB）
- **CSS軽量**: 0.29KB（MUIを使用している割に非常に軽量）
- **HTML軽量**: 0.79KB

#### ⚠️ 改善推奨事項
1. **メインバンドルサイズ**: 603.72KB（警告閾値500KBを超過）
   - 原因: MUI v7, React 19, その他ライブラリの全量バンドル
   - 推奨: 動的import()によるコード分割

2. **初回ロード時間への影響**:
   - gzip 190KB（3G回線: 約1.5秒、4G: 約0.4秒）
   - 許容範囲内だが、最適化の余地あり

---

## 🎯 Core Web Vitals 目標値

| 指標 | 目標値 | 説明 |
|------|--------|------|
| **LCP** (Largest Contentful Paint) | < 2.5秒 | 最大コンテンツの描画時間 |
| **FID** (First Input Delay) | < 100ms | 初回入力遅延 |
| **CLS** (Cumulative Layout Shift) | < 0.1 | 累積レイアウトシフト |
| **FCP** (First Contentful Paint) | < 1.8秒 | 初回コンテンツ描画時間 |
| **TTI** (Time to Interactive) | < 3.8秒 | インタラクティブになるまでの時間 |

**注記**: Lighthouseが利用できないため、実測値は未取得。デプロイ後にVercel Analyticsで測定予定。

---

## 📦 依存関係分析

### 主要ライブラリとサイズ影響

| ライブラリ | バージョン | 推定サイズ影響 |
|------------|------------|----------------|
| React + ReactDOM | 19.0.0 | ~150KB |
| MUI (Material-UI) | 7.x | ~250KB |
| React Router | 7.x | ~50KB |
| Zustand | 5.x | ~5KB |
| Axios | 1.x | ~15KB |
| その他 | - | ~130KB |

### バンドル内訳（推定）

```
React Core (25%)         ████████████░░░░░░░░░░░░░░░░░░░░░░░░░░░░
MUI Components (41%)     ████████████████████████░░░░░░░░░░░░░░░░
Routing (8%)             ███████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
State Management (1%)    █░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
HTTP Client (3%)         ██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
App Code (22%)           █████████████░░░░░░░░░░░░░░░░░░░░░░░░░░
```

---

## 🔧 最適化推奨事項

### 優先度：高

#### 1. コード分割（Route-based Code Splitting）

**現状問題**:
- 全ページのコードが初回ロード時に一括ダウンロード
- ユーザーが `/stories` のみ訪問でも、`/quiz`のコードもロード

**推奨実装**:
```typescript
// App.tsx - Before (現状)
import StoriesPage from '@/pages/StoriesPage';
import QuizProgressPage from '@/pages/QuizProgress/QuizProgressPage';

// App.tsx - After (推奨)
import { lazy, Suspense } from 'react';

const StoriesPage = lazy(() => import('@/pages/StoriesPage'));
const QuizProgressPage = lazy(() => import('@/pages/QuizProgress/QuizProgressPage'));

// Routes with Suspense
<Suspense fallback={<CircularProgress />}>
  <Routes>
    <Route path="/stories" element={<StoriesPage />} />
    <Route path="/quiz" element={<QuizProgressPage />} />
  </Routes>
</Suspense>
```

**期待効果**:
- 初回バンドルサイズ: 603KB → 約400KB（約30%削減）
- 各ページの遅延ロード: 50-100KB

#### 2. MUIツリーシェイキング最適化

**推奨実装**:
```typescript
// Before (現状)
import { Button, TextField, Box } from '@mui/material';

// After (推奨 - 変更不要、ビルド設定で最適化)
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'mui-core': ['@mui/material'],
          'mui-icons': ['@mui/icons-material'],
        },
      },
    },
  },
});
```

**期待効果**:
- ブラウザキャッシュ効率向上（MUIが独立チャンクに）
- 再デプロイ時の差分ダウンロード削減

### 優先度：中

#### 3. 画像最適化

**現状**: 画像未使用（thumbnail_url はNULL）

**将来対応**:
- WebP形式使用
- 遅延ロード（Intersection Observer）
- レスポンシブ画像（srcset）

#### 4. フォント最適化

**現状**:
```html
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@300;400;500;700&display=swap" rel="stylesheet">
```

**推奨**:
- `font-display: swap` 既に設定済み ✅
- フォントサブセット化（日本語常用漢字のみ）
- 可変フォント（Variable Fonts）検討

#### 5. API Response キャッシング

**実装済み**: ✅ React Query使用
- 自動キャッシング・再検証
- Stale-While-Revalidate戦略

### 優先度：低

#### 6. プリロード・プリフェッチ

**推奨実装**:
```typescript
// ストーリーページでクイズページのプリフェッチ
useEffect(() => {
  // User が /stories にいる時、/quiz を事前ロード
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = '/quiz';
  document.head.appendChild(link);
}, []);
```

---

## 🚀 実装優先順位とロードマップ

| 最適化項目 | 優先度 | 期待効果 | 実装時期 |
|------------|--------|----------|----------|
| Route-based Code Splitting | 高 | -30% 初回ロード | Phase 1.5 |
| MUI Manual Chunks | 高 | キャッシュ効率向上 | Phase 1.5 |
| フォントサブセット化 | 中 | -50KB | Phase 2 |
| 画像最適化 | 中 | N/A (未使用) | Phase 2 |
| プリフェッチ | 低 | UX向上 | Phase 3 |

---

## 📊 E2Eテストパフォーマンス実績

### Story Experience Page (8テスト)
- **総実行時間**: 26.2秒
- **平均テスト時間**: 3.3秒/テスト
- **並列実行**: 4 workers

### Quiz Progress Page (8テスト)
- **総実行時間**: 35.0秒
- **平均テスト時間**: 4.4秒/テスト
- **並列実行**: 4 workers

**分析**:
- Quiz Pageがやや重い（API呼び出し+グラフ描画）
- 許容範囲内のパフォーマンス

---

## 🔍 ネットワークパフォーマンス

### API Response Time（実測）

| エンドポイント | レスポンス時間 | データサイズ |
|----------------|----------------|--------------|
| GET /api/health | < 100ms | 0.1KB |
| GET /api/stories | ~150ms | 2-3KB |
| GET /api/quizzes | ~200ms | 5-10KB |
| GET /api/progress | ~180ms | 3-5KB |

**評価**: ✅ 全エンドポイントが200ms以内で応答（優秀）

---

## 📝 デプロイ後の監視項目

### Vercel Analytics監視指標

1. **Real User Monitoring (RUM)**:
   - LCP, FID, CLS の実測値
   - デバイス別パフォーマンス
   - 地域別レイテンシ

2. **ページ別パフォーマンス**:
   - `/stories`: 目標LCP < 2.5秒
   - `/quiz`: 目標LCP < 3.0秒

3. **バンドルサイズ監視**:
   - デプロイ毎にサイズ増加を追跡
   - 500KB閾値超過時にアラート

### Cloud Run メトリクス監視

1. **API Latency**:
   - p50: < 100ms
   - p95: < 300ms
   - p99: < 500ms

2. **Request Count**:
   - 正常系: 2xx レスポンス率 > 99%
   - エラー率: 5xx < 0.1%

---

## ✅ 推奨アクション

### 即座に実施（Phase 1.5）
1. ✅ ビルドサイズ測定完了
2. ⏳ Route-based Code Splitting実装
3. ⏳ Manual Chunks設定（vite.config.ts）

### デプロイ後に実施
1. ⏳ Vercel Analyticsでリアルユーザーメトリクス取得
2. ⏳ Lighthouseスコア測定（本番URL）
3. ⏳ Core Web Vitals目標値達成確認

### Phase 2で実施
1. フォント最適化（サブセット化）
2. 画像最適化戦略（ストーリーサムネイル追加時）
3. Service Worker導入（オフライン対応）

---

## 📚 参考資料

- [Web.dev - Core Web Vitals](https://web.dev/vitals/)
- [Vite - Manual Chunks](https://vite.dev/guide/build.html#chunking-strategy)
- [React - Code Splitting](https://react.dev/reference/react/lazy)
- [Vercel Analytics Documentation](https://vercel.com/docs/analytics)

---

**作成者**: Lingo Keeper Team
**最終更新**: 2026-01-12
**次回レビュー**: デプロイ後
