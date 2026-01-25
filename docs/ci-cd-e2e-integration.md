# CI/CD E2Eテスト統合ドキュメント

**作成日**: 2026-01-25
**対象プロジェクト**: Lingo Keeper JP
**実装バージョン**: v1.0

---

## 📋 概要

このドキュメントは、Vercel + GitHub Actionsによる自動E2Eテスト統合の実装内容と運用手順をまとめたものです。2026年のベストプラクティスに基づき、以下の機能を実装しました：

1. **Preview Deployment自動テスト**: PR作成時にVercel PreviewデプロイメントでE2Eテストを自動実行
2. **Production Smoke Tests**: 本番デプロイ後にクリティカルパステストを自動実行
3. **Slack通知**: テスト失敗時に即座にSlackへ通知

---

## 🗂️ 実装ファイル

### 1. Preview Deployment自動テスト

**ファイル**: `.github/workflows/e2e-preview.yml`

**トリガー**:
- Vercel Deploymentの`deployment_status`イベント
- Preview環境のデプロイ成功時

**実行内容**:
1. Vercel Preview URLを取得
2. デプロイメント完全準備まで待機（最大5分）
3. 全E2Eテスト実行（44テスト、Chromiumのみ）
4. テストレポート生成・アップロード（7日間保持）
5. 失敗時にSlack通知

**実行時間**: 約3-5分

### 2. Production Smoke Tests

**ファイル**: `.github/workflows/e2e-production.yml`

**トリガー**:
- Production環境へのデプロイ成功時

**実行内容**:
1. CDN反映待機（60秒）
2. クリティカルパステスト実行（5テスト、高速化）
3. テストレポート生成・アップロード（30日間保持）
4. 失敗時に緊急Slack通知

**実行時間**: 約1-2分

**対象URL**: `https://frontend-seven-beta-72.vercel.app`

### 3. クリティカルパステストファイル

**ファイル**: `frontend/tests/e2e/critical-paths.spec.ts`

**テスト内容**:
- **CP-001**: Login and Dashboard Access（ログイン→ダッシュボード）
- **CP-002**: Story List and Viewing（ストーリー一覧→閲覧）
- **CP-003**: Quiz Access and Answer Submission（クイズアクセス→回答）
- **CP-004**: Story Level Filtering（ストーリーレベルフィルタリング）
- **CP-005**: Story Navigation Back to List（ストーリーから一覧に戻る）

**最適化ポイント**:
- タイムアウト短縮（30秒）
- 不要な待機時間削減
- 本番環境専用設定

---

## ⚙️ セットアップ手順

### 前提条件

- GitHub リポジトリへのアクセス権限（Settings変更可能）
- Vercel アカウントとプロジェクト連携
- Slack ワークスペースとWebhook作成権限

### Step 1: GitHub Secretsの設定

以下の2つのシークレットをGitHub リポジトリに追加してください。

#### 1.1 VERCEL_TOKEN

1. Vercel ダッシュボードにアクセス: https://vercel.com/account/tokens
2. 「Create Token」をクリック
3. Token名: `GitHub Actions E2E Tests`
4. Scope: `Full Account`
5. Expirationを設定（推奨: 1年）
6. 生成されたトークンをコピー

7. GitHubリポジトリ → Settings → Secrets and variables → Actions
8. 「New repository secret」をクリック
9. Name: `VERCEL_TOKEN`
10. Secret: コピーしたトークンを貼り付け
11. 「Add secret」をクリック

#### 1.2 SLACK_WEBHOOK_URL

1. Slack ワークスペースにアクセス
2. Slack API: https://api.slack.com/messaging/webhooks
3. 「Create your Slack app」をクリック
4. 「From scratch」を選択
5. App Name: `E2E Test Alerts`
6. Workspace: 対象ワークスペースを選択
7. 「Incoming Webhooks」を有効化
8. 「Add New Webhook to Workspace」をクリック
9. 通知先チャンネルを選択（例: `#alerts`）
10. Webhook URLをコピー

