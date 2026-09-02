// 统一处理静态资源路径和链接路径
// 适配 GitHub Pages 子路径部署（basePath）

// 判断是否为外部链接
export function isExternalUrl(url: string): boolean {
  return /^(https?:)?\/\//.test(url) || url.startsWith('mailto:') || url.startsWith('tel:');
}

// 给路径加上 basePath 前缀
// 传入 nextConfig.basePath 的值（通过环境变量或 props 传入）
export function addBasePath(path: string, basePath: string = ''): string {
  if (!basePath) return path;
  if (isExternalUrl(path)) return path;
  if (path.startsWith('#')) return path; // 锚点不需要前缀
  if (path.startsWith(basePath + '/')) return path; // 已经加过了
  if (path.startsWith('/')) {
    return basePath + path;
  }
  return basePath + '/' + path;
}

// 处理项目内跳转链接（在新窗口打开内部项目页）
export function openProjectLink(link: string, basePath: string = '') {
  const fullLink = addBasePath(link, basePath);
  window.open(fullLink, '_blank');
}
