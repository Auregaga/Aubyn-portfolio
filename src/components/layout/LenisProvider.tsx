'use client';

import { useEffect, useRef, createContext, useContext, useState } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// GSAP 全局默认配置：统一 easing 与时长，提升整体流畅感
gsap.defaults({
  ease: 'power2.out',
});

// Lenis Context
const LenisContext = createContext<Lenis | null>(null);

export function useLenis() {
  return useContext(LenisContext);
}

interface LenisProviderProps {
  children: React.ReactNode;
}

export function LenisProvider({ children }: LenisProviderProps) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // 检测用户是否开启了减弱动画
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const lenisInstance = new Lenis({
      lerp: prefersReducedMotion ? 1 : 0.08, // 平滑度：值越小越丝滑，0.08 为精致偏快
      smoothWheel: !prefersReducedMotion,
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      infinite: false,
    });

    lenisRef.current = lenisInstance;
    setLenis(lenisInstance);

    // 核心：将 Lenis 滚动同步给 GSAP ScrollTrigger
    lenisInstance.on('scroll', ScrollTrigger.update);

    // 用 GSAP ticker 驱动 Lenis raf，保证两者时间线一致
    const rafCallback = (time: number) => {
      lenisInstance.raf(time * 1000);
    };
    gsap.ticker.add(rafCallback);

    // 关闭 lagSmoothing，确保 Lenis 与 GSAP 时间同步无延迟
    gsap.ticker.lagSmoothing(0);

    // 窗口尺寸变化时刷新 ScrollTrigger
    const handleResize = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      gsap.ticker.remove(rafCallback);
      lenisInstance.destroy();
      lenisRef.current = null;
      setLenis(null);
      // 恢复默认 lagSmoothing
      gsap.ticker.lagSmoothing(500, 1000);
    };
  }, []);

  return (
    <LenisContext.Provider value={lenis}>
      {children}
    </LenisContext.Provider>
  );
}
