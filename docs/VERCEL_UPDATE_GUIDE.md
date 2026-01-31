# Vercel環境変数更新 & 再デプロイ 完全ガイド

**対象**: Lingo Keeper JP プロジェクト
**実施日**: 2026-01-25
**所要時間**: 約5-10分

---

## 📋 準備

### 必要なもの
- Vercelアカウントへのアクセス権限
- ブラウザ（Chrome, Firefox, Safari, Edge等）
- プロジェクト名: **frontend**

### 更新する環境変数
- **変数名**: `VITE_API_URL`
- **現在の値**: `https://lingo-keeper-backend-16378814888.asia-northeast1.run.app`
- **新しい値**: `https://lingo-keeper-jp-backend-16378814888.asia-northeast1.run.app`
- **変更点**: `lingo-keeper-backend` → `lingo-keeper-jp-backend` ("jp"を追加)

---

## 🔧 Part 1: 環境変数の更新

### Step 1: Vercelダッシュボードにアクセス

1. ブラウザで https://vercel.com を開く
2. 右上の「**Log In**」または「**Dashboard**」をクリック
3. ログイン済みの場合は自動でダッシュボードが表示されます

**画面の見た目**:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Vercel Dashboard
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Your Projects:
┌─────────────────────────────────────┐
│ 📁 frontend                         │ ← これをクリック
│ Production: frontend-seven-beta...  │
│ Updated 2 hours ago                 │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ 📁 backend                          │
│ ...                                 │
└─────────────────────────────────────┘
```

---

### Step 2: プロジェクト「frontend」を選択

1. プロジェクト一覧から「**frontend**」をクリック

**表示される画面**:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
frontend
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

タブ: [Overview] [Deployments] [Analytics] [Logs] [Settings]
                                                      ↑
                                                  ここをクリック
```

2. 上部のタブから「**Settings**」をクリック

---

### Step 3: Environment Variables（環境変数）ページを開く

1. 左サイドバーのメニューから「**Environment Variables**」をクリック

**サイドバーの見た目**:
```
Settings
├─ General
├─ Domains
├─ Git
├─ Environment Variables  ← ここをクリック
├─ Functions
├─ Security
└─ Advanced
```

---

### Step 4: VITE_API_URL を検索

1. ページ上部の検索ボックスに「**VITE_API_URL**」と入力
2. フィルターされて該当する環境変数のみが表示されます

**表示される画面**:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Environment Variables
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔍 Search: VITE_API_URL

┌─────────────────────────────────────────────────┐
│ VITE_API_URL                                    │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│ 🌐 Production:                                  │
│    https://lingo-keeper-backend-1637881488...   │ ← 間違い
│                                                 │
│ 🔄 Preview:                                     │
│    https://lingo-keeper-backend-1637881488...   │ ← 間違い
│                                                 │
│ 💻 Development:                                 │
│    https://lingo-keeper-backend-1637881488...   │ ← 間違い
│                                                 │
│ [Edit] [Delete]                                 │
│        ↑                                        │
│    ここをクリック                                │
└─────────────────────────────────────────────────┘
```

---

### Step 5: Production環境の値を編集

1. `VITE_API_URL` の右側にある「**Edit**」ボタンをクリック
2. モーダルウィンドウが開きます

**モーダルの見た目**:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Edit Environment Variable
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Name:
┌─────────────────────────────────────────┐
│ VITE_API_URL                            │
└─────────────────────────────────────────┘

Value (Production):
┌─────────────────────────────────────────┐
│ https://lingo-keeper-backend-16378...   │ ← ここを編集
└─────────────────────────────────────────┘

Value (Preview):
┌─────────────────────────────────────────┐
│ https://lingo-keeper-backend-16378...   │ ← ここも編集
└─────────────────────────────────────────┘

Value (Development):
┌─────────────────────────────────────────┐
│ https://lingo-keeper-backend-16378...   │ ← ここも編集
└─────────────────────────────────────────┘

              [Cancel] [Save]
                        ↑
                    最後にクリック
```

3. **Production** のテキストボックスをクリック
4. 現在の値を以下に変更:
   ```
   https://lingo-keeper-jp-backend-16378814888.asia-northeast1.run.app
   ```
   - **ポイント**: `lingo-keeper-backend` の後に `jp-` を追加

5. **Preview** のテキストボックスも同様に変更:
   ```
   https://lingo-keeper-jp-backend-16378814888.asia-northeast1.run.app
   ```

6. **Development** のテキストボックスも同様に変更:
   ```
   https://lingo-keeper-jp-backend-16378814888.asia-northeast1.run.app
   ```