11. GitHubリポジトリ → Settings → Secrets and variables → Actions
12. 「New repository secret」をクリック
13. Name: `SLACK_WEBHOOK_URL`
14. Secret: コピーしたWebhook URLを貼り付け
15. 「Add secret」をクリック

### Step 2: ワークフローファイルのコミット

実装済みのファイルをリポジトリにコミット・プッシュしてください：

```bash
cd /home/hanakotamio0705/Lingo\ Keeper\ JP

# ステージング
git add .github/workflows/e2e-preview.yml
git add .github/workflows/e2e-production.yml
git add frontend/tests/e2e/critical-paths.spec.ts

# コミット
git commit -m "Add CI/CD E2E test integration with Slack notifications

- Add Preview Deployment automatic E2E tests
- Add Production Smoke Tests for critical paths
- Implement 5 critical path test cases
- Configure Slack notifications on failure

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"

# プッシュ
git push origin main
```

### Step 3: 動作確認

#### 3.1 Preview Deployment テスト

1. 新しいブランチを作成
   ```bash
   git checkout -b test/e2e-integration
   ```

2. 軽微な変更を加える（例: README.mdに1行追加）
   ```bash
   echo "\n## E2E Test Integration" >> README.md
   git add README.md
   git commit -m "test: Verify E2E integration workflow"
   git push origin test/e2e-integration
   ```

3. GitHubでPRを作成

4. GitHub Actions タブで`E2E Tests on Vercel Preview`ワークフローを確認

5. Vercel Deploymentが成功すると自動でテストが実行される

6. テスト結果をActionsページで確認

#### 3.2 Production Smoke Tests

1. mainブランチにマージ

2. Vercel がProductionにデプロイ

3. GitHub Actions タブで`Production E2E Verification`ワークフローを確認

4. 約1-2分でテストが完了

5. Slackチャンネルで通知を確認（失敗時のみ）

---

## 📊 ワークフロー詳細

### Preview Deployment Workflow

```yaml
トリガー:
  - Vercel deployment_status イベント
  - Preview環境のデプロイ成功時

ステップ:
  1. Checkout code (actions/checkout@v4)
  2. Setup Node.js 18 (actions/setup-node@v4)
  3. Install dependencies (npm ci)
  4. Get Vercel preview URL (zentered/vercel-preview-url@v1.1.9)
  5. Wait for deployment ready (UnlyEd/github-action-await-vercel@v1.2.14)
  6. Install Playwright browsers (Chromium)
  7. Run E2E tests (全44テスト)
  8. Upload test reports (7日間保持)
  9. Upload test results JSON (7日間保持)
  10. Slack notification (失敗時のみ)

並列実行: なし（workers: 1）
タイムアウト: 10分
リトライ: なし
```

### Production Smoke Tests Workflow

```yaml
トリガー:
  - Vercel deployment_status イベント
  - Production環境のデプロイ成功時

ステップ:
  1. Checkout code (actions/checkout@v4)
  2. Setup Node.js 18 (actions/setup-node@v4)
  3. Install dependencies (npm ci)
  4. Install Playwright browsers (Chromium)
  5. Wait for CDN propagation (60秒)
  6. Run critical path tests (5テスト)
  7. Upload test reports (30日間保持)
  8. Upload test results JSON (30日間保持)
  9. Slack notification (失敗時のみ)

並列実行: なし（workers: 1）
タイムアウト: 5分
リトライ: 3回（本番環境の一時的なネットワーク問題対応）
```

---

## 🔔 Slack通知の例

### Preview Deployment失敗時

```
🚨 E2E Tests Failed on Preview Deployment

Repository: Lingo Keeper JP (hanakotamio0705/Lingo Keeper JP)
Branch: feature/new-quiz-types
Commit: Add new quiz types (abc1234)

Preview URL: https://frontend-xyz123.vercel.app

View Details: https://github.com/.../actions/runs/123456

Triggered by: @hanakotamio0705
```

