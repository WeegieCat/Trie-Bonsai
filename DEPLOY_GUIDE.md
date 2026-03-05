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

### 1.2 プロジェクト作成（Cloudflare Pages 統合）

#### Pages プロジェクト

1. Cloudflare Dashboard → Workers & Pages → Create application → Pages → Connect to Git
2. GitHub リポジトリ `WeegieCat/Trie-Bonsai` を接続
3. Build settings を以下で設定

```text
Framework preset: Next.js
Build command: npm run build
Build output directory: .next
Root directory: /
```

4. **Advanced settings で「Git submodules」を OFF** に設定

> `fatal: No url found for submodule path ... in .gitmodules` を回避するため、Pages 側で submodule checkout を無効化します。

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
NEXT_PUBLIC_WORKER_API_URL=https://api.trie-bonsai.weegiecat.com
NEXT_PUBLIC_BASE_URL=https://trie-bonsai.weegiecat.com
```

### 2.2 Workers 環境変数

```bash
# Production
wrangler secret put CORS_ORIGIN --env production
# Input: https://trie-bonsai.weegiecat.com

wrangler secret put R2_PUBLIC_BASE_URL --env production
# Input: https://r2.trie-bonsai.weegiecat.com
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

## Phase 3: カスタムドメイン設定

1. Cloudflare Dashboard → Pages project → Custom domains → Set up a custom domain
2. `trie-bonsai.weegiecat.com` を入力して追加
3. DNS レコードを自動作成（または手動で CNAME 作成）
4. SSL 証明書が `Active` になるまで待機

### 3.1 DNS（手動設定時）

```text
Type: CNAME
Name: trie-bonsai
Target: <your-pages-project>.pages.dev
Proxy status: Proxied
```

### 3.2 ルートドメインの扱い

- `weegiecat.com` / `www.weegiecat.com` は現状維持
- 本アプリは `trie-bonsai.weegiecat.com` のみで公開

---

## Phase 4: デプロイ実行

### 4.1 本番デプロイ

Pages は Git 連携により `deploy` ブランチ push 時に自動ビルドされます。

```bash
# Workers API のみ手動デプロイ
cd workers/api
npm run deploy
```

### 4.2 確認

```bash
# Pages サイド
curl https://trie-bonsai.weegiecat.com

# Workers API
curl https://api.trie-bonsai.weegiecat.com/healthz
```

---

## Phase 5: トラブルシューティング

### Pages ビルドエラー

```bash
# ローカルビルド確認
npm run build

# ビルド設定確認
# Dashboard → Pages → Settings → Build & deployments

# Submodule を無効化
# Dashboard → Pages → Settings → Builds & deployments → Git submodules: OFF
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