7. 右下の「**Save**」ボタンをクリック

---

### Step 6: 保存確認

保存が完了すると、画面上部に緑色の通知が表示されます:

```
✅ Environment variable updated successfully
```

**更新後の表示**:
```
┌─────────────────────────────────────────────────┐
│ VITE_API_URL                                    │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│ 🌐 Production:                                  │
│    https://lingo-keeper-jp-backend-16378...     │ ← 修正完了
│                                                 │
│ 🔄 Preview:                                     │
│    https://lingo-keeper-jp-backend-16378...     │ ← 修正完了
│                                                 │
│ 💻 Development:                                 │
│    https://lingo-keeper-jp-backend-16378...     │ ← 修正完了
│                                                 │
│ [Edit] [Delete]                                 │
└─────────────────────────────────────────────────┘
```

✅ **Part 1 完了！**

---

## 🚀 Part 2: 再デプロイ（キャッシュクリア）

### Step 7: Deploymentsページに移動

1. 上部のタブから「**Deployments**」をクリック

**タブの見た目**:
```
frontend
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[Overview] [Deployments] [Analytics] [Logs] [Settings]
            ↑
        ここをクリック
```

---

### Step 8: 最新のデプロイを探す

1. デプロイ一覧が表示されます
2. **一番上のデプロイ**（最新）を確認

**デプロイ一覧の見た目**:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Deployments
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔍 Filter by branch or commit...

┌─────────────────────────────────────────────────┐
│ ✅ Production                                   │ ← 最新のデプロイ
│ fix: Fix production environment issues...       │
│ main • 4fbc131 • 2 minutes ago                  │
│                                                 │
│ frontend-seven-beta-72.vercel.app               │
│                                                 │
│ ... (3 dots)                                    │ ← ここをクリック
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ ✅ Production                                   │
│ Fix Dockerfile: Ensure Prisma client...         │
│ main • 96631d7 • 2 hours ago                    │
└─────────────────────────────────────────────────┘
```

3. 一番上のデプロイの右側にある「**・・・**」（3つのドット）をクリック

---

### Step 9: Redeployを選択

メニューが表示されます:

```
┌─────────────────────┐
│ View Deployment     │
│ View Deployment Log │
│ View Source Commit  │
│ ────────────────────│
│ Redeploy           │ ← ここをクリック
│ Instant Rollback    │
│ Delete              │
└─────────────────────┘
```

1. 「**Redeploy**」をクリック

---

### Step 10: キャッシュクリアの設定

モーダルウィンドウが表示されます:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Redeploy to Production
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This will create a new deployment with the same
source code and latest configuration.

☐ Use existing Build Cache              ← 重要！
   ↑
   このチェックボックスを確認

⚠️ Important: Uncheck this box to clear cache!

┌─────────────────────────────────────────┐
│ Deployment will be created from:       │
│ Branch: main                            │
│ Commit: 4fbc131                         │
│ Message: fix: Fix production env...     │
└─────────────────────────────────────────┘

              [Cancel] [Redeploy]
                        ↑
                    ここをクリック
```

**重要**:
1. 「**Use existing Build Cache**」のチェックボックスが**オフ**（☐）になっていることを確認
   - ✅ チェックなし（☐）= キャッシュをクリアして再ビルド（推奨）
   - ❌ チェックあり（☑）= キャッシュを使用（タイトルが古いまま）

2. チェックボックスがオンになっている場合は、**クリックしてオフにする**

3. 右下の「**Redeploy**」ボタンをクリック

---

### Step 11: デプロイの進行状況を確認

