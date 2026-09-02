import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
// GitHub Pages 部署时使用仓库名作为 basePath
const basePath = isProd ? "/Aubyn-portfolio" : "";

const nextConfig: NextConfig = {
  // 支持静态导出
  output: "export",
  // GitHub Pages 项目路径
  basePath,
  // 静态导出时禁用图片优化
  images: {
    unoptimized: true,
  },
  // 尾斜杠（静态导出推荐）
  trailingSlash: true,
  // 开发环境下将 /projects/xxx/ 映射到静态 HTML
  rewrites: async () => {
    return [
      {
        source: "/projects/:path/",
        destination: "/projects/:path/index.html",
      },
    ];
  },
};

export default nextConfig;
