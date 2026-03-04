/**
 * Phase 6: API接続の境界を定義
 * Phase 7で実装予定: Worker APIへの実送信
 */

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
    error?: string;
}

/**
 * 盆栽データをAPIへ送信する（Phase 7で実装）
 * 現在はモック実装として即座に成功を返す
 */
export async function submitBonsai(
    payload: BonsaiSubmitPayload,
): Promise<BonsaiSubmitResponse> {
    // Phase 7実装予定: fetch('WORKER_API_URL/api/bonsai', { method: 'POST', body: JSON.stringify(payload) })

    console.log("[Phase 6] submitBonsai called with payload:", {
        title: payload.title,
        imageSize: payload.imageDataUrl.length,
        hasTreeData: !!payload.treeData,
        hasConfigData: !!payload.configData,
    });

    // モック成功レスポンス
    return Promise.resolve({
        success: true,
        id: "mock-id",
        url: "/gallery",
    });
}
