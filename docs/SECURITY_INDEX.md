# セキュリティドキュメント インデックス

**最終更新日**: 2026-01-25

このドキュメントは、Lingo Keeper JP のセキュリティ関連ドキュメントの索引です。

---

## ドキュメント一覧

### 1. ベストプラクティス（詳細版）

**ファイル**: `/home/hanakotamio0705/Lingo Keeper JP/docs/security-best-practices.md`

**内容**:
- 自動化ツールの詳細（OWASP ZAP、Lighthouse CI、SecurityHeaders.com、SSL Labs）
- セキュリティチェック項目（HTTPS/TLS、セキュリティヘッダー、CORS、入力値検証、認証・認可、データベース）
- 日本企業の基準（ISO27001、サプライチェーンセキュリティ）
- 実装手順（Phase 1-4）
- 継続的な監視
- インシデント対応手順

**対象者**: エンジニア、セキュリティ担当者

**使い方**: 包括的なセキュリティガイドとして参照

---

### 2. クイックスタートガイド

**ファイル**: `/home/hanakotamio0705/Lingo Keeper JP/docs/security-quick-start.md`

**内容**:
- 5分でできる緊急対応
- 30分でできる基本対応
- 1時間でできる自動化セットアップ
- 手動テスト実行方法
- 結果の見方
- トラブルシューティング

**対象者**: 初めてセキュリティチェックを実施する開発者

**使い方**: 今すぐセキュリティチェックを開始する

---

### 3. 実装プラン（現状分析と優先順位）

**ファイル**: `/home/hanakotamio0705/Lingo Keeper JP/docs/security-implementation-plan.md`

**内容**:
- 現状分析（実装済み/未実装の項目）
- 優先順位付きアクションプラン
  - Phase 1: 緊急対応（3日以内）
  - Phase 2: 自動化セットアップ（1週間以内）
  - Phase 3: データベースセキュリティ（1週間以内）
  - Phase 4: 継続的監視（継続）
- 実装チェックリスト
- コスト見積もり

**対象者**: プロジェクトマネージャー、開発リーダー

**使い方**: 実装計画の策定、進捗管理

---

### 4. 自動チェックスクリプト

**ファイル**: `/home/hanakotamio0705/Lingo Keeper JP/scripts/security-check.sh`

**内容**:
- セキュリティヘッダーチェック
- SSL/TLS チェック
- OWASP ZAP スキャン
- Lighthouse CI スキャン
- npm audit 実行
- レポート生成

**対象者**: 開発者、DevOps エンジニア

**使い方**:

```bash
# すべてのチェックを実行
./scripts/security-check.sh --all

# 特定のチェックのみ実行
./scripts/security-check.sh --headers --ssl

# ヘルプ表示
./scripts/security-check.sh
```

---

## クイックリファレンス

### 今すぐセキュリティチェックを実施したい

1. [クイックスタートガイド](/home/hanakotamio0705/Lingo Keeper JP/docs/security-quick-start.md) を開く
2. "5分でできる緊急対応" セクションを実行

または

```bash
# 自動スクリプトを実行
cd /home/hanakotamio0705/Lingo\ Keeper\ JP
./scripts/security-check.sh --headers --ssl
```

---

### セキュリティ実装を計画したい

1. [実装プラン](/home/hanakotamio0705/Lingo Keeper JP/docs/security-implementation-plan.md) を開く
2. "現状分析" セクションで現在の状態を確認
3. "優先順位付きアクションプラン" に従って実装

---

### 自動化を設定したい

1. [ベストプラクティス](/home/hanakotamio0705/Lingo Keeper JP/docs/security-best-practices.md) の "Phase 2: 自動化セットアップ" を参照
2. GitHub Actions ワークフロー作成
3. GitHub Secrets 設定

---

### セキュリティインシデントが発生した

1. [ベストプラクティス](/home/hanakotamio0705/Lingo Keeper JP/docs/security-best-practices.md) の "インシデント対応手順" を参照
2. 初期対応（15分以内）を実施
3. 調査・対応（1時間以内）を実施

---

## 現在の状態（2026-01-25時点）

### ✅ 実装済み

- Helmet.js によるセキュリティヘッダー（バックエンド）
- CORS 設定（バックエンド）
- グレースフルシャットダウン
- ロギング・モニタリング
- Prisma ORM（SQL インジェクション対策）

### ❌ 未実装（優先度順）

#### 🔴 High（今すぐ実装）

1. Vercel セキュリティヘッダー
2. API レート制限
3. Dependabot 設定

#### 🟡 Medium（1週間以内）

4. 自動セキュリティスキャン（GitHub Actions）
5. Lighthouse CI
6. Neon Protected Branches

#### 🟢 Low（1ヶ月以内）

7. Neon IP Allow（Cloud NAT）
8. ISO27001 準拠ドキュメント

---

## 関連ドキュメント

### プロジェクト全体

- [CLAUDE.md](/home/hanakotamio0705/Lingo Keeper JP/CLAUDE.md) - プロジェクト設定・コーディング規約

### セキュリティ

- [security-best-practices.md](/home/hanakotamio0705/Lingo Keeper JP/docs/security-best-practices.md) - 包括的なガイド
- [security-quick-start.md](/home/hanakotamio0705/Lingo Keeper JP/docs/security-quick-start.md) - クイックスタート
- [security-implementation-plan.md](/home/hanakotamio0705/Lingo Keeper JP/docs/security-implementation-plan.md) - 実装プラン

### その他

- [monitoring-architecture.md](/home/hanakotamio0705/Lingo Keeper JP/docs/monitoring-architecture.md) - モニタリング設計
- [backup-system-summary.md](/home/hanakotamio0705/Lingo Keeper JP/docs/backup-system-summary.md) - バックアップ戦略

---

## 外部リンク

### セキュリティツール

- [SecurityHeaders.com](https://securityheaders.com/)
- [SSL Labs Server Test](https://www.ssllabs.com/ssltest/)
- [OWASP ZAP](https://www.zaproxy.org/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [Mozilla Observatory](https://observatory.mozilla.org/)

### 公式ドキュメント

- [Vercel Security Headers](https://vercel.com/docs/headers/security-headers)
- [Google Cloud Run Security](https://docs.cloud.google.com/run/docs/securing/security)
- [Neon Security Overview](https://neon.com/docs/security/security-overview)
- [FastAPI CORS](https://fastapi.tiangolo.com/tutorial/cors/)

### 日本の基準

- [経済産業省: 情報セキュリティ管理基準](https://www.meti.go.jp/policy/netsecurity/is-kansa/IS_Management_Standard_R7.pdf)
- [日本品質保証機構: ISO27001](https://www.jqa.jp/service_list/management/service/iso27001/)

---

**最終更新日**: 2026-01-25
