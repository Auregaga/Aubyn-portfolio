'use client';

import { useRef, useEffect, useState } from 'react';
import { renderDitherToCanvas, type DitherOptions } from '@/src/lib/dither';

interface DitherImageProps {
  /** 图片 URL */
  src: string;
  /** 图片 alt 文本 */
  alt?: string;
  /** 容器类名 */
  className?: string;
  /** dither 效果配置 */
  ditherOptions?: DitherOptions;
  /** 过渡时长（秒），默认 0.5 */
  transitionDuration?: number;
}

export default function DitherImage({
  src,
  alt = '',
  className = '',
  ditherOptions = {},
  transitionDuration = 0.5,
}: DitherImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    setIsLoaded(false);

    renderDitherToCanvas(src, canvasRef.current, ditherOptions)
      .then(() => {
        setIsLoaded(true);
      })
      .catch((err) => {
        console.error('Dither render failed:', err);
      });
  }, [src, ditherOptions.matrixSize, ditherOptions.lightColor, ditherOptions.darkColor, ditherOptions.threshold, ditherOptions.scale]);

  return (
    <div
      className={`relative w-full h-full overflow-hidden rounded-[var(--radius-lg)] ${className}`}
    >
      {/* 底层：原始彩色照片 */}
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
      />

      {/* 顶层：dither 点阵效果 canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none object-cover"
        style={{
          opacity: isLoaded ? 1 : 0,
          transition: `opacity ${transitionDuration}s cubic-bezier(0.16, 1, 0.3, 1)`,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '0';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = isLoaded ? '1' : '0';
        }}
      />

      {/* 为了让整个容器都能触发 hover，用透明层捕获鼠标事件 */}
      <div
        className="absolute inset-0 z-10"
        style={{ opacity: 0 }}
        onMouseEnter={() => {
          if (canvasRef.current) {
            canvasRef.current.style.opacity = '0';
          }
        }}
        onMouseLeave={() => {
          if (canvasRef.current) {
            canvasRef.current.style.opacity = isLoaded ? '1' : '0';
          }
        }}
      />
    </div>
  );
}
