# データベースバックアップ・リストア手順

**作成日**: 2026-01-16
**データベース**: Neon PostgreSQL
**プロジェクト**: Lingo Keeper JP

---

## 📋 概要

本ドキュメントは、Neon PostgreSQLデータベースのバックアップとリストア手順を記載しています。

### バックアップ戦略

1. **自動バックアップ**: Neon の自動バックアップ機能（デフォルト有効）
2. **手動バックアップ**: 重要な変更前の手動スナップショット
3. **エクスポートバックアップ**: ローカルファイルとしての保存

---

## 🔄 Neon自動バックアップ

### 自動バックアップ機能

Neonは**デフォルトで自動バックアップ**を提供しています：

- **頻度**: 毎日自動実行
- **保持期間**:
  - Free Tier: 7日間
  - Pro Tier: 30日間
  - Enterprise: カスタマイズ可能
- **ポイントインタイムリカバリ（PITR）**: 過去の任意の時点に復元可能

### 自動バックアップの確認方法

#### 1. Neon Consoleで確認

```
1. Neon Console（https://console.neon.tech/）にログイン
2. プロジェクト "lingo-keeper" を選択
3. 左メニューから "Branches" を選択
4. "main" ブランチを選択
5. "Restore" タブで過去のバックアップポイントを確認
```

#### 2. Neon CLIで確認

```bash
# Neon CLIインストール（初回のみ）
npm install -g neonctl

# ログイン
neonctl auth

# ブランチ一覧確認
neonctl branches list --project-id lingo-keeper

# バックアップポイント確認
neonctl branches show main --project-id lingo-keeper
```

---

## 💾 手動バックアップ手順

### 方法1: Neonブランチ作成（推奨）

Neonのブランチ機能を使用した最も簡単な方法です。

#### ブランチ作成

```bash
# 現在の状態でブランチ作成
neonctl branches create \
  --project-id lingo-keeper \
  --name "backup-$(date +%Y%m%d-%H%M%S)" \
  --parent main

# 例: backup-20260116-143000
```

#### ブランチ確認

```bash
# ブランチ一覧
neonctl branches list --project-id lingo-keeper

# 特定ブランチの詳細
neonctl branches show backup-20260116-143000 --project-id lingo-keeper
```

#### ブランチからの復元

```bash
# ブランチをmainにマージ（復元）
neonctl branches merge \
  --project-id lingo-keeper \
  --source backup-20260116-143000 \
  --target main
```

---

### 方法2: pg_dump（ローカルファイルバックアップ）

データベース全体をSQLファイルとしてエクスポートします。

#### 前提条件

```bash
# PostgreSQLクライアントツールが必要
# Ubuntu/Debian
sudo apt-get install postgresql-client

# macOS
brew install libpq
```

#### バックアップ実行

```bash
# プロジェクトルートに移動
cd /home/hanakotamio0705/Lingo\ Keeper\ JP

# バックアップディレクトリ作成
mkdir -p backups

# 完全バックアップ（全テーブル）
pg_dump "postgresql://neondb_owner:***@ep-morning-sky-a1dv4mjd-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require" \
  --format=custom \
  --file=backups/lingo_keeper_backup_$(date +%Y%m%d_%H%M%S).dump

# 例: backups/lingo_keeper_backup_20260116_143000.dump
```

#### テキスト形式バックアップ（可読性重視）

```bash
pg_dump "postgresql://..." \
  --format=plain \
  --file=backups/lingo_keeper_backup_$(date +%Y%m%d_%H%M%S).sql
```

#### スキーマのみバックアップ

```bash
pg_dump "postgresql://..." \
  --schema-only \
  --file=backups/lingo_keeper_schema_$(date +%Y%m%d_%H%M%S).sql
```

#### データのみバックアップ

```bash
pg_dump "postgresql://..." \
  --data-only \
  --file=backups/lingo_keeper_data_$(date +%Y%m%d_%H%M%S).sql
```

#### 特定テーブルのみバックアップ

```bash
pg_dump "postgresql://..." \
  --table=stories \
  --table=quizzes \
  --file=backups/lingo_keeper_essential_$(date +%Y%m%d_%H%M%S).dump
```

---

## 🔧 リストア（復元）手順

