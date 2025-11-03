import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Optimize package imports for faster builds
  experimental: {
    optimizePackageImports: ['wagmi', 'viem', '@tanstack/react-query'],
  },
};

export default nextConfig;
