import type { NextConfig } from "next";

// Vercel sets VERCEL=1 automatically. Standalone output is only needed for
// the self-hosted sandbox server; Vercel handles its own build & deploy.
const isVercel = !!process.env.VERCEL;

const nextConfig: NextConfig = {
  ...(isVercel ? {} : { output: "standalone" }),
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Allow remote DS3 images (OSS-hosted) to be optimized by next/image if used.
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "sfile.chatglm.cn" },
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
  },
};

export default nextConfig;
