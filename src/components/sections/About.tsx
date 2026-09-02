'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, type Variants } from 'framer-motion';
import type { Profile } from '@/src/data/types';
import AgentChat from '@/src/components/ui/AgentChat';

interface AboutProps {
  profile: Profile;
}

// 视口内打字机 hook
function useTypewriterOnView(text: string, speed = 60, delay = 200) {
  const [displayText, setDisplayText] = useState('');
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !started) {
            setStarted(true);
            // 延迟后开始打字
            setTimeout(() => {
              let charIndex = 0;
              const typeNext = () => {
                if (charIndex < text.length) {
                  setDisplayText(text.slice(0, charIndex + 1));
                  charIndex++;
                  timeoutRef.current = setTimeout(typeNext, speed);
                }
              };
              typeNext();
            }, delay);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [text, speed, delay, started]);

  return { displayText, ref };
}

const paragraphVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const paragraphsContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.25,
      delayChildren: 0.4,
    },
  },
};

export default function About({ profile }: AboutProps) {
  const { bioParagraphs } = profile;

  // 标题打字机动画 - 进入视口时触发
  const { displayText: titleText, ref: titleRef } = useTypewriterOnView(
    'Who am I?',
    80,
    300
  );

  return (
    <section
      id="about"
      className="w-full bg-[var(--color-bg-primary)] py-[var(--space-10)] md:py-[var(--space-12)] lg:py-[var(--space-16)]"
    >
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 lg:px-0">
        <div className="grid grid-cols-12 gap-6 items-center">
          {/* 左侧：标题 + 正文（col-start-2, 正文 col-span-5） */}
          <div className="col-span-12 lg:col-span-5 lg:col-start-2 pl-0 md:pl-0 lg:pl-0">
            <div>
              {/* 标题 Who am I? - 打字机动画 + 上移 */}
              <div ref={titleRef} className="mb-10 -mt-4">
                <h2
                  className="font-extrabold text-[var(--color-text-primary)]"
                  style={{
                    fontSize: '32px',
                    lineHeight: 1.2,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {titleText}
                  {titleText.length < 'Who am I?'.length && (
                    <span className="inline-block w-[0.08em] h-[0.9em] bg-[var(--color-text-primary)] ml-1 align-[-0.1em] animate-blink" />
                  )}
                </h2>
              </div>

              {/* 正文段落 - 三段，间距 mb-8，字号 text-xl，首行缩进两字 */}
              <motion.div
                className="flex flex-col"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
                variants={paragraphsContainerVariants}
              >
                {bioParagraphs?.map((paragraph, index) => (
                  <motion.p
                    key={index}
                    variants={paragraphVariants}
                    className={`font-bold text-[var(--color-text-primary)] text-xl ${
                      index < bioParagraphs.length - 1 ? 'mb-8' : ''
                    }`}
                    style={{
                      lineHeight: 2,
                      textIndent: '2em',
                    }}
                  >
                    {paragraph}
                  </motion.p>
                ))}
              </motion.div>
            </div>
          </div>

          {/* 右侧：Agent 对话 → 照片 */}
          <div className="hidden lg:block lg:col-span-6 lg:col-start-7">
            <AgentChat photoUrl={profile.avatar} />
          </div>
        </div>
      </div>
      {/* 白→黑 过渡区，衔接 PROJECTS */}
      <div className="h-[25vh] bg-gradient-to-b from-white to-black" />
    </section>
  );
}