### 方法1: Neonブランチからの復元

#### ポイントインタイムリカバリ（PITR）

```bash
# 特定の日時に復元
neonctl branches restore main \
  --project-id lingo-keeper \
  --timestamp "2026-01-16T14:30:00Z"
```

#### ブランチからの復元

```bash
# 1. 新しいブランチを作成（安全のため）
neonctl branches create \
  --project-id lingo-keeper \
  --name "restore-temp" \
  --parent backup-20260116-143000

# 2. 接続文字列を取得
neonctl connection-string restore-temp --project-id lingo-keeper

# 3. アプリケーションの接続先を一時的に変更してテスト

# 4. 問題なければmainブランチにマージ
neonctl branches merge \
  --project-id lingo-keeper \
  --source restore-temp \
  --target main
```

---

### 方法2: pg_restoreからの復元

#### 完全復元（データベース全体）

```bash
# 1. データベースをクリア（注意！）
psql "postgresql://..." -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"

# 2. バックアップファイルから復元
pg_restore "postgresql://..." \
  --format=custom \
  --verbose \
  backups/lingo_keeper_backup_20260116_143000.dump
```

#### 特定テーブルのみ復元

```bash
pg_restore "postgresql://..." \
  --format=custom \
  --table=stories \
  backups/lingo_keeper_backup_20260116_143000.dump
```

#### SQLファイルからの復元

```bash
psql "postgresql://..." < backups/lingo_keeper_backup_20260116_143000.sql
```

---

## 🛡️ 災害復旧（DR）手順

### シナリオ1: データ破損・誤削除

**手順**:

1. **即座にバックアップ作成**（現状を保存）
   ```bash
   neonctl branches create --name "emergency-$(date +%Y%m%d-%H%M%S)" --parent main
   ```

2. **最後の正常な状態に復元**
   ```bash
   # 自動バックアップから復元（例: 1時間前）
   neonctl branches restore main --timestamp "$(date -d '1 hour ago' -u +%Y-%m-%dT%H:%M:%SZ)"
   ```

3. **アプリケーション再起動**
   ```bash
   # Cloud Runの場合
   gcloud run services update lingo-keeper-jp-backend --region asia-northeast1
   ```

4. **動作確認**
   ```bash
   curl https://lingo-keeper-jp-backend-xxx.run.app/api/health
   ```

---

### シナリオ2: データベース全体の障害

**手順**:

1. **Neon Consoleで障害確認**
   - https://console.neon.tech/
   - ステータスページ: https://neon.tech/status

2. **最新のpg_dumpバックアップを確認**
   ```bash
   ls -lh backups/ | tail -5
   ```

3. **新しいNeonプロジェクト作成**（必要に応じて）
   ```bash
   neonctl projects create --name "lingo-keeper-recovery"
   ```

4. **バックアップからリストア**
   ```bash
   pg_restore "postgresql://新しいデータベースURL" \
     backups/lingo_keeper_backup_20260116_143000.dump
   ```

5. **アプリケーションの接続先変更**
   - Cloud RunのDATABASE_URL環境変数を更新
   - Vercel環境変数も更新（必要に応じて）

---

## 📅 バックアップスケジュール

### 推奨スケジュール

| タイミング | バックアップ方法 | 保持期間 |
|-----------|----------------|---------|
| **毎日** | Neon自動バックアップ | 7日間（Free Tier） |
| **毎週日曜日** | pg_dump（完全バックアップ） | 4週間 |
| **重要変更前** | Neonブランチ作成 | 変更完了まで |
| **本番デプロイ前** | pg_dump + Neonブランチ | 2週間 |

### 自動化スクリプト

#### 週次バックアップスクリプト

