import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['@azure/storage-blob'],
  experimental: {
    optimizeCss: false,
  },
};

export default nextConfig;
