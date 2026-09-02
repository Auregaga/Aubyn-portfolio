'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

/**
 * 页面开场过渡动画
 * 黑色遮罩从右向左水平擦除，揭示页面内容
 */
export default function PageTransition() {
  const [isExiting, setIsExiting] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    // 延迟开始擦除动画
    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 300);

    // 动画结束后完全隐藏
    const hideTimer = setTimeout(() => {
      setIsHidden(true);
    }, 1500);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (isHidden) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] bg-[#111111] pointer-events-none"
        initial={{ clipPath: 'inset(0 0 0 0)' }}
        animate={
          isExiting
            ? { clipPath: 'inset(0 100% 0 0)' }
            : { clipPath: 'inset(0 0 0 0)' }
        }
        transition={{
          duration: 0.9,
          ease: [0.76, 0, 0.24, 1],
        }}
      />
    </AnimatePresence>
  );
}
