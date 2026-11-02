import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // GitHub Pages에 올릴 수 있도록 정적 파일(out 폴더)로 빌드합니다.
  output: "export",
  images: {
    unoptimized: true,
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
