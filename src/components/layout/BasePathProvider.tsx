'use client';

import { createContext, useContext } from 'react';

const BasePathContext = createContext<string>('');

export function BasePathProvider({
  children,
  basePath,
}: {
  children: React.ReactNode;
  basePath: string;
}) {
  return (
    <BasePathContext.Provider value={basePath}>
      {children}
    </BasePathContext.Provider>
  );
}

export function useBasePath(): string {
  return useContext(BasePathContext);
}

// 便捷函数：给路径加上 basePath
export function usePathWithBase(path: string): string {
  const basePath = useContext(BasePathContext);
  if (!basePath) return path;
  if (/^(https?:)?\/\//.test(path) || path.startsWith('#') || path.startsWith('mailto:') || path.startsWith('tel:')) {
    return path;
  }
  if (path.startsWith('/')) {
    return basePath + path;
  }
  return basePath + '/' + path;
}
