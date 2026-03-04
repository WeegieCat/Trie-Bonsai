# 🚀 Cloudflare Pages/Workers デプロイガイド

## 前提条件

- Cloudflareアカウント
- Wrangler CLI (`npm install -g wrangler`)
- GitHub リポジトリへのアクセス権限

---

## Phase 1: Cloudflare セットアップ

### 1.1 Cloudflare アカウント認証

```bash
wrangler login
```

### 1.2 プロジェクト作成

#### Pages プロジェクト
```bash
# 1. Cloudflare Dashboard で新規プロジェクト作成
cd triebonsai
# または以下で自動作成
wrangler pages project create triebonsai
```

#### Workers (API) プロジェクト
```bash
cd workers/api
wrangler deploy
```

---

## Phase 2: 環境変数・シークレット設定

### 2.1 Pages 環境変数

Cloudflare Dashboard → Pages Project → Settings → Environment variables

```
環境: Production
NEXT_PUBLIC_WORKER_API_URL=https://api.triebonsai.pages.dev
NEXT_PUBLIC_BASE_URL=https://triebonsai.pages.dev
```

### 2.2 Workers 環境変数

```bash
# Production
wrangler secret put CORS_ORIGIN --env production
# Input: https://triebonsai.pages.dev

wrangler secret put R2_PUBLIC_BASE_URL --env production
# Input: https://r2.triebonsai.pages.dev
```

### 2.3 D1・R2 リソース ID 確認

```bash
# D1 一覧
wrangler d1 list

# R2 一覧
wrangler r2 bucket list
```

取得したIDを `workers/api/wrangler.toml` の以下に設定：

```toml
[env.production.d1_databases]
database_id = "YOUR_PROD_DB_ID"

[env.production.r2_buckets]
bucket_name = "YOUR_PROD_BUCKET_NAME"
```

---

## Phase 3: GitHub Actions 自動デプロイ

### 3.1 GitHub Secrets 設定

リポジトリ Settings → Secrets and variables → Actions

```
CLOUDFLARE_API_TOKEN=<your-api-token>
CLOUDFLARE_ACCOUNT_ID=<your-account-id>
CLOUDFLARE_PAGES_PROJECT_NAME=triebonsai
CLOUDFLARE_WORKERS_PROJECT_NAME=triebonsai-edge-api-prod
```

APIトークン取得：
1. Cloudflare Dashboard → My Account → API Tokens
2. Create Token → "Pages" テンプレート使用
3. トークンコピー

### 3.2 GitHub Actions ワークフロー

`.github/workflows/deploy.yml` を作成（参考）

```yaml
name: Deploy to Cloudflare

on:
  push:
    branches: [main, dev]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
      with:
        submodules: 'true'
    
    - uses: actions/setup-node@v4
      with:
        node-version: '20'
    
    # Pages デプロイ
    - name: Deploy to Cloudflare Pages
      env:
        CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
        CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
      run: |
        npm install -g wrangler
        npm ci
        npm run build
        npx wrangler pages deploy dist --project-name=${{ secrets.CLOUDFLARE_PAGES_PROJECT_NAME }} --branch=${{ github.ref_name }}
    
    # Workers デプロイ
    - name: Deploy to Cloudflare Workers
      working-directory: workers/api
      env:
        CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
        CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
      run: |
        npm ci
        npm run build
        npx wrangler deploy --env production
```

---

## Phase 4: デプロイ実行

### 4.1 本番デプロイ

```bash
# フロントエンド
npm run build
npx wrangler pages deploy dist --project-name triebonsai

# API
cd workers/api
npm run build
npx wrangler deploy --env production
```

### 4.2 確認

```bash
# Pages サイド
curl https://triebonsai.pages.dev

# Workers API
curl https://api.triebonsai.pages.dev/healthz
```

---

## Phase 5: DNS・ドメイン設定（オプション）

```bash
# カスタムドメイン設定
# Cloudflare Dashboard → Websites → DNS → Add record
# CNAME triebonsai.pages.dev → xxxxxxxx.pages.dev
```

---

## トラブルシューティング

### Pages ビルドエラー
```bash
# ローカルビルド確認
npm run build

# ビルド設定確認
# Dashboard → Pages → Settings → Build & deployments
```

### Workers デプロイエラー
```bash
# 型チェック
cd workers/api
npm run typecheck

# D1 ID 確認
wrangler d1 list
```

### CORS エラー
```bash
# wrangler.toml の CORS_ORIGIN 確認
# Pages URL と一致しているか確認
```

---

## ロールバック

```bash
# Pages 前バージョンへ
# Dashboard → Pages → Deployments → Rollback

# Workers 前バージョンへ
wrangler rollback --env production
```

---

## 参考リンク

- [Cloudflare Pages ドキュメント](https://developers.cloudflare.com/pages/)
- [Cloudflare Workers ドキュメント](https://developers.cloudflare.com/workers/)
- [Wrangler CLI リファレンス](https://developers.cloudflare.com/workers/wrangler/install-and-update/)
