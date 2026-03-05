/**
 * Phase 6: API接続の境界を定義
 * Worker APIへの実送信
 */

// 本番環境の自動検出（毎回実行）
function getWorkerApiUrl(): string {
    const productionWorkerUrl =
        "https://triebonsai-edge-api-prod.weegieluke.workers.dev";

    // Build-time environment variable takes precedence in all environments.
    const configuredApiUrl = process.env.NEXT_PUBLIC_WORKER_API_URL?.trim();
    if (configuredApiUrl) {
        return configuredApiUrl.replace(/\/$/, "");
    }

    // ブラウザ環境での実行時判定（静的エクスポート対応）
    if (typeof window !== "undefined") {
        const hostname = window.location.hostname;

        // 本番環境の検出
        if (hostname === "trie-bonsai.weegiecat.com") {
            return productionWorkerUrl;
        }

        // プレビュー環境（Cloudflare Pagesのプレビューデプロイ）
        if (hostname.endsWith(".pages.dev")) {
            return productionWorkerUrl;
        }
    }

    // 開発環境のデフォルト
    return "http://localhost:8787";
}

export interface BonsaiSubmitPayload {
    title: string;
    imageDataUrl: string;
    treeData: unknown;
    configData: unknown;
}

export interface BonsaiSubmitResponse {
    success: boolean;
    id?: string;
    url?: string;
    imageUrl?: string;
    error?: string;
}

export interface BonsaiGalleryItem {
    id: string;
    title: string;
    imageUrl: string;
    createdAt: number;
    likes: number;
    treeType?: string;
    nodeGradientPreset?: string;
    inputText?: string;
}

interface BonsaiListResponse {
    success: boolean;
    items?: BonsaiGalleryItem[];
    error?: string;
}

interface BonsaiPostApiResponse {
    success: boolean;
    id?: string;
    imageUrl?: string;
    error?: string;
}

/**
 * 盆栽データをAPIへ送信する
 */
export async function submitBonsai(
    payload: BonsaiSubmitPayload,
): Promise<BonsaiSubmitResponse> {
    try {
        const apiUrl = getWorkerApiUrl();
        const response = await fetch(`${apiUrl}/api/bonsai`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        const data = (await response.json()) as BonsaiPostApiResponse;

        if (!response.ok || !data.success) {
            return {
                success: false,
                error: data.error ?? "投稿に失敗しました",
            };
        }

        return {
            success: true,
            id: data.id,
            imageUrl: data.imageUrl,
            url: "/gallery/",
        };
    } catch (error) {
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : "通信エラーが発生しました",
        };
    }
}

export async function fetchBonsaiList(
    limit = 48,
): Promise<BonsaiGalleryItem[]> {
    const apiUrl = getWorkerApiUrl();
    const response = await fetch(`${apiUrl}/api/bonsai?limit=${limit}`, {
        method: "GET",
        cache: "no-store",
    });

    const data = (await response.json()) as BonsaiListResponse;

    if (!response.ok || !data.success || !data.items) {
        throw new Error(data.error ?? "ギャラリーデータの取得に失敗しました");
    }

    return data.items.map((item) => {
        const legacyPrefix = "/api/bonsai/object/";

        if (item.imageUrl.includes(legacyPrefix)) {
            const key = item.imageUrl.split(legacyPrefix)[1] ?? "";
            return {
                ...item,
                imageUrl: `${apiUrl}/api/bonsai/object?key=${encodeURIComponent(key)}`,
            };
        }

        // R2 カスタムドメイン（DNS未設定）を Worker プロキシに変換
        if (item.imageUrl.startsWith("https://r2.trie-bonsai.weegiecat.com/")) {
            const objectKey = item.imageUrl.replace(
                "https://r2.trie-bonsai.weegiecat.com/",
                "",
            );
            return {
                ...item,
                imageUrl: `${apiUrl}/api/bonsai/object?key=${encodeURIComponent(objectKey)}`,
            };
        }

        const isAbsolute =
            item.imageUrl.startsWith("http://") ||
            item.imageUrl.startsWith("https://");

        if (isAbsolute) {
            return item;
        }

        return {
            ...item,
            imageUrl: `${apiUrl}/api/bonsai/object?key=${encodeURIComponent(item.imageUrl)}`,
        };
    });
}
