'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import type { Profile } from '@/src/data/types';

interface HeroProps {
  profile: Profile;
}

// 打字机循环 hook
function useTypewriterLoop(texts: string[], typeSpeed = 100, deleteSpeed = 50, pauseDuration = 2000, startDelay = 1000) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (texts.length === 0) return;

    const currentText = texts[currentIndex];

    if (!startedRef.current) {
      startedRef.current = true;
      timeoutRef.current = setTimeout(() => {
        setDisplayText('');
      }, startDelay);
      return;
    }

    // 打字或删除
    if (!isDeleting) {
      // 正在打字
      if (displayText.length < currentText.length) {
        timeoutRef.current = setTimeout(() => {
          setDisplayText(currentText.slice(0, displayText.length + 1));
        }, typeSpeed);
      } else {
        // 打完了，暂停后开始删除
        timeoutRef.current = setTimeout(() => {
          setIsDeleting(true);
        }, pauseDuration);
      }
    } else {
      // 正在删除
      if (displayText.length > 0) {
        timeoutRef.current = setTimeout(() => {
          setDisplayText(displayText.slice(0, -1));
        }, deleteSpeed);
      } else {
        // 删除完了，切换到下一个
        setIsDeleting(false);
        setCurrentIndex((prev) => (prev + 1) % texts.length);
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [displayText, isDeleting, currentIndex, texts, typeSpeed, deleteSpeed, pauseDuration, startDelay]);

  return { displayText, isTyping: !isDeleting && displayText.length < texts[currentIndex]?.length };
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0,
    },
  },
};

// 副标题动画 - 在标题打字到一定程度后开始
const subtitleVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1],
      delay: 0,
    },
  },
};

// 宣言行动画 - 依次流动
const taglineLineVariants: Variants = {
  hidden: { opacity: 0, y: 25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const scrollIndicatorVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 1,
      delay: 1,
    },
  },
};

export default function Hero({ profile }: HeroProps) {
  const { name, nameEn, title, tagline } = profile;

  // 标题打字机循环
  const { displayText: titleText } = useTypewriterLoop(
    [name, nameEn || name],
    120,   // 打字速度（偏慢）
    40,    // 删除速度
    2500,  // 停顿时间
    1200   // 开始延迟
  );

  // 副标题延迟出现（等标题打一部分后）
  const [showSubtitle, setShowSubtitle] = useState(false);
  // 宣言延迟出现（在副标题之后）
  const [showTagline, setShowTagline] = useState(false);

  useEffect(() => {
    const subtitleTimer = setTimeout(() => {
      setShowSubtitle(true);
    }, 2200);

    const taglineTimer = setTimeout(() => {
      setShowTagline(true);
    }, 3200);

    return () => {
      clearTimeout(subtitleTimer);
      clearTimeout(taglineTimer);
    };
  }, []);

  return (
    <section
      id="hero"
      className="relative w-full min-h-[100svh] flex flex-col justify-center items-center overflow-hidden bg-[var(--color-bg-primary)]"
    >
      <div className="max-w-[1200px] w-full mx-auto px-5 md:px-8 lg:px-0">
        <div className="grid grid-cols-12 gap-4 md:gap-5 lg:gap-6">
          {/* 内容居中：10/12 列 */}
          <div className="col-span-12 flex flex-col items-center text-center">
            {/* 1. 标题 - 打字机动画 */}
            <div className="mb-[80px] relative -top-[50px]">
              <h1
                className="font-extrabold text-[var(--color-text-primary)] tracking-tight text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-center"
                style={{ lineHeight: 1.1, minHeight: '1.1em' }}
              >
                {titleText}
                <span className="inline-block w-[0.08em] h-[0.9em] bg-[var(--color-text-primary)] ml-1 align-[-0.1em] animate-blink" />
              </h1>
            </div>

            {/* 2. 副标题 */}
            <AnimatePresence mode="wait">
              {showSubtitle && (
                <motion.div
                  key="subtitle"
                  variants={subtitleVariants}
                  initial="hidden"
                  animate="visible"
                  className="mb-[40px]"
                >
                  <p
                    className="text-[var(--color-text-primary)] font-semibold text-xl md:text-2xl lg:text-3xl"
                    style={{ lineHeight: 1.3 }}
                  >
                    {title}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 3. 宣言 - 依次流动播放 */}
            <AnimatePresence mode="wait">
              {showTagline && (
                <motion.div
                  key="tagline"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex flex-col items-center max-w-[1000px]"
                >
                  {tagline.lines.map((line, index) => (
                    <motion.p
                      key={index}
                      variants={taglineLineVariants}
                      className={`whitespace-nowrap text-base sm:text-lg md:text-xl lg:text-[28px] ${
                        index < tagline.lines.length - 1 ? 'mb-4' : ''
                      } ${
                        line.variant === 'tertiary'
                          ? 'font-medium text-[#999999]'
                          : 'font-semibold text-[var(--color-text-primary)]'
                      }`}
                    >
                      {line.text}
                    </motion.p>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* 向下滚动引导 */}
      <motion.div
        variants={scrollIndicatorVariants}
        initial="hidden"
        animate="visible"
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs text-[var(--color-text-tertiary)] tracking-widest font-medium">
          SCROLL
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="text-[var(--color-text-tertiary)]"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 5v14M5 12l7 7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
