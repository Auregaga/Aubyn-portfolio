'use client';

import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CrossMark from '@/src/components/ui/CrossMark';
import StaircaseDecoration from '@/src/components/ui/StaircaseDecoration';
import type { ShowcaseProject } from '@/src/data/types';

interface ProjectsSectionProps {
  projects: ShowcaseProject[];
}

gsap.registerPlugin(ScrollTrigger);

// 项目媒体子组件
function ProjectMedia({ project }: { project: ShowcaseProject }) {
  const handleClick = () => {
    if (project.link) {
      window.open(project.link, '_blank');
    }
  };

  return (
    <div
      className={`relative z-10 max-w-[50%] ${
        project.mediaLayout === 'left-large'
          ? 'mr-auto ml-[8%]'
          : project.mediaLayout === 'right-large'
            ? 'ml-auto mr-[8%] mt-[5vh]'
            : 'mx-auto'
      } ${project.link ? 'cursor-pointer group' : ''}`}
      onClick={handleClick}
    >
      {project.mediaType === 'image' && (
        <div className="relative">
          <img
            src={project.mediaSrc}
            alt={project.name}
            className="max-h-[50vh] w-auto object-contain transition-all duration-500 ease-out group-hover:scale-[1.02] group-hover:shadow-[0_20px_60px_rgba(0,0,0,0.4)] rounded-lg"
          />
          {/* 右下角 AI 生成水印遮挡（与页面黑背景同色） */}
          <div className="absolute bottom-0 right-0 w-[120px] h-[40px] bg-black pointer-events-none rounded-br-lg" />
          {project.link && (
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 rounded-lg">
              <span className="font-mono text-[12px] uppercase tracking-[0.2em] text-white bg-black/60 px-4 py-2 backdrop-blur-sm">
                View Project →
              </span>
            </div>
          )}
        </div>
      )}
      {project.mediaType === 'video' && (
        <video
          src={project.mediaSrc}
          className="max-h-[55vh] w-auto"
          autoPlay
          loop
          muted
          playsInline
        />
      )}
    </div>
  );
}

