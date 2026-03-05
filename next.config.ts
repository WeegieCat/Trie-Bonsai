import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    reactCompiler: true,
    output: "export",
    trailingSlash: true,
    experimental: {
        // Cloudflare Pages対応
        webpackMemoryOptimizations: true,
    },
};

export default nextConfig;