```bash
#!/bin/bash
# ファイル名: scripts/weekly-backup.sh

set -e

# 設定
PROJECT_ROOT="/home/hanakotamio0705/Lingo Keeper JP"
BACKUP_DIR="$PROJECT_ROOT/backups"
DATABASE_URL="postgresql://..."
RETENTION_DAYS=28

# バックアップディレクトリ作成
mkdir -p "$BACKUP_DIR"

# バックアップファイル名
BACKUP_FILE="$BACKUP_DIR/lingo_keeper_weekly_$(date +%Y%m%d_%H%M%S).dump"

# バックアップ実行
echo "[$(date)] Starting weekly backup..."
pg_dump "$DATABASE_URL" --format=custom --file="$BACKUP_FILE"

# バックアップ成功確認
if [ -f "$BACKUP_FILE" ]; then
    SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    echo "[$(date)] Backup completed: $BACKUP_FILE ($SIZE)"
else
    echo "[$(date)] ERROR: Backup failed!"
    exit 1
fi

# 古いバックアップを削除（28日以上前）
echo "[$(date)] Cleaning up old backups..."
find "$BACKUP_DIR" -name "lingo_keeper_weekly_*.dump" -mtime +$RETENTION_DAYS -delete

echo "[$(date)] Weekly backup process completed."
```

#### 実行権限付与

```bash
chmod +x scripts/weekly-backup.sh
```

#### Cronで自動実行（毎週日曜日2:00 AM）

```bash
# Crontab編集
crontab -e

# 以下を追加
0 2 * * 0 /home/hanakotamio0705/Lingo\ Keeper\ JP/scripts/weekly-backup.sh >> /home/hanakotamio0705/Lingo\ Keeper\ JP/backups/backup.log 2>&1
```

---

## 🧪 バックアップテスト

### 月次リストアテスト

**目的**: バックアップが正常に復元できることを確認

**手順**:

1. **テスト用ブランチ作成**
   ```bash
   neonctl branches create --name "restore-test" --parent main
   ```

2. **最新バックアップファイルを取得**
   ```bash
   LATEST_BACKUP=$(ls -t backups/*.dump | head -1)
   echo "Testing backup: $LATEST_BACKUP"
   ```

3. **テスト用データベースにリストア**
   ```bash
   TEST_DB_URL=$(neonctl connection-string restore-test)
   pg_restore "$TEST_DB_URL" "$LATEST_BACKUP"
   ```

4. **データ整合性確認**
   ```bash
   psql "$TEST_DB_URL" -c "SELECT COUNT(*) FROM stories;"
   psql "$TEST_DB_URL" -c "SELECT COUNT(*) FROM quizzes;"
   ```

5. **テストブランチ削除**
   ```bash
   neonctl branches delete restore-test --project-id lingo-keeper
   ```

6. **結果記録**
   ```bash
   echo "[$(date)] Restore test completed successfully" >> backups/test.log
   ```

---

## 📊 バックアップ監視

### バックアップファイルサイズ監視

```bash
# バックアップディレクトリサイズ確認
du -sh backups/

# 最新バックアップファイル情報
ls -lh backups/ | tail -1
```

### Neonストレージ使用量確認

```bash
# Neon Consoleで確認
# https://console.neon.tech/ > Settings > Usage
```

---

## 🚨 トラブルシューティング

### 問題1: pg_dumpが遅い

**原因**: 大量のデータ

**解決策**:
```bash
# 並列処理を有効化（複数ジョブで高速化）
pg_dump "$DATABASE_URL" \
  --format=directory \
  --jobs=4 \
  --file=backups/lingo_keeper_parallel
```

### 問題2: バックアップファイルが大きすぎる

**解決策**:
```bash
# 圧縮バックアップ
pg_dump "$DATABASE_URL" \
  --format=custom \
  --compress=9 \
  --file=backups/lingo_keeper_compressed.dump
```

### 問題3: リストアが失敗する

**解決策**:
```bash
# エラーを無視してリストア続行
pg_restore "$DATABASE_URL" \
  --no-owner \
  --no-privileges \
  --single-transaction \
  backups/lingo_keeper_backup.dump
```

---

## 📚 参考資料

- [Neon公式ドキュメント - Branching](https://neon.tech/docs/guides/branching)
- [Neon公式ドキュメント - Backup and Restore](https://neon.tech/docs/manage/backups)
- [PostgreSQL公式ドキュメント - pg_dump](https://www.postgresql.org/docs/current/app-pgdump.html)
- [PostgreSQL公式ドキュメント - pg_restore](https://www.postgresql.org/docs/current/app-pgrestore.html)

---

**作成日**: 2026-01-16
**次回レビュー日**: 2026-02-16（1ヶ月後）
**担当**: DevOps Team
