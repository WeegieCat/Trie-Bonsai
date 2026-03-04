import { Context, Next } from "hono";

export interface Env {
    DB: D1Database;
    BONSAI_BUCKET: R2Bucket;
    CORS_ORIGIN: string;
    R2_PUBLIC_BASE_URL?: string;
}

export async function corsMiddleware(
    c: Context<{ Bindings: Env }>,
    next: Next,
) {
    c.header("Access-Control-Allow-Origin", c.env.CORS_ORIGIN || "*");
    c.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    c.header("Access-Control-Allow-Headers", "Content-Type");

    if (c.req.method === "OPTIONS") {
        return c.body(null, 204);
    }

    await next();
}
