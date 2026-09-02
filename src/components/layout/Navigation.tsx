'use client';

import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLenis } from './LenisProvider';
import type { NavItem } from '@/src/data/types';

gsap.registerPlugin(ScrollTrigger);

interface NavigationProps {
  items: NavItem[];
}

export default function Navigation({ items }: NavigationProps) {
  const [activeId, setActiveId] = useState(items[0]?.id || '');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pillRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const collapsedLogoRef = useRef<HTMLSpanElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const expandTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isExpandedRef = useRef(false);
  const lenis = useLenis();

  // 检测移动端
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 滚动状态
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer 监听当前激活的 section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: '-40% 0px -50% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [items]);

  // 平滑滚动到目标 section
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    e.stopPropagation();
    const target = document.querySelector(href);
    if (!target) return;

    const rect = target.getBoundingClientRect();
    const targetY = window.scrollY + rect.top - 80;

    if (lenis) {
      lenis.scrollTo(targetY);
    } else {
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    }

    setMobileOpen(false);
    // 桌面端：点击后延时收起胶囊
    if (!isMobile) {
      if (expandTimeoutRef.current) clearTimeout(expandTimeoutRef.current);
      expandTimeoutRef.current = setTimeout(() => collapse(), 800);
    }
  };

  // 展开动画（桌面端）
  const expand = () => {
    if (isExpandedRef.current || isMobile) return;
    isExpandedRef.current = true;

    const pill = pillRef.current;
    const content = contentRef.current;
    const collapsedLogo = collapsedLogoRef.current;
    if (!pill || !content || !collapsedLogo) return;

    gsap.set(content, { opacity: 0, x: -10, display: 'flex' });
    gsap.set(collapsedLogo, { opacity: 1 });

    const contentWidth = content.scrollWidth;
    const expandedWidth = contentWidth + 40; // padding

    const tl = gsap.timeline();

    // 胶囊宽度展开（弹性曲线）
    tl.to(pill, {
      width: expandedWidth,
      duration: 0.55,
      ease: 'elastic.out(1, 0.7)',
    });

    // 收起的 Logo 淡出
    tl.to(
      collapsedLogo,
      {
        opacity: 0,
        duration: 0.2,
        ease: 'power2.out',
      },
      '<0.1'
    );

    // 内容淡入并滑入
    tl.to(
      content,
      {
        opacity: 1,
        x: 0,
        duration: 0.35,
        ease: 'power2.out',
      },
      '<0.05'
    );
  };

  // 收起动画（桌面端）
  const collapse = () => {
    if (!isExpandedRef.current) return;
    isExpandedRef.current = false;

    const pill = pillRef.current;
    const content = contentRef.current;
    const collapsedLogo = collapsedLogoRef.current;
    if (!pill || !content || !collapsedLogo) return;

    const tl = gsap.timeline();

    // 内容淡出滑出
    tl.to(content, {
      opacity: 0,
      x: -8,
      duration: 0.2,
      ease: 'power2.in',
    });

    // 胶囊缩回圆形
    tl.to(
      pill,
      {
        width: 48,
        duration: 0.45,
        ease: 'elastic.out(1, 0.75)',
      },
      '<0.05'
    );

    // 收起 Logo 淡入
    tl.to(
      collapsedLogo,
      {
        opacity: 1,
        duration: 0.25,
        ease: 'power2.out',
      },
      '<0.15'
    );

    // 动画结束后隐藏内容
    tl.call(() => {
      gsap.set(content, { display: 'none' });
    });
  };

  // 鼠标进入展开（桌面端）
  const handlePillEnter = () => {
    if (isMobile) return;
    if (expandTimeoutRef.current) clearTimeout(expandTimeoutRef.current);
    expand();
  };

  // 鼠标离开延时收起（桌面端）
  const handlePillLeave = () => {
    if (isMobile) return;
    if (expandTimeoutRef.current) clearTimeout(expandTimeoutRef.current);
    expandTimeoutRef.current = setTimeout(() => {
      collapse();
    }, 500);
  };

  // 点击胶囊（移动端打开侧边栏）
  const handlePillClick = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    }
  };

  // 移动端菜单动画
  useEffect(() => {
    const menu = mobileMenuRef.current;
    if (!menu) return;

    if (mobileOpen) {
      gsap.to(menu, {
        x: '0%',
        duration: 0.35,
        ease: 'power3.out',
      });
      document.body.style.overflow = 'hidden';
    } else {
      gsap.to(menu, {
        x: '100%',
        duration: 0.3,
        ease: 'power3.in',
      });
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  // 初始化：桌面端设置收起状态
  useEffect(() => {
    const pill = pillRef.current;
    const content = contentRef.current;
    if (!pill || !content) return;

    if (!isMobile) {
      gsap.set(pill, { width: 48 });
      gsap.set(content, { display: 'none', opacity: 0, x: -10 });
    }
  }, [isMobile]);

  // 清理
  useEffect(() => {
    return () => {
      if (expandTimeoutRef.current) clearTimeout(expandTimeoutRef.current);
    };
  }, []);

  return (
    <>
      <nav className="fixed top-4 left-0 right-0 z-50 flex justify-center pointer-events-none">
        {/* 灵动岛胶囊 */}
        <div
          ref={pillRef}
          onMouseEnter={handlePillEnter}
          onMouseLeave={handlePillLeave}
          onClick={handlePillClick}
          className={`pointer-events-auto relative overflow-hidden cursor-pointer
            h-11 md:h-12 flex items-center justify-center
            bg-black/[0.78] backdrop-blur-xl
            shadow-[0_8px_30px_rgba(0,0,0,0.25)]
            border border-white/[0.08]
            rounded-full
            ${scrolled ? 'scale-[0.95]' : ''}
            transition-transform duration-300 ease-out
          `}
          style={{ width: isMobile ? '44px' : undefined }}
        >
          {/* 顶部内发光 */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full">
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>

          {/* 收起状态：A */}
          <span
            ref={collapsedLogoRef}
            className="relative z-10 font-bold text-[13px] tracking-tight text-white/90 font-[Noto Sans CJK SC,system-ui,sans-serif] md:block"
            style={{ display: isMobile ? 'block' : undefined }}
          >
            A
          </span>

          {/* 展开状态内容 - 仅桌面端 */}
          <div
            ref={contentRef}
            className="relative z-10 items-center gap-4 px-5 py-2.5 hidden md:flex"
            style={{ display: 'none' }}
          >
            {/* Logo */}
            <a
              href="#hero"
              onClick={(e) => handleNavClick(e, '#hero')}
              className="font-bold text-[14px] tracking-tight text-white/90 hover:text-white transition-colors whitespace-nowrap font-[Noto Sans CJK SC,system-ui,sans-serif]"
            >
              AUBYN
            </a>

            {/* 分隔线 */}
            <span className="w-px h-4 bg-white/15" />

            {/* 导航链接 */}
            <div className="flex items-center gap-1">
              {items.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`px-3 py-1.5 text-[12.5px] rounded-full transition-all duration-300 whitespace-nowrap font-[Noto Sans CJK SC,system-ui,sans-serif] ${
                    activeId === item.id
                      ? 'text-white bg-white/[0.15]'
                      : 'text-white/60 hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* 移动端侧边栏 */}
      <div
        ref={mobileMenuRef}
        className="fixed top-0 right-0 bottom-0 w-[75%] max-w-[320px] bg-white z-[60] translate-x-full
          md:hidden shadow-[-10px_0_40px_rgba(0,0,0,0.1)]"
      >
        <div className="p-6 pt-20">
          <div className="space-y-1">
            {items.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className={`block py-3 px-4 text-[16px] rounded-xl transition-colors font-[Noto Sans CJK SC,system-ui,sans-serif] ${
                  activeId === item.id
                    ? 'text-black font-medium bg-black/[0.04]'
                    : 'text-[#555555] hover:text-black hover:bg-black/[0.02]'
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* 移动端遮罩 */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-[55] md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </>
  );
}
