# 本番環境データベース修正手順

**作成日**: 2026-01-24
**緊急度**: 🔴 CRITICAL
**推定時間**: 15-30分

---

## 問題の要約

本番環境が誤ったNeonデータベース (`ep-wandering-bread`) に接続しており、以下の問題が発生：
1. API 500エラー (スキーマ不一致)
2. 英語ストーリーが表示される (日本語であるべき)
3. テーブル・カラムの不足

---

## 修正手順

### ステップ1: `.env.production` ファイルの修正

**ファイル**: `/home/hanakotamio0705/Lingo Keeper JP/.env.production`

**現在の行6を変更**:
```bash
# 誤った値 (削除)
DATABASE_URL=postgresql://neondb_owner:npg_bDu9oz4BJsGp@ep-wandering-bread-a12b5y0c-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# 正しい値 (これに置き換え)
DATABASE_URL=postgresql://neondb_owner:npg_9zkXoHEsC8PQ@ep-morning-sky-a1dv4mjd-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

**コマンド**:
```bash
cd "/home/hanakotamio0705/Lingo Keeper JP"
# バックアップ作成
cp .env.production .env.production.backup

# 正しいDATABASE_URLに置き換え
sed -i '6s|ep-wandering-bread-a12b5y0c|ep-morning-sky-a1dv4mjd|g' .env.production
sed -i '6s|npg_bDu9oz4BJsGp|npg_9zkXoHEsC8PQ|g' .env.production

# 確認
grep "DATABASE_URL" .env.production
```

---

### ステップ2: Cloud Run Secret Manager の更新

**Google Cloud Secret Manager**に保存された `DATABASE_URL` を更新します。

```bash
# 正しいDATABASE_URLを新しいバージョンとして追加
gcloud secrets versions add DATABASE_URL \
  --data-file=<(echo "postgresql://neondb_owner:npg_9zkXoHEsC8PQ@ep-morning-sky-a1dv4mjd-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require")

# 確認 (最新のバージョンが追加されたことを確認)
gcloud secrets versions list DATABASE_URL --limit 3
```

**セキュリティ注意**:
- 上記のコマンドでシークレットが一時的にシェル履歴に残る可能性があります
- より安全な方法: 一時ファイルを使用
  ```bash
  echo "postgresql://neondb_owner:npg_9zkXoHEsC8PQ@ep-morning-sky-a1dv4mjd-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require" > /tmp/db_url.txt
  gcloud secrets versions add DATABASE_URL --data-file=/tmp/db_url.txt
  rm /tmp/db_url.txt
  ```

---

### ステップ3: Cloud Run サービスの再起動

環境変数のキャッシュをクリアするため、Cloud Runサービスを再起動します。

```bash
# 方法1: ダミー環境変数でデプロイ強制更新
gcloud run services update lingo-keeper-jp-backend \
  --region=asia-northeast1 \
  --set-env-vars="CACHE_REFRESH=$(date +%s)"

# 方法2: 新しいリビジョンをデプロイ
gcloud run deploy lingo-keeper-jp-backend \
  --source . \
  --region=asia-northeast1 \
  --allow-unauthenticated
```

**待機時間**: 2-5分（デプロイ完了まで）

---

### ステップ4: 動作確認

#### 4.1 ヘルスチェック
```bash
curl https://lingo-keeper-jp-backend-16378814888.asia-northeast1.run.app/api/health
```

**期待される出力**:
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2026-01-24T...",
  "database": "connected"
}
```

#### 4.2 ストーリーAPI確認
```bash
curl https://lingo-keeper-jp-backend-16378814888.asia-northeast1.run.app/api/stories
```

**期待される出力**:
```json
{
  "success": true,
  "data": [
    {
      "story_id": "story_1",
      "title": "コンビニで買い物",
      "description": "日本のコンビニで買い物をする...",
      "level_jlpt": "N5",
      "level_cefr": "A1"
    },
    ...
  ]
}
```

**確認ポイント**:
- ✅ HTTP 200 OK
- ✅ `success: true`
- ✅ タイトルが日本語 ("コンビニで買い物" など)
- ✅ 500エラーが出ない

#### 4.3 フロントエンドでの確認

ブラウザで https://frontend-seven-beta-72.vercel.app/stories を開き:
- ✅ ストーリーカードが表示される
- ✅ ストーリータイトルが日本語
- ✅ "読み込み中..." で止まらない

---

## トラブルシューティング

### 問題1: まだ500エラーが出る

**原因**: Secret Managerの更新が反映されていない

**解決策**:
```bash
# Cloud Runのログを確認
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=lingo-keeper-jp-backend" \
  --limit 20 \
  --format=json

# サービスを完全に再起動
gcloud run services delete lingo-keeper-jp-backend --region=asia-northeast1 --quiet
gcloud run deploy lingo-keeper-jp-backend --source ./backend --region=asia-northeast1
```

### 問題2: まだ英語ストーリーが表示される

**原因**: まだ古いデータベースに接続している

**確認**:
```bash
# 現在のDATABASE_URLを確認
gcloud secrets versions access latest --secret=DATABASE_URL
```

**解決策**: ステップ2を再実行し、正しいURLが設定されていることを確認

### 問題3: データベース接続エラー

**原因**: DATABASE_URLのタイプミス、またはNeonデータベースがダウン

**確認**:
```bash
# PostgreSQLクライアントで直接接続テスト
psql "postgresql://neondb_owner:npg_9zkXoHEsC8PQ@ep-morning-sky-a1dv4mjd-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require"
```

---

## 修正後の期待される状態

| 項目 | 修正前 | 修正後 |
|------|--------|--------|
| `/api/health` | 200 OK | 200 OK ✅ |
| `/api/stories` | 500 Error ❌ | 200 OK ✅ |
| ストーリー内容 | 英語 ❌ | 日本語 ✅ |
| フロントエンド | 読み込み失敗 ❌ | 正常表示 ✅ |
| E2Eテスト (本番) | N/A | 100% PASS (期待) ✅ |

---

## バックアップとロールバック

### バックアップ
修正前に作成されたバックアップ:
- `.env.production.backup` (ローカル)
- Secret Manager の旧バージョン (Cloud)

### ロールバック手順 (必要な場合)
```bash
# .env.production を戻す
cp .env.production.backup .env.production

# Secret Manager を旧バージョンに戻す
gcloud secrets versions list DATABASE_URL
# 旧バージョン番号を確認して有効化
gcloud secrets versions enable <VERSION_NUMBER> --secret=DATABASE_URL

# Cloud Run を再起動
gcloud run services update lingo-keeper-jp-backend --region=asia-northeast1
```

---

## 完了チェックリスト

- [ ] `.env.production` ファイル修正完了
- [ ] Secret Manager 更新完了
- [ ] Cloud Run 再起動完了
- [ ] `/api/health` 確認 - 200 OK
- [ ] `/api/stories` 確認 - 200 OK, 日本語ストーリー
- [ ] フロントエンド確認 - ストーリーカード表示
- [ ] バックアップ作成完了

---

**修正完了予定時刻**: 実施後 15-30分
**次のステップ**: E2Eテスト再実行、本番環境監視
