'use client';

import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { LifePost } from '@/src/data/types';

gsap.registerPlugin(ScrollTrigger);

interface LifeSectionProps {
  posts: LifePost[];
}

// 将 posts 平均分配到各列，保持瀑布流高度尽量均匀
function splitIntoColumns(posts: LifePost[], cols: number): LifePost[][] {
  const columns: LifePost[][] = Array.from({ length: cols }, () => []);
  const heights: number[] = Array(cols).fill(0);

  for (const post of posts) {
    const minIdx = heights.indexOf(Math.min(...heights));
    columns[minIdx].push(post);
    heights[minIdx] += 1;
  }

  return columns;
}

export default function LifeSection({ posts }: LifeSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [colCount, setColCount] = useState(2); // 默认 2 列（移动端）

  // 检测窗口宽度决定列数
  useEffect(() => {
    const updateCols = () => {
      if (window.innerWidth >= 1024) {
        setColCount(4);
      } else if (window.innerWidth >= 768) {
        setColCount(3);
      } else {
        setColCount(2);
      }
    };
    updateCols();
    window.addEventListener('resize', updateCols);
    return () => window.removeEventListener('resize', updateCols);
  }, []);

  const columns = splitIntoColumns(posts, colCount);

  useEffect(() => {
    if (!sectionRef.current) return;

    const grid = sectionRef.current.querySelector('.xhs-grid');
    if (!grid) return;

    // 卡片默认就是可见的（CSS 默认 opacity:1）
    // 只有 IntersectionObserver 触发时才做入场动画

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const cards = gsap.utils.toArray('.xhs-card');
          // 先设为透明，再动画淡入
          gsap.set(cards, { opacity: 0, y: 16 });
          gsap.to(cards, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: { each: 0.04, from: 'random' },
            ease: 'power2.out',
          });
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(grid);

    // 兜底：0.8秒后强制设为可见（任何异常都不影响显示）
    const fallback = setTimeout(() => {
      gsap.set('.xhs-card', { opacity: 1, y: 0 });
    }, 800);

    return () => {
      observer.disconnect();
      clearTimeout(fallback);
    };
  }, [posts.length]);

  return (
    <section
      ref={sectionRef}
      id="life"
      className="w-full py-24 md:py-32 bg-[#fafafa] relative"
    >
      <div className="max-w-[1200px] mx-auto px-4 md:px-6">
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

        {/* 瀑布流网格 — 小红书风格，flex 多列布局确保居中 */}
        <div className="xhs-grid flex justify-center gap-4 md:gap-5 lg:gap-6">
          {columns.map((col, colIdx) => (
            <div key={colIdx} className="flex-1 max-w-[300px] flex flex-col gap-4 md:gap-5 lg:gap-6">
              {col.map((post) => (
                <div
                  key={post.id}
                  className="xhs-card bg-white rounded-[8px] overflow-hidden
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

                  {/* 文字区 */}
                  <div className="px-2.5 py-2.5 md:px-3 md:py-3">
                    {/* 标题 — 两行截断 */}
                    <p
                      className="text-[13px] md:text-[13.5px] leading-[1.45] text-[#222]
                        mb-2.5
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

                    {/* 作者信息 */}
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
          ))}
        </div>
      </div>
    </section>
  );
}
