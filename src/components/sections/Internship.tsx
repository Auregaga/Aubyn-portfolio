'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CrossMark from '@/src/components/ui/CrossMark';
import type { Internship } from '@/src/data/types';

gsap.registerPlugin(ScrollTrigger);

interface InternshipSectionProps {
  internships: Internship[];
}

export default function InternshipSection({ internships }: InternshipSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const section = sectionRef.current;

    // 使用 gsap.context 统一管理所有动画，自动清理
    const ctx = gsap.context(() => {
      const titleEl = section.querySelector('.internship-title');
      const dividerEl = section.querySelector('.internship-divider');
      const scrollIndicator = section.querySelector('.internship-scroll-indicator');
      const crossMarks = section.querySelectorAll('.internship-cross-mark');
      const timelineLine = timelineLineRef.current;

      // 标题入场动画
      const entranceTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          end: 'top 30%',
          scrub: 1,
        },
      });

      entranceTl.fromTo(
        titleEl,
        { yPercent: 30, autoAlpha: 0 },
        { yPercent: 0, autoAlpha: 1, ease: 'power2.out' },
        0
      );

      entranceTl.fromTo(
        dividerEl,
        { scaleX: 0, transformOrigin: 'left' },
        { scaleX: 1, ease: 'power2.out' },
        0.2
      );

      entranceTl.fromTo(
        crossMarks,
        { autoAlpha: 0, scale: 0.5 },
        { autoAlpha: 1, scale: 1, stagger: 0.1, ease: 'power2.out' },
        0.2
      );

      entranceTl.fromTo(
        scrollIndicator,
        { autoAlpha: 0, y: -10 },
        { autoAlpha: 1, y: 0, ease: 'power2.out' },
        0.2
      );

      // 时间线绘制动画
      if (timelineLine) {
        gsap.fromTo(
          timelineLine,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            transformOrigin: 'top center',
            scrollTrigger: {
              trigger: '.timeline-container',
              start: 'top 70%',
              end: 'bottom 30%',
              scrub: 1,
            },
          }
        );
      }

      // 每个时间轴节点动画
      const items = section.querySelectorAll('.timeline-item');
      items.forEach((item, index) => {
        const dotRing = item.querySelector('.timeline-dot-ring');
        const dotFill = item.querySelector('.timeline-dot-fill');
        const contentLeft = item.querySelector('.timeline-content-left');
        const contentRight = item.querySelector('.timeline-content-right');
        const dateLabel = item.querySelector('.timeline-date');

        const isLeft = index % 2 === 0;

        // 节点点亮动画
        gsap.fromTo(
          dotRing,
          { scale: 0.5, autoAlpha: 0 },
          {
            scale: 1,
            autoAlpha: 1,
            duration: 0.4,
            ease: 'back.out(2)',
            scrollTrigger: {
              trigger: item,
              start: 'top 70%',
              end: 'top 45%',
              scrub: false,
              once: true,
            },
          }
        );

        gsap.fromTo(
          dotFill,
          { scale: 0 },
          {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 60%',
              end: 'top 40%',
              scrub: false,
              once: true,
            },
          }
        );

        // 内容卡片滑入
        const contentEl = isLeft ? contentLeft : contentRight;
        const xOffset = isLeft ? -40 : 40;

        if (contentEl) {
          gsap.fromTo(
            contentEl,
            { x: xOffset, autoAlpha: 0 },
            {
              x: 0,
              autoAlpha: 1,
              duration: 0.8,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: item,
                start: 'top 65%',
                end: 'top 40%',
                scrub: false,
                once: true,
              },
            }
          );
        }

        // 日期标签
        if (dateLabel) {
          gsap.fromTo(
            dateLabel,
            { y: 20, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.6,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: item,
                start: 'top 60%',
                end: 'top 40%',
                scrub: false,
                once: true,
              },
            }
          );
        }
      });
    }, section);

    return () => {
      ctx.revert();
    };
  }, [internships]);

  return (
    <section
      id="internship"
      ref={sectionRef}
      className="relative bg-[#f0f0f0] text-black overflow-hidden"
    >
      {/* Sticky 标题区域 */}
      <div className="sticky top-0 z-20 bg-[#f0f0f0]">
        <div className="relative h-[40vh] flex flex-col">
          <div className="internship-cross-mark">
            <CrossMark position="top-left" color="#000" />
          </div>
          <div className="internship-cross-mark">
            <CrossMark position="top-right" color="#000" />
          </div>

          <div className="internship-scroll-indicator absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center z-10">
            <div className="w-px h-16 bg-black" />
            <div className="w-1 h-1 bg-black" />
          </div>

          <div className="flex-1 flex flex-col items-center justify-center">
            <h2
              className="internship-title font-black tracking-tight text-center leading-none text-black"
              style={{ fontSize: 'clamp(60px, 10vw, 120px)' }}
            >
              WORK
            </h2>
          </div>

          <div className="internship-divider w-full h-px bg-black origin-left" />
        </div>
      </div>

      {/* 时间轴区域 */}
      <div className="timeline-container relative py-20">
        {/* 中央时间轴线 */}
        <div
          ref={timelineLineRef}
          className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-black z-10 origin-top pointer-events-none"
          style={{ transformOrigin: 'top center' }}
        />

        {/* 时间轴条目 */}
        <div className="relative">
          {internships.map((item, index) => {
            const isLeft = index % 2 === 0;
            return (
              <div
                key={item.id}
                className="timeline-item relative min-h-[85vh] flex items-center py-16"
              >
                {/* 中心节点 */}
                <div className="absolute left-1/2 -translate-x-1/2 z-20">
                  <div className="relative w-5 h-5">
                    <div className="timeline-dot-ring absolute inset-0 rounded-full border-2 border-black bg-[#f0f0f0]" />
                    <div
                      className="timeline-dot-fill absolute inset-[3px] rounded-full bg-black"
                      style={{ transformOrigin: 'center' }}
                    />
                  </div>
                </div>

                {/* 左侧内容（偶数索引：左文右图） */}
                {isLeft ? (
                  <div className="timeline-content-left w-1/2 pr-12 flex flex-col items-end text-right">
                    {/* 日期标签 */}
                    <span className="timeline-date font-mono text-[13px] text-[#666] mb-3 tracking-wider">
                      {item.period}
                    </span>
                    {/* 公司名 */}
                    <h3 className="font-black text-[24px] text-black mb-1">
                      {item.company}
                    </h3>
                    {/* 职位 */}
                    <p className="text-[15px] font-semibold text-[#444] mb-5">
                      {item.position}
                    </p>
                    {/* 概述 */}
                    <p className="text-[14px] leading-[1.8] text-black max-w-[440px] mb-5 font-bold">
                      {item.summary}
                    </p>
                    {/* 成就列表 */}
                    <ul className="space-y-3 max-w-[440px]">
                      {item.achievements.map((achievement, i) => (
                        <li
                          key={i}
                          className="text-[13px] leading-[1.7] text-[#222] pl-0"
                        >
                          <span className="font-bold text-black">
                            {achievement.split('：')[0]}：
                          </span>
                          <span className="text-[#333]">
                            {achievement.split('：').slice(1).join('：')}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="w-1/2" />
                )}

                {/* 右侧图片（偶数索引） */}
                {isLeft ? (
                  <div className="w-1/2 pl-12">
                    <div className="max-w-[460px] bg-white p-3 shadow-md">
                      <img
                        src={item.image}
                        alt={item.company}
                        className="w-full h-auto object-cover"
                        loading="lazy"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="timeline-content-right w-1/2 pl-12">
                    {/* 日期标签 */}
                    <span className="timeline-date font-mono text-[13px] text-[#666] mb-3 tracking-wider block">
                      {item.period}
                    </span>
                    {/* 公司名 */}
                    <h3 className="font-black text-[24px] text-black mb-1">
                      {item.company}
                    </h3>
                    {/* 职位 */}
                    <p className="text-[15px] font-semibold text-[#444] mb-5">
                      {item.position}
                    </p>
                    {/* 概述 */}
                    <p className="text-[14px] leading-[1.8] text-black max-w-[440px] mb-5 font-bold">
                      {item.summary}
                    </p>
                    {/* 成就列表 */}
                    <ul className="space-y-3 max-w-[440px]">
                      {item.achievements.map((achievement, i) => (
                        <li
                          key={i}
                          className="text-[13px] leading-[1.7] text-[#222]"
                        >
                          <span className="font-bold text-black">
                            {achievement.split('：')[0]}：
                          </span>
                          <span className="text-[#333]">
                            {achievement.split('：').slice(1).join('：')}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* 左侧图片（奇数索引：左图右文） */}
                {!isLeft && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1/2 pr-12 flex justify-end">
                    <div className="max-w-[460px] bg-white p-3 shadow-md">
                      <img
                        src={item.image}
                        alt={item.company}
                        className="w-full h-auto object-cover"
                        loading="lazy"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 底部十字标记 */}
        <div className="relative pt-12 pb-8">
          <div className="internship-cross-mark">
            <CrossMark position="bottom-left" color="#000" />
          </div>
          <div className="internship-cross-mark">
            <CrossMark position="bottom-center" color="#000" />
          </div>
          <div className="internship-cross-mark">
            <CrossMark position="bottom-right" color="#000" />
          </div>
        </div>
      </div>
    </section>
  );
}
