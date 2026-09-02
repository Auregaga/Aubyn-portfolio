'use client';

import { motion } from 'framer-motion';

/**
 * 像素风头像 - SVG 实现的 8-bit 风格侧颜
 * 基于视频中的像素艺术风格设计
 */
export default function PixelAvatar() {
  // 像素网格定义：0=透明, 1=深色(头发/轮廓), 2=肤色, 3=浅色(高光), 4=黑色(眼睛/细节)
  // 16x20 像素网格，侧颜朝向左侧
  const pixelGrid = [
    [0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0],
    [0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0],
    [0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
    [1,1,1,1,2,2,2,2,2,1,1,1,1,1,0,0],
    [1,1,2,2,2,2,2,2,2,2,1,1,1,1,0,0],
    [1,2,2,2,2,2,2,2,2,2,2,1,1,1,0,0],
    [1,2,2,2,4,2,2,2,2,2,2,1,1,1,0,0],
    [1,2,2,2,2,2,2,2,2,2,2,2,1,1,0,0],
    [1,2,2,2,2,2,2,2,2,2,2,2,1,1,0,0],
    [1,2,2,2,2,2,2,2,2,2,2,2,1,1,0,0],
    [1,1,2,2,2,2,2,2,2,2,2,1,1,1,0,0],
    [1,1,1,2,2,2,2,2,2,2,1,1,1,1,0,0],
    [0,1,1,1,2,2,2,2,2,1,1,1,1,0,0,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
    [0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
    [0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0],
    [0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0],
    [0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0],
  ];

  const pixelSize = 12;
  const cols = pixelGrid[0].length;
  const rows = pixelGrid.length;

  const colors: Record<number, string> = {
    0: 'transparent',
    1: '#1a1a1a',   // 深色 - 头发/轮廓
    2: '#d4a574',   // 肤色
    3: '#e8c9a0',   // 浅肤色高光
    4: '#111111',   // 黑色 - 眼睛
  };

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <svg
        width={cols * pixelSize}
        height={rows * pixelSize}
        viewBox={`0 0 ${cols * pixelSize} ${rows * pixelSize}`}
        className="w-full h-auto max-w-[400px] lg:max-w-[480px]"
        style={{ imageRendering: 'pixelated' }}
      >
        {pixelGrid.map((row, rowIndex) =>
          row.map((pixel, colIndex) => {
            if (pixel === 0) return null;
            return (
              <rect
                key={`${rowIndex}-${colIndex}`}
                x={colIndex * pixelSize}
                y={rowIndex * pixelSize}
                width={pixelSize}
                height={pixelSize}
                fill={colors[pixel]}
              />
            );
          })
        )}
      </svg>
    </motion.div>
  );
}
