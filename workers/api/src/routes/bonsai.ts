import { Hono } from "hono";
import type { Env } from "../middleware/cors";

const bonsaiRouter = new Hono<{ Bindings: Env }>();

interface BonsaiPostBody {
    title: string;
    imageDataUrl: string;
    treeData: unknown;
    configData: unknown;
}

function isBonsaiPostBody(value: unknown): value is BonsaiPostBody {
    if (!value || typeof value !== "object") {
        return false;
    }

    const body = value as Record<string, unknown>;

    return (
        typeof body.title === "string" &&
        body.title.trim().length > 0 &&
        typeof body.imageDataUrl === "string" &&
        body.imageDataUrl.startsWith("data:image/") &&
        Object.prototype.hasOwnProperty.call(body, "treeData") &&
        Object.prototype.hasOwnProperty.call(body, "configData")
    );
}

function decodeDataUrl(imageDataUrl: string): {
    bytes: Uint8Array;
    mimeType: string;
} {
    const match = imageDataUrl.match(
        /^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/,
    );

    if (!match) {
        throw new Error("Invalid image data URL format");
    }

    const [, mimeType, base64] = match;
    const binary = atob(base64);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));

    return {
        bytes,
        mimeType,
    };
}

function getImageExtension(mimeType: string): string {
    switch (mimeType) {
        case "image/png":
            return "png";
        case "image/jpeg":
            return "jpg";
        case "image/webp":
            return "webp";
        default:
            return "bin";
    }
}

function buildImageUrl(env: Env, objectKey: string): string {
    const baseUrl = env.R2_PUBLIC_BASE_URL?.trim();

    if (!baseUrl) {
        return objectKey;
    }

    return `${baseUrl.replace(/\/$/, "")}/${objectKey}`;
}

async function ensureSchema(db: D1Database) {
    await db
        .prepare(
            `
      CREATE TABLE IF NOT EXISTS bonsais (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        image_url TEXT NOT NULL,
        tree_data TEXT NOT NULL,
        config_data TEXT NOT NULL,
        created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000)
      )
      `,
        )
        .run();
}

bonsaiRouter.post("/", async (c) => {
    try {
        const body = await c.req.json();

        if (!isBonsaiPostBody(body)) {
            return c.json(
                {
                    success: false,
                    error: "Invalid request payload",
                },
                400,
            );
        }

        const { title, imageDataUrl, treeData, configData } = body;
        const { bytes, mimeType } = decodeDataUrl(imageDataUrl);

        if (bytes.byteLength === 0) {
            return c.json(
                {
                    success: false,
                    error: "Image payload is empty",
                },
                400,
            );
        }

        const id = crypto.randomUUID();
        const extension = getImageExtension(mimeType);
        const objectKey = `bonsai/${id}.${extension}`;
        const imageUrl = buildImageUrl(c.env, objectKey);

        const r2Object = await c.env.BONSAI_BUCKET.put(objectKey, bytes, {
            httpMetadata: {
                contentType: mimeType,
            },
        });

        if (!r2Object) {
            return c.json(
                {
                    success: false,
                    error: "Failed to upload image to R2",
                },
                500,
            );
        }

        try {
            await ensureSchema(c.env.DB);

            await c.env.DB.prepare(
                `
          INSERT INTO bonsais (id, title, image_url, tree_data, config_data)
          VALUES (?1, ?2, ?3, ?4, ?5)
          `,
            )
                .bind(
                    id,
                    title.trim(),
                    imageUrl,
                    JSON.stringify(treeData),
                    JSON.stringify(configData),
                )
                .run();
        } catch (dbError) {
            await c.env.BONSAI_BUCKET.delete(objectKey);
            throw dbError;
        }

        return c.json(
            {
                success: true,
                id,
                imageUrl,
            },
            201,
        );
    } catch (error) {
        if (error instanceof SyntaxError) {
            return c.json(
                {
                    success: false,
                    error: "Invalid JSON payload",
                },
                400,
            );
        }

        const message =
            error instanceof Error ? error.message : "Unexpected server error";

        return c.json(
            {
                success: false,
                error: message,
            },
            500,
        );
    }
});

export default bonsaiRouter;
