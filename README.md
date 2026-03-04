# Trie Bonsai

文字列を入力し、Trie木構造を3D空間に盆栽として可視化するWebアプリケーション。

## 📦 プロジェクト構成

- **フロントエンド**: Next.js + React Three Fiber
- **バックエンド**: Cloudflare Workers + Hono（Phase 6 で基盤構築完了）
- **データベース**: Cloudflare D1（SQLite互換）
- **ストレージ**: Cloudflare R2（S3互換）

## 🚀 ローカル開発環境のセットアップ

### 前提条件

- Node.js 20.x 以上
- npm または yarn
- Git

### フロントエンド（Next.js）の起動

```bash
# リポジトリクローン
git clone <repository-url>
cd triebonsai

# 依存関係インストール
npm install

# 開発サーバー起動
npm run dev
```

フロントエンドは `http://localhost:3000` で起動します。

### バックエンド（Worker）の起動（Phase 6〜）

```bash
# Worker ディレクトリへ移動
cd workers/api

# 依存関係インストール
npm install

# ローカル開発サーバー起動
npm run dev
```

Worker は `http://localhost:8787` で起動します。

#### 環境変数

Worker の本番環境へのデプロイ時は以下の環境変数が必要です（ローカル開発では自動的にモック環境が利用されます）。

- `CLOUDFLARE_ACCOUNT_ID`: Cloudflare アカウントID
- `CLOUDFLARE_D1_DATABASE_ID`: D1 データベースID
- `CLOUDFLARE_API_TOKEN`: Cloudflare API トークン

ローカル開発では `wrangler.toml` にダミーIDが設定済みで、そのまま起動可能です。

## 📖 開発フェーズ

このプロジェクは8フェーズのイテレーション開発で進行中です。詳細は [ロードマップ](docs/Trie-Bonsai.wiki/ロードマップ.md) を参照してください。

- **Phase 1〜5**: フロントエンド実装（完了）
- **Phase 6**: Edge基盤構築（完了） ← 現在ここ
- **Phase 7**: 永続化実装（未着手）
- **Phase 8**: ギャラリー・本番デプロイ（未着手）

## 🛠️ 主要スクリプト

### フロントエンド

- `npm run dev`: 開発サーバー起動
- `npm run build`: 本番ビルド
- `npm run lint`: ESLint 実行

### バックエンド（workers/api）

- `npm run dev`: Wrangler 開発サーバー起動
- `npm run typecheck`: TypeScript 型チェック
- `npm run db:generate`: Drizzle ORM マイグレーション生成
- `npm run deploy`: Cloudflare Workers への本番デプロイ

## 📚 ドキュメント

- [ロードマップ](docs/Trie-Bonsai.wiki/ロードマップ.md)
- [要件定義書](docs/Trie-Bonsai.wiki/要件定義書.md)
- [UML](docs/Trie-Bonsai.wiki/UML.md)

## 🔧 技術スタック

**Frontend**

- Next.js 16
- React Three Fiber
- Zustand（状態管理）
- TailwindCSS

**Backend**

- Cloudflare Workers
- Hono
- Drizzle ORM
- Cloudflare D1 / R2

## ライセンス

このプロジェクトは個人学習・研究用途として開発されています。