再デプロイが開始されます:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Deployments
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────────────┐
│ 🔄 Building                                     │ ← 新しいデプロイ
│ fix: Fix production environment issues...       │
│ main • 4fbc131 • Just now                       │
│                                                 │
│ Building... ████████░░░░░░░░░░░░░░ 40%         │
└─────────────────────────────────────────────────┘
```

**ステータスの変化**:
1. 🔄 **Building** (40-60秒): ビルド中
2. 🚀 **Deploying** (10-20秒): デプロイ中
3. ✅ **Ready** (完了): デプロイ完了

**所要時間**: 約2-3分

---

### Step 12: デプロイ完了の確認

デプロイが完了すると、ステータスが「✅ Ready」になります:

```
┌─────────────────────────────────────────────────┐
│ ✅ Production                                   │
│ fix: Fix production environment issues...       │
│ main • 4fbc131 • 2 minutes ago                  │
│                                                 │
│ frontend-seven-beta-72.vercel.app               │
│                                                 │
│ [Visit] [Inspect]                               │
└─────────────────────────────────────────────────┘
```

1. 「**Visit**」ボタンをクリックして本番サイトを開く
2. または直接 https://frontend-seven-beta-72.vercel.app にアクセス

✅ **Part 2 完了！**

---

## ✅ Part 3: 動作確認

### Step 13: タイトル表示の確認

1. ブラウザで https://frontend-seven-beta-72.vercel.app を開く
2. **強制リロード** を実行:
   - **Windows/Linux**: Ctrl + Shift + R
   - **Mac**: Cmd + Shift + R

3. ブラウザのタブを確認:
   - ✅ **正しい表示**: "Lingo Keeper JP - 日本語学習アプリ"
   - ❌ **古い表示**: "Lingo Keeper - English Learning Adventure"

4. ページ内のヘッダーを確認:
   - ✅ **正しい表示**: "Lingo Keeper JP"

---

### Step 14: APIエラーの確認

1. F12キーを押して開発者ツールを開く
2. 「**Console**」タブをクリック
3. ページをリロード（F5）
4. **エラーメッセージを確認**:
   - ✅ **成功**: 401エラーが表示されない
   - ❌ **失敗**: 赤色で "Failed to load resource: 401" が表示される

**正常な場合**:
```
Console
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

No errors                                     ← OK!
```

**エラーがある場合**:
```
Console
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

❌ Failed to load resource: 401               ← まだ問題あり
   lingo-keeper-backend-16378814888...
```

もしまだ401エラーが出る場合は、環境変数の更新が反映されていない可能性があります。

---

### Step 15: APIレスポンスの確認

1. 開発者ツールの「**Network**」タブをクリック
2. ページをリロード（F5）
3. 左側のフィルターで「**Fetch/XHR**」を選択
4. `/api/stories` リクエストを探してクリック

**確認ポイント**:
```
Network > Fetch/XHR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

stories    Status: 200    Type: xhr
↑
クリック

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Headers
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Request URL:                                  ← 確認
https://lingo-keeper-jp-backend-16378814888.asia-northeast1.run.app/api/stories
                      ↑
                    "jp" があるか確認

Status Code: 200 OK                           ← OK!
```

✅ **正しいURL**: `lingo-keeper-jp-backend` が含まれている
❌ **古いURL**: `lingo-keeper-backend`（jpなし）が含まれている

---

### Step 16: ストーリー表示の確認

1. ログインページに移動: https://frontend-seven-beta-72.vercel.app/login
2. デモアカウントでログイン:
   - **Email**: `demo@example.com`
   - **Password**: `demo123`
3. 「ログイン」ボタンをクリック
4. ダッシュボードにリダイレクトされることを確認
5. 左サイドバーの「**Stories**」をクリック
6. **ストーリーカードが9件表示されることを確認**:
   - 東京での新しい生活
   - 駅での待ち合わせ
   - カフェでの出会い
   - 居酒屋での夜
   - 日本企業での面接
   - 温泉旅行
   - ビジネス交渉
   - 京都の古寺巡り
   - 初めてのコンビニ

**正常な場合**:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Stories
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Filter: [All Levels ▼]

┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ 東京での新しい│ │ 駅での待ち合わせ│ │ カフェでの出会い│
│ 生活         │ │              │ │              │
│ N3 • B1      │ │ N4 • A2      │ │ N4 • A2      │
│ 10 min       │ │ 8 min        │ │ 8 min        │
└──────────────┘ └──────────────┘ └──────────────┘

... (残り6件)
```

**エラーの場合**:
```
No stories available                          ← API接続失敗
```

---

## ✅ 完了チェックリスト

すべての項目にチェックが入れば、修正完了です！

- [ ] Vercelダッシュボードにログイン完了
- [ ] プロジェクト「frontend」を選択
- [ ] Settings → Environment Variables を開いた
- [ ] `VITE_API_URL` を検索
- [ ] Production環境の値を `lingo-keeper-jp-backend` に変更
- [ ] Preview環境の値を `lingo-keeper-jp-backend` に変更
- [ ] Development環境の値を `lingo-keeper-jp-backend` に変更
- [ ] 「Save」ボタンをクリック
- [ ] 緑色の成功通知が表示された
- [ ] Deploymentsタブに移動
- [ ] 最新のデプロイの「...」メニューをクリック
- [ ] 「Redeploy」を選択
- [ ] 「Use existing Build Cache」のチェックを**外した**
- [ ] 「Redeploy」ボタンをクリック
- [ ] ビルドが完了するまで待機（2-3分）
- [ ] デプロイが「✅ Ready」になった
- [ ] ブラウザで https://frontend-seven-beta-72.vercel.app を開いた
- [ ] 強制リロード（Ctrl+Shift+R）を実行
- [ ] タブのタイトルが「Lingo Keeper JP - 日本語学習アプリ」になった
- [ ] F12 → Console で401エラーが表示されない
- [ ] F12 → Network で `/api/stories` が200 OKを返す
- [ ] Request URLに `lingo-keeper-jp-backend` が含まれている
- [ ] ログインが成功する
- [ ] ストーリーカードが9件表示される

