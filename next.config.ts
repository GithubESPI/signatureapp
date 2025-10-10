import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['@azure/storage-blob'],
};

export default nextConfig;
