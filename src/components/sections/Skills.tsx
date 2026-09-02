'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { SkillCategory } from '@/src/data/types';
import RadarChart from '@/src/components/ui/RadarChart';

gsap.registerPlugin(ScrollTrigger);

interface SkillsProps {
  skills: SkillCategory[];
}

export default function Skills({ skills }: SkillsProps) {
  const [activeTab, setActiveTab] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const tagsContainerRef = useRef<HTMLDivElement>(null);

  // 计算雷达图4维度数据
  const radarDimensions = skills.map((cat) => ({
    key: cat.key,
    label: cat.label,
    value:
      cat.items.reduce((sum, item) => sum + item.level, 0) / cat.items.length,
  }));

  const currentCategory = skills[activeTab];

  // 入场动画
  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.from('.skills-title', {
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

      gsap.from('.skills-tabs', {
        opacity: 0,
        y: 20,
        duration: 0.6,
        delay: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          once: true,
        },
      });

      gsap.from('.skills-radar', {
        opacity: 0,
        scale: 0.9,
        duration: 0.8,
        delay: 0.25,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Tab 切换时标签逐个入场
  useEffect(() => {
    if (!tagsContainerRef.current) return;

    const tags = tagsContainerRef.current.querySelectorAll('.skill-tag');
    gsap.fromTo(
      tags,
      { opacity: 0, y: 12 },
      {
        opacity: 1,
        y: 0,
        duration: 0.35,
        stagger: 0.04,
        ease: 'power2.out',
      }
    );
  }, [activeTab]);

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="w-full py-24 md:py-32 bg-white relative"
    >
      {/* 顶部渐变（Work → Skills：#f0f0f0 → 白） */}
      <div className="absolute top-0 left-0 right-0 h-[80px] bg-gradient-to-b from-[#f0f0f0] to-white pointer-events-none" />
      {/* 底部渐变（Skills → Life：白 → #f7f7f7） */}
      <div className="absolute bottom-0 left-0 right-0 h-[80px] bg-gradient-to-t from-[#f7f7f7] to-white pointer-events-none" />
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 lg:px-0">
        {/* 标题 */}
        <div className="skills-title mb-16 md:mb-20 text-center">
          <p className="font-mono text-[12px] uppercase tracking-[0.25em] text-[#666666] mb-4">
            — SKILLS
          </p>
          <h2 className="font-black text-[48px] md:text-[64px] leading-[1.05] text-black uppercase tracking-tight">
            技能图谱
          </h2>
        </div>

        {/* Tab 栏 */}
        <div className="skills-tabs flex flex-wrap justify-center gap-3 md:gap-4 mb-16">
          {skills.map((cat, index) => (
            <button
              key={cat.key}
              onClick={() => setActiveTab(index)}
              className={`
                group relative px-5 py-2.5 font-mono text-[12px] uppercase tracking-[0.15em]
                transition-all duration-300 rounded-full border overflow-hidden
                ${
                  activeTab === index
                    ? 'bg-black text-white border-black'
                    : 'bg-transparent text-black border-[#d4d4d4] hover:border-black'
                }
              `}
            >
              <span className="relative z-10">{cat.label}</span>
            </button>
          ))}
        </div>

        {/* 内容区：左侧标签云 + 右侧雷达图 */}
        <div className="grid grid-cols-4 gap-4 md:grid-cols-8 md:gap-5 lg:grid-cols-12 lg:gap-6 items-center">
          {/* 技能标签 - 左侧 7/12 */}
          <div className="col-span-4 md:col-span-8 lg:col-span-7 order-2 lg:order-1">
            <div className="mb-8">
              <h3 className="font-bold text-[26px] text-black mb-2 tracking-tight">
                {currentCategory.label}
              </h3>
              <p className="font-mono text-[11px] text-[#999999] uppercase tracking-[0.2em]">
                {currentCategory.items.length} ITEMS
              </p>
            </div>

            <div
              ref={tagsContainerRef}
              className="flex flex-wrap gap-2.5 md:gap-3"
            >
              {currentCategory.items.map((item) => (
                <span
                  key={`${activeTab}-${item.name}`}
                  className="skill-tag inline-flex items-center px-4 py-2.5
                    bg-[#f5f5f5] border border-[#e5e5e5] rounded-md
                    text-[14px] text-black font-medium
                    hover:bg-black hover:text-white hover:border-black
                    transition-all duration-300 cursor-default
                    font-[Noto Sans CJK SC,system-ui,sans-serif]"
                >
                  {item.name}
                </span>
              ))}
            </div>

            {/* 其他工具 */}
            <div className="mt-10 pt-8 border-t border-[#e5e5e5]">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#999999] mb-4">
                OTHER TOOLS
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="text-[12px] text-[#555555] px-3 py-1.5 bg-white border border-[#e5e5e5] rounded-md font-[Noto Sans CJK SC,system-ui,sans-serif]">
                  AutoCAD 工程制图
                </span>
                <span className="text-[12px] text-[#555555] px-3 py-1.5 bg-white border border-[#e5e5e5] rounded-md font-[Noto Sans CJK SC,system-ui,sans-serif]">
                  Inventor 三维建模
                </span>
                <span className="text-[12px] text-[#555555] px-3 py-1.5 bg-white border border-[#e5e5e5] rounded-md font-[Noto Sans CJK SC,system-ui,sans-serif]">
                  Word / PPT 方案输出
                </span>
                <span className="text-[12px] text-[#555555] px-3 py-1.5 bg-white border border-[#e5e5e5] rounded-md font-[Noto Sans CJK SC,system-ui,sans-serif]">
                  数据透视表 / VLOOKUP
                </span>
                <span className="text-[12px] text-[#555555] px-3 py-1.5 bg-white border border-[#e5e5e5] rounded-md font-[Noto Sans CJK SC,system-ui,sans-serif]">
                  腾讯文档协作
                </span>
              </div>
            </div>
          </div>

          {/* 雷达图 - 右侧 5/12 */}
          <div className="skills-radar col-span-4 md:col-span-8 lg:col-span-5 order-1 lg:order-2 mb-10 lg:mb-0">
            <div className="flex flex-col items-center">
              <div className="relative">
                {/* 雷达图外圈装饰 */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#f8f8f8] to-white -z-10 scale-110" />
                <RadarChart
                  dimensions={radarDimensions}
                  size={320}
                  levels={4}
                  className="mb-2"
                />
              </div>
              <p className="font-mono text-[10px] text-[#999999] uppercase tracking-[0.25em] text-center mt-2">
                COMPREHENSIVE ABILITY MAP
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