---

## 🆘 トラブルシューティング

### Q1: 環境変数が見つからない

**症状**: 検索しても `VITE_API_URL` が表示されない

**解決方法**:
1. 検索ボックスをクリアして、すべての環境変数を表示
2. スクロールして `VITE_API_URL` を探す
3. 見つからない場合は、新規作成:
   - 「Add New」ボタンをクリック
   - Name: `VITE_API_URL`
   - Value (Production): `https://lingo-keeper-jp-backend-16378814888.asia-northeast1.run.app`
   - Value (Preview): 同じ
   - Value (Development): 同じ
   - 「Save」をクリック

---

### Q2: 再デプロイが失敗する

**症状**: ビルド中にエラーが発生して「❌ Failed」になる

**解決方法**:
1. デプロイをクリック → 「Inspect」をクリック
2. ログを確認してエラー内容を確認
3. 再度「Redeploy」を試す
4. それでも失敗する場合は、GitHub Actionsのログを確認

---

### Q3: タイトルが古いまま

**症状**: 再デプロイしても「Lingo Keeper - English Learning Adventure」のまま

**原因**: ブラウザキャッシュまたはVercelのビルドキャッシュ

**解決方法**:
1. **ブラウザキャッシュのクリア**:
   - Ctrl + Shift + Delete（Windows/Linux）
   - Cmd + Shift + Delete（Mac）
   - 「キャッシュされた画像とファイル」を選択
   - 「データを削除」をクリック

2. **シークレットモードで確認**:
   - Ctrl + Shift + N（Chrome）
   - Ctrl + Shift + P（Firefox）
   - https://frontend-seven-beta-72.vercel.app を開く

3. **再度Redeployを実行**:
   - 今度は確実に「Use existing Build Cache」のチェックを外す

---

### Q4: 401エラーが消えない

**症状**: 環境変数を更新しても401エラーが出続ける

**原因**: 環境変数が反映されていない、または別の問題

**解決方法**:
1. **環境変数の確認**:
   - Vercel Settings → Environment Variables
   - `VITE_API_URL` の値を再確認
   - 3つの環境すべて（Production/Preview/Development）が正しいか確認

2. **再デプロイの確認**:
   - 環境変数更新**後**に再デプロイを実行したか確認
   - 環境変数だけ更新して再デプロイしていない場合、変更は反映されません

3. **キャッシュクリア再デプロイ**:
   - もう一度「Redeploy」を実行
   - 「Use existing Build Cache」を必ずオフにする

4. **ブラウザのハードリロード**:
   - Ctrl + Shift + R（Windows/Linux）
   - Cmd + Shift + R（Mac）

---

### Q5: ストーリーが表示されない

**症状**: ログインはできるが、ストーリーカードが0件

**原因**: API接続の問題またはバックエンドの問題

**解決方法**:
1. **F12 → Network → Fetch/XHR** で `/api/stories` リクエストを確認
2. ステータスコードを確認:
   - **200 OK**: バックエンドは正常、フロントエンドの問題
   - **401 Unauthorized**: 環境変数が反映されていない
   - **404 Not Found**: URLが間違っている
   - **500 Internal Server Error**: バックエンドの問題

3. **バックエンドを直接確認**:
   ```bash
   curl https://lingo-keeper-jp-backend-16378814888.asia-northeast1.run.app/api/health
   ```
   正常なら: `{"success":true,"status":"healthy",...}`

4. **ストーリーAPIを直接確認**:
   ```bash
   curl https://lingo-keeper-jp-backend-16378814888.asia-northeast1.run.app/api/stories
   ```
   正常なら: `{"success":true,"data":[...]}`（9件のストーリー）

---

## 📞 サポート

それでも解決しない場合:
1. Vercelダッシュボードのスクリーンショットを確認
2. ブラウザのコンソールエラーをコピー
3. Network タブの `/api/stories` リクエストの詳細を確認

---

**作成者**: Claude Sonnet 4.5
**最終更新**: 2026-01-25
**バージョン**: 1.0
