# Lingo Keeper JP - Phase 2 機能要件定義

**作成日**: 2026-01-12
**対象フェーズ**: Phase 2 (機能拡張)
**予定開始**: Phase 1.5完了後

---

## 📋 Phase 2 概要

Phase 1（MVP）で構築した基盤を拡張し、ユーザー体験を向上させる機能を追加します。

**主要目標**:
1. ユーザー認証・アカウント管理
2. 学習データの永続化
3. UI/UX改善（ダークモード、アクセシビリティ）
4. 音声認識による発音評価
5. ソーシャル機能

---

## 🎯 優先順位付き機能リスト

| 優先度 | 機能 | 工数見積 | 依存関係 |
|--------|------|----------|----------|
| P0 | ユーザー認証システム | 大 | なし |
| P0 | 学習進捗の永続化 | 中 | 認証 |
| P1 | ダークモード | 小 | なし |
| P1 | 音声認識（発音評価） | 大 | なし |
| P2 | ソーシャル共有 | 中 | 認証 |
| P2 | アクセシビリティ強化 | 中 | なし |

---

## 🔐 P0-1: ユーザー認証システム

### 目的
- ユーザーごとの学習データを管理
- 複数デバイス間での進捗同期
- セキュアなアクセス制御

### 機能要件

#### 認証方式
1. **メール・パスワード認証**
   - サインアップ
   - ログイン
   - パスワードリセット
   - メール確認

2. **OAuth認証（優先度：中）**
   - Google
   - GitHub
   - Apple

#### 実装技術
```yaml
認証ライブラリ:
  - NextAuth.js / Auth.js（推奨）
  - または Firebase Authentication

JWT管理:
  - httpOnly Cookie使用
  - Refresh Token実装
  - 有効期限: 30分（Access）、7日（Refresh）

バックエンド:
  - JWT検証ミドルウェア
  - ユーザーロール管理（user, admin）
```

#### データベーススキーマ拡張

```sql
-- users テーブル追加
CREATE TABLE users (
  user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255),  -- bcrypt
  display_name VARCHAR(100),
  avatar_url VARCHAR(500),
  oauth_provider VARCHAR(50),  -- google, github, apple
  oauth_id VARCHAR(255),
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- user_progress テーブル拡張（user_id追加）
ALTER TABLE user_progress ADD COLUMN user_id UUID REFERENCES users(user_id);

-- quiz_results テーブル拡張（user_id追加）
ALTER TABLE quiz_results ADD COLUMN user_id UUID REFERENCES users(user_id);
```

#### APIエンドポイント

```
POST   /api/auth/signup            # サインアップ
POST   /api/auth/login             # ログイン
POST   /api/auth/logout            # ログアウト
POST   /api/auth/refresh           # トークンリフレッシュ
POST   /api/auth/password-reset    # パスワードリセット要求
POST   /api/auth/password-confirm  # パスワードリセット確認
GET    /api/auth/me                # 現在のユーザー情報
```

#### UIコンポーネント
- ログインページ (`/login`)
- サインアップページ (`/signup`)
- プロフィールページ (`/profile`)
- パスワードリセットページ (`/reset-password`)
- ユーザーメニュー（ヘッダー）

### 成功指標
- ✅ ユーザー登録率: > 70%（訪問者のうち）
- ✅ ログイン成功率: > 95%
- ✅ OAuth使用率: > 40%

---

## 💾 P0-2: 学習進捗の永続化

### 目的
- LocalStorageからデータベースへ移行
- 複数デバイス間での進捗同期
- データ損失リスク軽減

### 機能要件

#### データ移行戦略

**Phase 1（LocalStorage）→ Phase 2（Database）**:
1. 既存LocalStorageデータをバックエンドに送信
2. ユーザー初回ログイン時にマイグレーション
3. LocalStorageは読み取り専用に（後方互換性）

#### APIエンドポイント拡張

```
GET    /api/users/{user_id}/progress              # ユーザー進捗取得
POST   /api/users/{user_id}/progress              # 進捗保存
PUT    /api/users/{user_id}/progress/{progress_id} # 進捗更新
GET    /api/users/{user_id}/quiz-results          # クイズ履歴取得
POST   /api/users/{user_id}/quiz-results          # クイズ結果保存
```

#### フロントエンド実装

