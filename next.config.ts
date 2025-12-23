import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',  // This exports static HTML/JS files
  images: {
    unoptimized: true  // Required for static export
  },
  reactCompiler: true,
  reactStrictMode: true,
};

export default nextConfig;
