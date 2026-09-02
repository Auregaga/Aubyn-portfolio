// src/lib/animations.ts
// Framer Motion 动效配置

import type { Variants, Transition } from 'framer-motion';

/* ---------- 基础过渡配置 ---------- */
export const easeOut: Transition = {
  duration: 0.6,
  ease: 'easeOut',
};

export const easeInOut: Transition = {
  duration: 0.6,
  ease: 'easeInOut',
};

export const spring: Transition = {
  type: 'spring',
  stiffness: 300,
  damping: 30,
};

/* ---------- 入场动画变体 ---------- */

// 淡入上移
export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: easeOut,
  },
};

// 淡入
export const fadeIn: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: easeOut,
  },
};

// 从左侧滑入
export const slideInLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -40,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: easeOut,
  },
};

// 从右侧滑入
export const slideInRight: Variants = {
  hidden: {
    opacity: 0,
    x: 40,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: easeOut,
  },
};

// 缩放进入
export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: easeOut,
  },
};

/* ---------- 容器动画（用于 stagger 子元素） ---------- */
export const staggerContainer = (staggerChildren = 0.1, delayChildren = 0): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

/* ---------- Intersection Observer 配置 ---------- */
export const viewportConfig = {
  once: true,
  margin: '-100px 0px',
  amount: 0.1,
};

/* ---------- 悬停动效 ---------- */
export const hoverScale = {
  scale: 1.02,
  transition: { duration: 0.2, ease: 'easeOut' },
};

export const hoverLift = {
  y: -4,
  transition: { duration: 0.2, ease: 'easeOut' },
};
