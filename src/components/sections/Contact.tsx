'use client';

import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { ContactInfo } from '@/src/data/types';

gsap.registerPlugin(ScrollTrigger);

interface ContactProps {
  contact: ContactInfo;
}

export default function Contact({ contact }: ContactProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // 标题入场
      gsap.from('.contact-left', {
        opacity: 0,
        x: -30,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          once: true,
        },
      });

      // 卡片 stagger 入场
      const cards = gsap.utils.toArray('.contact-card, .contact-card-github');
      gsap.from(cards, {
        opacity: 0,
        y: 24,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.contact-grid',
          start: 'top 80%',
          once: true,
        },
      });

      // 底部入场
      gsap.from('.contact-footer', {
        opacity: 0,
        duration: 0.6,
        delay: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 65%',
          once: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleCopy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const contactItems = [
    {
      key: 'email',
      label: '邮箱',
      value: contact.email,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m3 7 9 6 9-6" />
        </svg>
      ),
      action: 'copy',
      actionLabel: '复制',
    },
    {
      key: 'wechat',
      label: '微信',
      value: contact.wechat,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18z" />
          <path d="M16.924 8.858c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 01.598.082l1.584.926a.272.272 0 00.14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 01-.023-.156.49.49 0 01.201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088-.135-.01-.27-.027-.406-.032-.217-.005-.433-.002-.65.002zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.969-.982z" />
        </svg>
      ),
      action: 'copy',
      actionLabel: '复制',
    },
    {
      key: 'phone',
      label: '手机',
      value: contact.phone,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      ),
      action: 'copy',
      actionLabel: '复制',
    },
    {
      key: 'github',
      label: 'GitHub',
      value: '@Auregaga',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
      ),
      action: 'link',
      href: contact.github,
      actionLabel: '访问',
    },
    {
      key: 'xiaohongshu',
      label: '小红书',
      value: contact.xiaohongshu,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z" />
          <path d="M8 12h8M12 8v8" />
        </svg>
      ),
      action: 'copy',
      actionLabel: '复制',
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="w-full py-24 md:py-32 bg-black text-white relative overflow-hidden"
    >
      {/* 背景微光 */}
      <div className="absolute top-1/3 -left-32 w-[500px] h-[500px] bg-white/[0.03] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-white/[0.02] rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-[1100px] mx-auto px-5 md:px-8 lg:px-0 relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-20">
          {/* 左侧：标题区 */}
          <div className="contact-left lg:w-2/5 flex flex-col justify-center">
            <p className="text-[13px] text-[#666666] mb-4 font-[Noto Sans CJK SC,system-ui,sans-serif]">
              CONTACT
            </p>
            <h2 className="text-[40px] md:text-[52px] font-bold leading-[1.1] tracking-tight mb-6 font-[Noto Sans CJK SC,system-ui,sans-serif]">
              一起做点<br />有意思的事
            </h2>
            <p className="text-[15px] text-[#888888] leading-relaxed max-w-[360px] font-[Noto Sans CJK SC,system-ui,sans-serif]">
              无论是产品合作、技术交流，还是单纯想打个招呼，都欢迎通过以下方式找到我。
            </p>
          </div>

          {/* 右侧：联系卡片网格 */}
          <div className="contact-grid lg:w-3/5 flex flex-col gap-4">
            {/* 上排 4 个：2x2 网格 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {contactItems.filter(i => i.key !== 'github').map((item) => (
              <div
                key={item.key}
                className="contact-card group relative p-5 bg-white/[0.04] border border-white/[0.08] rounded-2xl
                  hover:bg-white/[0.08] hover:border-white/[0.15]
                  transition-all duration-300"
              >
                {/* 图标 + 标签 */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.08] flex items-center justify-center text-[#cccccc] group-hover:text-white transition-colors duration-300">
                    {item.icon}
                  </div>
                  <span className="text-[13px] text-[#888888] font-[Noto Sans CJK SC,system-ui,sans-serif]">
                    {item.label}
                  </span>
                </div>

                {/* 值 */}
                <p className="text-[17px] font-medium text-white mb-4 font-[Noto Sans CJK SC,system-ui,sans-serif] truncate">
                  {item.value}
                </p>

                {/* 操作按钮 */}
                {item.action === 'copy' && (
                  <button
                    onClick={() => handleCopy(item.value, item.key)}
                    className="w-full py-2.5 text-[13px] text-[#cccccc] bg-white/[0.06] rounded-xl
                      hover:bg-white hover:text-black transition-all duration-300
                      font-[Noto Sans CJK SC,system-ui,sans-serif]"
                  >
                    {copiedField === item.key ? '已复制 ✓' : item.actionLabel}
                  </button>
                )}
                {item.action === 'mailto' && (
                  <a
                    href={item.href}
                    className="block w-full py-2.5 text-center text-[13px] text-[#cccccc] bg-white/[0.06] rounded-xl
                      hover:bg-white hover:text-black transition-all duration-300
                      font-[Noto Sans CJK SC,system-ui,sans-serif]"
                  >
                    {item.actionLabel}
                  </a>
                )}
                {item.action === 'link' && (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-2.5 text-center text-[13px] text-[#cccccc] bg-white/[0.06] rounded-xl
                      hover:bg-white hover:text-black transition-all duration-300
                      font-[Noto Sans CJK SC,system-ui,sans-serif]"
                  >
                    {item.actionLabel}
                  </a>
                )}
              </div>
            ))}
            </div>

            {/* GitHub 主按钮 - 横跨整行 */}
            <a
              href={contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-card-github group flex items-center justify-between p-5 bg-white/[0.06] border border-white/[0.1] rounded-2xl
                hover:bg-white hover:text-black transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white/[0.1] flex items-center justify-center text-white group-hover:text-black transition-colors duration-300">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[13px] text-[#888888] group-hover:text-[#666666] transition-colors duration-300 font-[Noto Sans CJK SC,system-ui,sans-serif]">
                    GitHub
                  </p>
                  <p className="text-[18px] font-medium text-white group-hover:text-black transition-colors duration-300 font-[Noto Sans CJK SC,system-ui,sans-serif]">
                    @Auregaga
                  </p>
                </div>
              </div>
              <span className="text-[14px] text-[#cccccc] group-hover:text-black transition-colors duration-300 font-[Noto Sans CJK SC,system-ui,sans-serif]">
                查看仓库 &rarr;
              </span>
            </a>
          </div>
        </div>

        {/* 底部版权 */}
        <div className="contact-footer mt-20 pt-8 border-t border-white/[0.08] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[12px] text-[#555555] font-[Noto Sans CJK SC,system-ui,sans-serif]">
            2026 钱一鹏 / Aubyn. All rights reserved.
          </p>
          <p className="text-[12px] text-[#444444] font-[Noto Sans CJK SC,system-ui,sans-serif]">
            Designed & built with care
          </p>
        </div>
      </div>
    </section>
  );
}
