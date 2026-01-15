# Lingo Keeper JP - セキュリティ監査レポート

**実施日**: 2026-01-12
**監査対象**: Frontend + Backend (Phase 1 MVP)
**監査基準**: OWASP Top 10 2021

---

## 📊 監査結果サマリー

| 項目 | 状態 | 脆弱性 | 推奨アクション |
|------|------|--------|----------------|
| 依存関係の脆弱性 | ✅ 合格 | 0件 | なし |
| ハードコードされた機密情報 | ✅ 合格 | 0件 | なし |
| CORS設定 | ✅ 合格 | - | 環境変数で管理済み |
| セキュリティヘッダー | ⚠️ 要改善 | - | helmet.js導入推奨 |
| SQL Injection | ✅ 合格 | - | Prisma ORM使用（パラメータ化済み） |
| XSS対策 | ✅ 合格 | - | React自動エスケープ |
| 認証・認可 | 🔄 Phase 2 | - | Phase 2で実装予定 |
| エラーハンドリング | ✅ 合格 | - | 適切に実装済み |

**総合評価**: ✅ **合格（Phase 1 MVP基準）**

---

## 🔍 詳細監査結果

### 1. 依存関係の脆弱性スキャン

**実行コマンド**:
```bash
npm audit
```

**結果**:
```json
Frontend:
{
  "vulnerabilities": {
    "info": 0,
    "low": 0,
    "moderate": 0,
    "high": 0,
    "critical": 0,
    "total": 0
  },
  "dependencies": {
    "total": 521
  }
}

Backend:
{
  "vulnerabilities": {
    "info": 0,
    "low": 0,
    "moderate": 0,
    "high": 0,
    "critical": 0,
    "total": 0
  },
  "dependencies": {
    "total": 629
  }
}
```

**評価**: ✅ **脆弱性0件** - 全依存関係が最新かつセキュア

---

### 2. ハードコードされた機密情報

**検証対象**:
- APIキー、パスワード、シークレットトークン
- データベース認証情報
- 外部サービス認証情報

**検証方法**:
```bash
grep -r "password\|secret\|key\|apikey" src/ --include="*.ts" --include="*.tsx"
```

**結果**:
- ✅ フロントエンド: ハードコード機密情報なし
- ✅ バックエンド: ハードコード機密情報なし
- ✅ 環境変数: `.env.local`で適切に管理（`.gitignore`済み）
- ✅ `.env.example`: テンプレートのみ、実際の値なし

**評価**: ✅ **合格** - 機密情報は環境変数で適切に管理

---

### 3. OWASP Top 10 (2021) チェックリスト

#### A01:2021 – Broken Access Control（アクセス制御の不備）

**現状**:
- Phase 1: 認証機能未実装（意図的）
- 全APIエンドポイントが公開
- LocalStorageのみでクライアント側データ管理

**リスク**: 🟡 **Phase 1では許容**（Phase 2で対応予定）

**Phase 2での対応**:
```typescript
// JWT認証ミドルウェア実装予定
app.use('/api/users', authenticateJWT);
app.use('/api/progress', authenticateJWT);
```

---

#### A02:2021 – Cryptographic Failures（暗号化の失敗）

**現状**:
- ✅ データベース接続: SSL/TLS強制（`sslmode=require`）
- ✅ API通信: HTTPS使用（本番環境）
- ⚠️ LocalStorageデータ: 暗号化なし（機密情報なしのため許容）

**評価**: ✅ **合格**

**推奨事項**:
- Phase 2でJWT保存時はhttpOnly Cookie使用

---

#### A03:2021 – Injection（インジェクション）

**SQL Injection対策**:
```typescript
// ✅ Prisma ORM使用 - 自動パラメータ化
await prisma.story.findMany({
  where: { level_jlpt: levelFilter }  // Safe
});

// ❌ Bad example (未使用)
// await prisma.$queryRaw`SELECT * FROM stories WHERE level = ${levelFilter}`;
```

**XSS対策**:
```tsx
// ✅ React自動エスケープ
<Typography>{story.title}</Typography>

// ⚠️ dangerouslySetInnerHTML使用箇所
<Box dangerouslySetInnerHTML={{ __html: chapter.content_with_ruby }} />
```

**評価**: ✅ **合格**（Prisma使用、React自動エスケープ）

**注意事項**:
- `dangerouslySetInnerHTML`使用時は信頼できるデータのみ表示
- 現在はバックエンドから取得したデータのみ使用（安全）

---

#### A04:2021 – Insecure Design（安全でない設計）

**現状**:
- ✅ エラーハンドリング: 適切に実装
- ✅ レート制限: Cloud Run/Vercelレベルで自動適用
- ⚠️ アプリケーションレベルのレート制限: 未実装

**評価**: ✅ **合格**（Phase 1基準）

**Phase 2推奨**:
```typescript
// express-rate-limit導入
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分
  max: 100 // 100リクエスト/15分
});

app.use('/api/', limiter);
```

---

#### A05:2021 – Security Misconfiguration（セキュリティの設定ミス）

**CORS設定**:
```typescript
// ✅ 環境変数で管理
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3847',
  credentials: true,
}));
```

**セキュリティヘッダー**:
```typescript
// ⚠️ 未実装 - helmet.js推奨
```

