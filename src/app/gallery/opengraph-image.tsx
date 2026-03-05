import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const dynamic = "force-static";
export const alt = "Trie Bonsai Gallery";
export const size = {
    width: 1200,
    height: 630,
};
export const contentType = "image/png";

export default function Image() {
    return new ImageResponse(
        <div
            style={{
                fontSize: 128,
                background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontFamily: "system-ui",
                gap: "20px",
                padding: "40px",
            }}>
            <div
                style={{
                    fontSize: 100,
                }}>
                🌿
            </div>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                }}>
                <div style={{ fontSize: 60, fontWeight: "bold" }}>
                    Trie Bonsai
                </div>
                <div style={{ fontSize: 32, color: "#9ca3af" }}>
                    Gallery - Create & Share 3D Text Trees
                </div>
            </div>
        </div>,
        {
            ...size,
        },
    );
}
