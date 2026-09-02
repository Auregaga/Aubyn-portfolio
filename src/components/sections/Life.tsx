'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { LifePost } from '@/src/data/types';

gsap.registerPlugin(ScrollTrigger);

interface LifeProps {
  posts: LifePost[];
}

export default function Life({ posts }: LifeProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !gridRef.current) return;

    const ctx = gsap.context(() => {
      // 标题入场
      gsap.from('.life-title', {
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          once: true,
        },
      });

      if (gridRef.current) {
        const cards = gridRef.current.querySelectorAll('.xhs-card');
        gsap.from(cards, {
          opacity: 0,
          y: 40,
          duration: 0.6,
          stagger: 0.06,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 85%',
            once: true,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="life"
      className="w-full py-20 md:py-28 bg-[#f7f7f7] relative"
    >
      <div className="max-w-[900px] md:max-w-[1000px] lg:max-w-[1100px] xl:max-w-[1200px] mx-auto px-4 md:px-6">
        {/* 标题 */}
        <div className="life-title mb-12 md:mb-16 text-center">
          <p className="text-[13px] text-[#999999] mb-3 font-[Noto Sans CJK SC,system-ui,sans-serif]">
            生活碎片 · LIFE
          </p>
          <h2 className="text-[32px] md:text-[40px] font-bold text-black tracking-tight font-[Noto Sans CJK SC,system-ui,sans-serif]">
            走走停停
          </h2>
        </div>

        {/* 小红书瀑布流 - 居中显示 */}
        <div
          ref={gridRef}
          className="columns-2 md:columns-3 lg:columns-4 gap-3 md:gap-4 mx-auto"
        >
          {posts.map((post) => (
            <div
              key={post.id}
              className="xhs-card break-inside-avoid mb-3 md:mb-4 group cursor-pointer"
            >
              <div className="bg-white rounded-xl overflow-hidden shadow-[0_1px_6px_rgba(0,0,0,0.05)] transition-all duration-400 ease-out group-hover:shadow-[0_6px_20px_rgba(0,0,0,0.1)] group-hover:-translate-y-0.5">
                {/* 图片区域 */}
                <div className="relative w-full overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                    loading="lazy"
                  />
                </div>

                {/* 文字区域 - 白框增宽 */}
                <div className="px-3.5 py-3">
                  {/* 标题 - 两行截断 */}
                  <p className="text-[14px] leading-[1.4] text-[#333333] line-clamp-2 font-[Noto Sans CJK SC,system-ui,sans-serif]">
                    {post.title}
                  </p>
                </div>

                {/* 底部用户信息 */}
                <div className="px-3.5 pb-3 pt-0 flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-[#ff6b6b] to-[#ff8e53] flex items-center justify-center">
                    <span className="text-white text-[10px] font-bold">A</span>
                  </div>
                  <span className="text-[12px] text-[#999999] truncate font-[Noto Sans CJK SC,system-ui,sans-serif]">
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
