'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { LifePost } from '@/src/data/types';

gsap.registerPlugin(ScrollTrigger);

interface LifeSectionProps {
  posts: LifePost[];
}

export default function LifeSection({ posts }: LifeSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.xhs-card');
      gsap.from(cards, {
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.06,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.xhs-grid',
          start: 'top 80%',
          once: true,
        },
      });

      // 兜底：如果已经在视口里了，立即播放
      const grid = document.querySelector('.xhs-grid');
      if (grid) {
        const rect = grid.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8) {
          gsap.to(cards, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.06,
            ease: 'power2.out',
          });
        }
      }
    }, sectionRef);

    // 兜底定时器
    const fallback = setTimeout(() => {
      gsap.to('.xhs-card', {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: 'power2.out',
      });
    }, 3000);

    return () => {
      ctx.revert();
      clearTimeout(fallback);
    };
  }, [posts.length]);

  return (
    <section
      ref={sectionRef}
      id="life"
      className="w-full py-24 md:py-32 bg-[#fafafa] relative"
    >
      <div className="max-w-[960px] mx-auto px-3 md:px-4">
        {/* 标题区 */}
        <div className="text-center mb-10 md:mb-14">
          <p className="text-[12px] md:text-[13px] text-[#999] tracking-[0.2em] uppercase mb-3 font-[Noto Sans CJK SC,system-ui,sans-serif]">
            Life &amp; Travel
          </p>
          <h2 className="text-[28px] md:text-[36px] font-bold text-[#222] font-[Noto Sans CJK SC,system-ui,sans-serif]">
            生活手记
          </h2>
          <p className="text-[13px] md:text-[14px] text-[#999] mt-3 font-[Noto Sans CJK SC,system-ui,sans-serif]">
            记录路上的风景与日常的温度
          </p>
        </div>

        {/* 瀑布流网格 — 小红书风格 */}
        <div className="xhs-grid columns-2 md:columns-3 gap-3 md:gap-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="xhs-card break-inside-avoid mb-3 md:mb-4 bg-white rounded-[8px] overflow-hidden
                shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.08)]
                transition-all duration-300 cursor-pointer group"
            >
              {/* 图片区 */}
              <div className="relative w-full overflow-hidden bg-[#f0f0f0]">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-auto object-cover block group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                  loading="lazy"
                />
              </div>

              {/* 文字区 — 白框增宽，减少左右内边距 */}
              <div className="px-2.5 py-2.5 md:px-3 md:py-3">
                {/* 标题 — 两行截断 */}
                <p
                  className="text-[13px] md:text-[13.5px] leading-[1.45] text-[#222]
                    line-clamp-2 mb-2.5
                    font-[Noto Sans CJK SC,system-ui,sans-serif]"
                  style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {post.title}
                </p>

                {/* 作者信息 — 不遮挡头像和用户名 */}
                <div className="flex items-center gap-1.5">
                  <img
                    src={post.avatar}
                    alt={post.author}
                    className="w-[18px] h-[18px] md:w-[20px] md:h-[20px] rounded-full object-cover flex-shrink-0"
                  />
                  <span
                    className="text-[11px] md:text-[12px] text-[#999] truncate
                      font-[Noto Sans CJK SC,system-ui,sans-serif]"
                  >
                    {post.author}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
