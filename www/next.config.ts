import type { NextConfig } from "next";
import "./env";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "picsum.photos",
            },
        ],
    },
    experimental: {
        authInterrupts: true,
    },
};

export default nextConfig;
