import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 支持静态导出
  output: "export",
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