```typescript
// hooks/useUserProgress.ts（新規）
export const useUserProgress = (userId: string) => {
  const { data, isLoading } = useQuery({
    queryKey: ['user-progress', userId],
    queryFn: () => ProgressApiService.getUserProgress(userId),
  });

  const saveProgress = useMutation({
    mutationFn: (progress: UserProgress) =>
      ProgressApiService.saveProgress(userId, progress),
    onSuccess: () => {
      queryClient.invalidateQueries(['user-progress', userId]);
    },
  });

  return { data, isLoading, saveProgress };
};
```

### 成功指標
- ✅ データ同期成功率: > 99.5%
- ✅ 平均レイテンシ: < 200ms
- ✅ マイグレーション成功率: 100%

---

## 🌙 P1-1: ダークモード

### 目的
- 目の疲れ軽減
- バッテリー消費削減（OLED）
- モダンなUI/UX提供

### 機能要件

#### テーマ切り替え

**実装方式**:
```typescript
// theme/theme.ts
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#4CAF50' },
    background: { default: '#F5F5F5' },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#81C784' },
    background: { default: '#121212' },
  },
});

// hooks/useTheme.ts
export const useThemeMode = () => {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // LocalStorage or OS preference
    const savedMode = localStorage.getItem('theme-mode') ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setMode(savedMode as 'light' | 'dark');
  }, []);

  return { mode, toggleMode: () => setMode(prev => prev === 'light' ? 'dark' : 'light') };
};
```

#### UIコンポーネント
- ヘッダーにテーマ切り替えボタン
- システムテーマ自動検出
- ユーザー設定保存（LocalStorage / Database）

### 成功指標
- ✅ ダークモード使用率: > 30%
- ✅ テーマ切り替え速度: < 100ms

---

## 🎤 P1-2: 音声認識（発音評価）

### 目的
- スピーキング練習機能提供
- 発音精度フィードバック
- 学習モチベーション向上

### 機能要件

#### 音声認識API

**選択肢**:
1. **Azure Speech Services**（推奨）
   - 発音評価機能内蔵
   - JLPT対応日本語モデル
   - 詳細なフィードバック（精度、流暢性、完全性）

2. **Google Cloud Speech-to-Text**
   - 高精度
   - 発音評価は別途実装必要

3. **Web Speech API**
   - 無料
   - 発音評価機能なし

#### 実装フロー

```typescript
// services/SpeechRecognitionService.ts
class SpeechRecognitionService {
  async evaluatePronunciation(
    audioBlob: Blob,
    referenceText: string
  ): Promise<PronunciationResult> {
    // Azure Speech Services API呼び出し
    const response = await azureSpeechClient.evaluatePronunciation({
      audio: audioBlob,
      referenceText,
      language: 'ja-JP',
    });

    return {
      recognizedText: response.text,
      accuracyScore: response.pronunciation.accuracyScore,  // 0-100
      fluencyScore: response.pronunciation.fluencyScore,    // 0-100
      completenessScore: response.pronunciation.completenessScore, // 0-100
      feedback: this.generateFeedback(response),
    };
  }

  private generateFeedback(result: any): string {
    if (result.accuracyScore > 90) return '完璧です！';
    if (result.accuracyScore > 70) return '良好です。もう少し練習しましょう。';
    return 'もう一度挑戦してみましょう。';
  }
}
```

#### UIコンポーネント

- **録音ボタン**（ストーリービューワー内）
- **波形表示**（録音中）
- **発音評価結果カード**
  - スコア（0-100）
  - フィードバックメッセージ
  - 再試行ボタン

#### データベーススキーマ

```sql
CREATE TABLE pronunciation_results (
  result_id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(user_id),
  chapter_id VARCHAR(100),
  reference_text TEXT,
  recognized_text TEXT,
  accuracy_score INT,     -- 0-100
  fluency_score INT,      -- 0-100
  completeness_score INT, -- 0-100
  created_at TIMESTAMP DEFAULT NOW()
);
```

### 成功指標
- ✅ 音声認識精度: > 85%
- ✅ 発音評価使用率: > 40%（アクティブユーザー）
- ✅ 平均レイテンシ: < 3秒

---

## 🔗 P2-1: ソーシャル共有機能

### 目的
- ユーザーエンゲージメント向上
- バイラル効果促進
- コミュニティ形成

### 機能要件

#### 共有可能コンテンツ

1. **学習進捗**
   - 完了したストーリー数
   - 累計学習時間
   - JLPTレベル達成
   - カスタム画像生成（OGP）