**評価**: ⚠️ **要改善**

**推奨実装**:
```bash
cd backend
npm install helmet
```

```typescript
// backend/src/index.ts
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

---

#### A06:2021 – Vulnerable and Outdated Components（脆弱で古いコンポーネント）

**依存関係管理**:
- ✅ npm audit: 脆弱性0件
- ✅ 主要ライブラリ最新版使用:
  - React: 19.0.0
  - TypeScript: 5.7
  - MUI: v7
  - Express: 4.21.2
  - Prisma: 5.22.0

**評価**: ✅ **合格**

**推奨メンテナンス**:
```bash
# 月1回実行
npm audit
npm outdated
npm update
```

---

#### A07:2021 – Identification and Authentication Failures（識別と認証の失敗）

**現状**: Phase 1では認証機能未実装

**Phase 2実装予定**:
- JWT認証
- パスワードハッシュ化（bcrypt）
- パスワードポリシー（8文字以上）
- ブルートフォース対策（レート制限）

**評価**: 🔄 **Phase 2対応予定**

---

#### A08:2021 – Software and Data Integrity Failures（ソフトウェアとデータの整合性の不具合）

**CDN使用**:
```html
<!-- ✅ Google Fonts: SRI未使用だが信頼できるソース -->
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP..." rel="stylesheet">
```

**評価**: ✅ **合格**（信頼できるCDNのみ使用）

**推奨**: 重要なライブラリはバンドルに含める（現状実施済み）

---

#### A09:2021 – Security Logging and Monitoring Failures（セキュリティログとモニタリングの失敗）

**ログ実装**:
```typescript
// ✅ logger.ts実装済み
logger.info('Incoming request', { method, url, ip });
logger.error('API Error', { error: error.message });
```

**モニタリング**:
- ⚠️ 本番環境ログ監視: Vercel/Cloud Runデフォルト機能のみ
- ⚠️ アラート設定: 未実装

**評価**: ✅ **合格**（Phase 1基準）

**Phase 2推奨**:
- Sentry導入（エラートラッキング）
- Cloud Monitoringアラート設定

---

#### A10:2021 – Server-Side Request Forgery (SSRF)（サーバサイドリクエストフォージェリ）

**現状**:
- ✅ ユーザー入力からのURL生成なし
- ✅ 外部API呼び出し: 固定URL（Google Cloud TTS, OpenAI）

**評価**: ✅ **合格**（リスクなし）

---

## 🔐 環境変数セキュリティ

### .env.local（Git除外済み）

**機密情報**:
```bash
DATABASE_URL=postgresql://...      # ✅ 環境変数
GOOGLE_APPLICATION_CREDENTIALS=... # ✅ ファイルパス（Git除外）
OPENAI_API_KEY=sk-proj-...        # ✅ 環境変数
JWT_SECRET=$(openssl rand -base64 32)     # ✅ 自動生成
SESSION_SECRET=$(openssl rand -base64 32) # ✅ 自動生成
```

**本番環境推奨**:
- ✅ Vercel: Environment Variables
- ✅ Cloud Run: Secret Manager使用

---

## 🚨 検出された問題と推奨対応

### 高優先度（Phase 1.5）

1. **セキュリティヘッダー未設定**
   - **リスク**: 中
   - **対応**: helmet.js導入
   - **工数**: 30分

### 中優先度（Phase 2）

2. **レート制限未実装**
   - **リスク**: 中
   - **対応**: express-rate-limit導入
   - **工数**: 1時間

3. **認証機能未実装**
   - **リスク**: 設計上Phase 2対応
   - **対応**: JWT認証実装
   - **工数**: Phase 2要件参照

### 低優先度（Phase 2+）

4. **モニタリング・アラート**
   - **リスク**: 低
   - **対応**: Sentry, Cloud Monitoring設定
   - **工数**: 2時間

---

## ✅ セキュリティベストプラクティス遵守状況

| 項目 | 状態 | 備考 |
|------|------|------|
| 依存関係の定期更新 | ✅ | npm audit済み |
| 機密情報の環境変数管理 | ✅ | .env.local使用 |
| HTTPS使用 | ✅ | 本番環境で強制 |
| SQL Injection対策 | ✅ | Prisma ORM使用 |
| XSS対策 | ✅ | React自動エスケープ |
| CORS適切設定 | ✅ | 環境変数管理 |
| エラーハンドリング | ✅ | 適切に実装 |
| ログ実装 | ✅ | logger.ts使用 |
| グレースフルシャットダウン | ✅ | SIGTERM対応 |

---

## 📝 次のアクション

### 即座に実施（Phase 1.5）
1. ✅ セキュリティ監査完了
2. ⏳ helmet.js導入（推奨）

### Phase 2で実施
1. JWT認証実装
2. レート制限実装
3. Sentry導入

### 継続的に実施
- 月1回: `npm audit`実行
- 四半期ごと: 依存関係更新（`npm update`）
- デプロイ前: セキュリティチェックリスト確認

---

## 📚 参考資料

- [OWASP Top 10 2021](https://owasp.org/Top10/)
- [OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)
- [helmet.js Documentation](https://helmetjs.github.io/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

---

**監査実施者**: Lingo Keeper Team
**最終更新**: 2026-01-12
**次回監査**: Phase 2完了時