### Production Smoke Tests失敗時

```
🚨 URGENT: Production E2E Test Failed!

Critical user journey test failed on production environment.

Production URL: https://frontend-seven-beta-72.vercel.app

View Details: https://github.com/.../actions/runs/123457

Immediate action required!
```

---

## 🛠️ トラブルシューティング

### 問題1: ワークフローがトリガーされない

**症状**: PRを作成してもPreview Deploymentテストが実行されない

**原因と対処**:
1. **Vercel連携未設定**
   - Vercel Dashboard → Settings → Git → GitHub連携を確認
   - リポジトリが正しく連携されているか確認

2. **deployment_statusイベント未発行**
   - Vercel Settings → Git → Enable GitHub Integration
   - Deploy Hooks を確認

3. **VERCEL_TOKEN無効**
   - GitHub Secrets → VERCEL_TOKEN を再生成
   - Vercel Tokenの有効期限を確認

**確認コマンド**:
```bash
# GitHub Actionsログを確認
gh run list --workflow=e2e-preview.yml

# 最新のワークフロー実行を確認
gh run view
```

### 問題2: テストが失敗する

**症状**: Preview/Productionテストが継続的に失敗

**原因と対処**:
1. **タイムアウトエラー**
   - `playwright.config.production.ts` のタイムアウト設定を延長
   - `timeout: 60000` → `timeout: 90000`

2. **セレクタ変更**
   - フロントエンドのUI変更でセレクタが無効化
   - `frontend/tests/e2e/critical-paths.spec.ts` を更新

3. **API応答遅延**
   - Cloud Runのコールドスタート
   - 最小インスタンス数を1に設定（Cloud Run設定）

4. **ネットワーク不安定**
   - リトライ設定を追加（Production Smoke Testsは既に3回リトライ）
   - Preview Deploymentワークフローにもリトライ追加

**デバッグ方法**:
```bash
# ローカルで本番環境テスト実行
cd frontend
npx playwright test --config=playwright.config.production.ts

# 特定のテストのみ実行
npx playwright test tests/e2e/critical-paths.spec.ts

# UI modeでデバッグ
npx playwright test --ui --config=playwright.config.production.ts
```

### 問題3: Slack通知が届かない

**症状**: テスト失敗時にSlack通知が来ない

**原因と対処**:
1. **Webhook URL無効**
   - Slack App Settings → Incoming Webhooks → Webhook URL を確認
   - `curl` コマンドでWebhook URLをテスト:
     ```bash
     curl -X POST -H 'Content-type: application/json' \
       --data '{"text":"Test notification"}' \
       YOUR_WEBHOOK_URL
     ```

2. **GitHub Secrets設定ミス**
   - Settings → Secrets → SLACK_WEBHOOK_URL を確認
   - シークレット名が完全一致しているか確認（大文字小文字区別）

3. **ワークフローの条件分岐**
   - `if: failure()` 条件が正しく動作しているか確認
   - GitHub Actionsログでステップがスキップされていないか確認

**テスト方法**:
```bash
# ワークフローを手動トリガー（失敗を意図的に発生）
gh workflow run e2e-preview.yml
```

### 問題4: Preview URL取得失敗

**症状**: `Get Vercel Preview URL` ステップでエラー

**原因と対処**:
1. **VERCEL_TOKEN権限不足**
   - Vercel Tokenのスコープを`Full Account`に変更

2. **Vercel APIレート制限**
   - 一時的な制限、数分待ってリトライ

3. **デプロイメント未完了**
   - `await-vercel` ステップのタイムアウトを延長（300秒 → 600秒）

