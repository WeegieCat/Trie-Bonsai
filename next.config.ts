import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    reactCompiler: true,
    outputFileTracingRoot: undefined,
    experimental: {
        // Cloudflare Pages対応
        webpackMemoryOptimizations: true,
    },
};

export default nextConfig;
