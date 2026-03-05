import { Context, Next } from "hono";

export interface Env {
    DB: D1Database;
    BONSAI_BUCKET: R2Bucket;
    CORS_ORIGIN: string;
    R2_PUBLIC_BASE_URL?: string;
}
/**
 * 許可されたオリジンのリスト
 */
const ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://trie-bonsai.weegiecat.com",
    "https://staging.trie-bonsai.weegiecat.com",
];

/**
 * Cloudflare Pagesのプレビューデプロイメントを許可
 * 例: https://abc123.trie-bonsai.pages.dev
 */
function isAllowedOrigin(origin: string | null | undefined, configuredOrigin: string): boolean {
    if (!origin) return false;

    // 設定されたオリジン（環境変数）と一致
    if (origin === configuredOrigin) return true;

    // 許可リストに含まれている
    if (ALLOWED_ORIGINS.includes(origin)) return true;

    // Cloudflare Pagesのプレビューデプロイメント
    if (origin.match(/^https:\/\/[a-z0-9-]+\.trie-bonsai\.pages\.dev$/)) {
        return true;
    }

    return false;
}


export async function corsMiddleware(
    c: Context<{ Bindings: Env }>,
    next: Next,
) {
    const origin = c.req.header("Origin");
    const configuredOrigin = c.env.CORS_ORIGIN || "http://localhost:3000";

    // オリジンが許可されているか確認
    const allowedOrigin = isAllowedOrigin(origin, configuredOrigin)
        ? origin
        : configuredOrigin;

    c.header("Access-Control-Allow-Origin", allowedOrigin);
    c.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    c.header("Access-Control-Allow-Headers", "Content-Type");
    c.header("Access-Control-Max-Age", "86400"); // 24時間キャッシュ

    if (c.req.method === "OPTIONS") {
        return c.body(null, 204);
    }

    await next();
}