export default function ProjectsSection({ projects }: ProjectsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!sectionRef.current || !pinRef.current || !trackRef.current) return;

    const section = sectionRef.current;
    const pinWrap = pinRef.current;
    const track = trackRef.current;

    // 使用 gsap.context 统一管理动画，自动清理
    const ctx = gsap.context(() => {
      const slides = track.querySelectorAll('.project-slide');
      const titleEl = section.querySelector('.projects-title');
      const descEl = section.querySelector('.projects-desc');
      const scrollNumEl = section.querySelector('.projects-scroll-num');
      const dividerEl = section.querySelector('.projects-divider');
      const scrollIndicator = section.querySelector('.scroll-indicator');
      const crossMarks = section.querySelectorAll('.cross-mark');

      // 入场动画：标题从下方滑入 + 元素依次出现
      const entranceTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'top top',
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
        0.3
      );

      entranceTl.fromTo(
        crossMarks,
        { autoAlpha: 0, scale: 0.5 },
        { autoAlpha: 1, scale: 1, stagger: 0.1, ease: 'power2.out' },
        0.3
      );

      entranceTl.fromTo(
        scrollIndicator,
        { autoAlpha: 0, y: -10 },
        { autoAlpha: 1, y: 0, ease: 'power2.out' },
        0.3
      );

      entranceTl.fromTo(
        descEl,
        { x: -30, autoAlpha: 0 },
        { x: 0, autoAlpha: 1, ease: 'power2.out' },
        0.4
      );

      entranceTl.fromTo(
        scrollNumEl,
        { x: 30, autoAlpha: 0 },
        { x: 0, autoAlpha: 1, ease: 'power2.out' },
        0.4
      );

      // 横向滚动：pin 住整个区域，项目从右向左滑出
      const totalSlides = slides.length;

      const horizontalTl = gsap.timeline({
        scrollTrigger: {
          trigger: pinWrap,
          start: 'top top',
          end: () => `+=${totalSlides * window.innerWidth}`,
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // 统一节奏：每张幻灯片占 1 单位时间
      // 前 0.5：右侧滑入 → 中心
      // 后 0.5：中心停留（最后一张停留到末尾）
      // 第 n 张的后 0.5 和第 n+1 张的前 0.5 重叠，形成平滑过渡
      horizontalTl.to({}, { duration: totalSlides, ease: 'none' }, 0);

      slides.forEach((slide, index) => {
        const startAt = index; // 每张的入场起始点

        // 入场：右侧滑入到中心
        horizontalTl.fromTo(
          slide,
          { xPercent: 80, autoAlpha: 0 },
          { xPercent: 0, autoAlpha: 1, ease: 'power3.out', duration: 0.5 },
          startAt
        );

        // 停留：保持在中心（一直到末尾，除非被下一张推走）
        // 非最后一张：在 startAt + 1 时向左出场，给下一张让位
        if (index < totalSlides - 1) {
          horizontalTl.to(
            slide,
            { xPercent: -80, autoAlpha: 0, ease: 'power3.in', duration: 0.5 },
            startAt + 0.5
          );
        }
      });

      // 跟踪当前项目索引：progress * totalSlides 取整
      const updateIndex = () => {
        if (!horizontalTl.scrollTrigger) return;
        const progress = horizontalTl.progress();
        const idx = Math.min(
          Math.floor(progress * totalSlides),
          totalSlides - 1
        );
        setCurrentIndex(idx);
      };

      horizontalTl.eventCallback('onUpdate', updateIndex);
    }, section);

    return () => {
      ctx.revert();
    };
  }, [projects]);

  const currentProject = projects[currentIndex] || projects[0];

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative bg-black text-white"
    >
      {/* Pin 容器 - 整个 Projects 区域被 pin 住 */}
      <div ref={pinRef} className="relative h-screen w-full overflow-hidden">
        {/* 四角十字标记 */}
        <div className="cross-mark">
          <CrossMark position="top-left" color="#fff" />
        </div>
        <div className="cross-mark">
          <CrossMark position="top-right" color="#fff" />
        </div>

        {/* 滚动指示器 */}
        <div className="scroll-indicator absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center z-10">
          <div className="w-px h-16 bg-white relative">
            <div
              className="absolute left-1/2 -translate-x-1/2 w-1 h-1 bg-white transition-all duration-300"
              style={{
                top: `${Math.min((currentIndex / (projects.length - 1 || 1)) * 100, 100)}%`,
              }}
            />
          </div>
        </div>

        {/* 大标题（缩小版） */}
        <div className="absolute top-0 left-0 right-0 pt-10 z-10">
          <h2
            className="projects-title font-black tracking-tight text-center leading-none text-white"
            style={{ fontSize: 'clamp(40px, 5vw, 72px)' }}
          >
            PROJECTS
          </h2>
        </div>

        {/* 水平分隔线 */}
        <div className="projects-divider absolute top-20 left-0 right-0 h-px bg-white origin-left z-10" />

        {/* 描述文字 + 页码 */}
        <div className="absolute top-28 left-0 right-0 flex justify-between items-start px-[5vw] z-10">
          <div key={currentProject.id} className="projects-desc max-w-[380px]">
            <span className="font-mono uppercase text-[11px] tracking-[0.2em] text-white/50 mb-2 block">
              — 项目概要
            </span>
            <p className="font-mono uppercase leading-[1.5] text-[13px] text-white">
              {currentProject.description}
            </p>
          </div>
          <span className="projects-scroll-num font-mono uppercase text-[13px] whitespace-nowrap text-white">
            SCROLL {String(currentProject.scrollNum).padStart(2, '0')}
          </span>
        </div>

        {/* 项目横向轨道 */}
        <div
          ref={trackRef}
          className="absolute inset-0 flex items-center justify-center"
        >
          {projects.map((project) => (
            <div
              key={project.id}
              className="project-slide absolute w-full h-full flex items-center justify-center"
            >
              <ProjectMedia project={project} />
            </div>
          ))}
        </div>

        {/* 底部十字标记 */}
        <div className="cross-mark">
          <CrossMark position="bottom-left" color="#fff" />
        </div>
        <div className="cross-mark">
          <CrossMark position="bottom-center" color="#fff" />
        </div>
        <div className="cross-mark">
          <CrossMark position="bottom-right" color="#fff" />
        </div>
      </div>

      {/* 黑→浅灰 过渡区 */}
      <div className="h-[50vh] bg-gradient-to-b from-black to-[#f0f0f0]" />
    </section>
  );
}