2. **クイズ成績**
   - 正答率
   - 連続正解記録
   - レベル別ランキング

#### 共有先

- Twitter/X
- Facebook
- LINE
- クリップボードコピー

#### APIエンドポイント

```
GET    /api/users/{user_id}/share-card    # シェア用画像生成
POST   /api/share-events                  # シェアイベント記録（分析用）
```

#### UIコンポーネント

```typescript
// components/ShareButton.tsx
interface ShareButtonProps {
  title: string;
  description: string;
  imageUrl: string;
  url: string;
}

export const ShareButton: React.FC<ShareButtonProps> = (props) => {
  const handleShare = async (platform: 'twitter' | 'facebook' | 'line') => {
    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(props.title)}&url=${encodeURIComponent(props.url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(props.url)}`,
      line: `https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(props.url)}`,
    };

    window.open(shareUrls[platform], '_blank', 'width=600,height=400');
  };

  return (
    <Box>
      <Button onClick={() => handleShare('twitter')}>Twitterでシェア</Button>
      <Button onClick={() => handleShare('facebook')}>Facebookでシェア</Button>
      <Button onClick={() => handleShare('line')}>LINEでシェア</Button>
    </Box>
  );
};
```

### 成功指標
- ✅ シェア率: > 5%（アクティブユーザー）
- ✅ シェア経由の新規登録: > 10%

---

## ♿ P2-2: アクセシビリティ強化

### 目的
- WCAG 2.1 Level AA準拠
- スクリーンリーダー対応
- キーボードナビゲーション完全サポート

### 機能要件

#### 実装項目

1. **セマンティックHTML**
   - 適切な見出し構造（h1-h6）
   - aria-label, aria-describedby追加
   - role属性適切使用

2. **キーボードナビゲーション**
   - Tab順序最適化（tabindex）
   - Enter/Spaceでボタンアクティブ化
   - Escでモーダル閉じる

3. **カラーコントラスト**
   - WCAG AA基準（4.5:1以上）
   - カラーピッカーで検証

4. **スクリーンリーダー対応**
   - 画像にalt属性
   - フォームにlabel関連付け
   - 動的コンテンツ変更時のaria-live

#### 検証ツール

```bash
# axe-core自動テスト
npm install --save-dev @axe-core/playwright

# E2Eテストに統合
test('accessibility check', async ({ page }) => {
  await page.goto('/stories');
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
  expect(accessibilityScanResults.violations).toEqual([]);
});
```

### 成功指標
- ✅ WCAG 2.1 Level AA準拠: 100%
- ✅ Lighthouse Accessibility Score: > 95

---

## 📅 Phase 2 実装スケジュール（仮）

| 週 | タスク | 担当 | 状態 |
|----|--------|------|------|
| W1-2 | P0-1: ユーザー認証実装 | Backend | 未着手 |
| W3 | P0-2: 進捗永続化 | Full Stack | 未着手 |
| W4 | P1-1: ダークモード | Frontend | 未着手 |
| W5-6 | P1-2: 音声認識 | Full Stack | 未着手 |
| W7 | P2-1: ソーシャル共有 | Frontend | 未着手 |
| W8 | P2-2: アクセシビリティ | Frontend | 未着手 |
| W9 | 統合テスト・QA | QA | 未着手 |
| W10 | デプロイ・監視 | DevOps | 未着手 |

**総工数見積**: 10週間（2.5ヶ月）

---

## 📊 Phase 2 成功指標（KPI）

| 指標 | 目標値 | 測定方法 |
|------|--------|----------|
| ユーザー登録率 | > 70% | GA4 |
| DAU（Daily Active Users） | > 500 | Database |
| 平均学習時間 | > 15分/日 | Database |
| ダークモード使用率 | > 30% | LocalStorage |
| 音声認識使用率 | > 40% | Database |
| シェア率 | > 5% | API Log |
| WCAG準拠率 | 100% | axe-core |

---

## 🔗 関連ドキュメント

- [README.md](../README.md) - プロジェクト概要
- [CLAUDE.md](../CLAUDE.md) - プロジェクト設定
- [developer-guide.md](developer-guide.md) - 開発者ガイド
- [deployment-guide.md](deployment-guide.md) - デプロイガイド

---

**作成者**: Lingo Keeper Team
**最終更新**: 2026-01-12
**次回レビュー**: Phase 1.5完了時
