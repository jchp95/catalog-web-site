import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  // Self-contained server bundle (only the files a request actually needs) —
  // keeps the CapRover/Docker production image small and the build copyable
  // in one shot, instead of shipping the full node_modules tree.
  output: "standalone",
};

export default nextConfig;
