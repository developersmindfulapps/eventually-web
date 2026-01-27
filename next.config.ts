import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", // optional but recommended
  reactStrictMode: true,
  images: {
    domains: [],
  },
};

export default nextConfig;
