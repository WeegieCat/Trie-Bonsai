/**
 * Phase 6: API接続の境界を定義
 * Worker APIへの実送信
 */

const WORKER_API_BASE_URL =
    process.env.NEXT_PUBLIC_WORKER_API_URL ?? "http://127.0.0.1:8787";

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
        const response = await fetch(`${WORKER_API_BASE_URL}/api/bonsai`, {
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
            url: "/gallery",
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
    const response = await fetch(
        `${WORKER_API_BASE_URL}/api/bonsai?limit=${limit}`,
        {
            method: "GET",
            cache: "no-store",
        },
    );

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
                imageUrl: `${WORKER_API_BASE_URL}/api/bonsai/object?key=${encodeURIComponent(key)}`,
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
            imageUrl: `${WORKER_API_BASE_URL}/api/bonsai/object?key=${encodeURIComponent(item.imageUrl)}`,
        };
    });
}
