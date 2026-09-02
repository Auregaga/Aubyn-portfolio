// 获取 basePath（GitHub Pages 部署时为仓库名，本地开发时为空）
export function getBasePath(): string {
  if (typeof window !== 'undefined') {
    // 客户端：从 Next.js 注入的 __webpack_public_path__ 或直接判断
    return process.env.NEXT_PUBLIC_BASE_PATH || '';
  }
  return process.env.NEXT_PUBLIC_BASE_PATH || '';
}

// 给资源路径加上 basePath
export function withBasePath(path: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || '';
  if (!base) return path;
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('#')) {
    return path;
  }
  if (path.startsWith('/')) {
    return base + path;
  }
  return base + '/' + path;
}