**代替方法**:
- `vercel-preview-url` actionの代わりにVercel CLIを使用
- ワークフローファイルを以下のように変更:
  ```yaml
  - name: Get Vercel Preview URL
    id: vercel
    run: |
      URL=$(vercel ls --token ${{ secrets.VERCEL_TOKEN }} | grep "Preview" | awk '{print $2}')
      echo "preview-url=$URL" >> $GITHUB_OUTPUT
  ```

---

## 📈 モニタリングとメトリクス

### GitHub Actions Insights

1. GitHub リポジトリ → Insights → Actions
2. 以下を確認:
   - ワークフロー実行成功率
   - 平均実行時間
   - 失敗原因の分析

### 推奨KPI

```yaml
短期（1-2ヶ月）:
  E2Eテスト成功率: > 95%
  CI/CD実行時間: < 10分
  フレーキーテスト率: < 5%

中期（3-6ヶ月）:
  平均応答時間: < 3秒
  アラート精度: > 90%（誤検知 < 10%）
  PRマージ時間: < 1日
```

### ダッシュボード作成（オプション）

Grafanaを使用したCI/CDダッシュボード:
- GitHub Actions APIからメトリクス取得
- テスト成功率の時系列グラフ
- 失敗テストのTop 10
- 実行時間のトレンド分析

---

## 🚀 次のステップ

### 短期（1-2週間）

1. **合成モニタリング導入**
   - Checklyアカウント作成（無料プラン評価）
   - 5分毎のクリティカルパス監視設定
   - PagerDuty統合（オプション）

2. **テストカバレッジ拡充**
   - 音声認識（STT）機能のテスト追加
   - エラーハンドリングテスト追加
   - パフォーマンステスト追加

3. **並列実行の検討**
   - Sharding機能でテスト実行時間短縮
   - Preview Deploymentで並列実行（workers: 4）

### 中期（1-2ヶ月）

4. **AI駆動テストメンテナンス**
   - Ranger.net等のAIツール評価
   - フレーキーテスト自動検出
   - 修正優先度の自動算出

5. **クロスブラウザテスト**
   - Firefox, WebKitブラウザ追加
   - モバイルビューポートテスト

6. **パフォーマンス監視強化**
   - Lighthouseスコアの継続監視
   - Core Web Vitals追跡

### 長期（Phase 2以降）

7. **本番環境E2Eテスト**
   - テスト専用アカウント機能実装
   - マルチテナンシー対応
   - 本番データとテストデータの分離

8. **包括的監視ダッシュボード**
   - Grafana + Prometheus統合
   - Vercel Analytics統合
   - リアルタイムダッシュボード構築

---

## 📚 参考資料

### 公式ドキュメント
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Vercel Deployment Hooks](https://vercel.com/docs/deployments/deploy-hooks)
- [GitHub Actions for Vercel](https://github.com/marketplace?type=actions&query=vercel)

### 関連ドキュメント（本プロジェクト）
- `CLAUDE.md`: プロジェクト設定・コーディング規約
- `docs/e2e-best-practices.md`: E2Eテストのベストプラクティス
- `frontend/playwright.config.production.ts`: 本番環境Playwright設定
- `E2E_TEST_FINAL_REPORT_2026-01-25.md`: 最新E2Eテスト結果

### ベストプラクティス調査レポート
- DoorDash: 本番環境E2Eテスト実践例
- Visional: E2E自動テスト運用事例
- PayPayカード: 大規模スクラム×E2Eテスト

---

## 🔄 更新履歴

| 日付 | バージョン | 変更内容 |
|------|-----------|---------|
| 2026-01-25 | v1.0 | 初版作成、Preview/Production自動テスト実装 |

---

## 📞 サポート

質問・問題が発生した場合:
1. このドキュメントのトラブルシューティングセクションを確認
2. GitHub Issuesで報告
3. Slack #alerts チャンネルで質問

---

**作成者**: Claude Sonnet 4.5 (E2Eテストオーケストレーター)
**最終更新**: 2026-01-25
**次回レビュー**: Phase 2実装前（認証機能追加時）
