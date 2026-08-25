import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname, "./"),
  serverExternalPackages: ['@azure/storage-blob'],
  experimental: {
    optimizeCss: false,
  },
};

export default nextConfig;
