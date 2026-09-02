'use client';

import { useState, useEffect, useRef } from 'react';

interface UseTypewriterOptions {
  text: string;
  speed?: number;        // 每个字符的打字速度（ms）
  delay?: number;        // 开始前的延迟（ms）
  startOnView?: boolean; // 是否在进入视口时开始
}

export function useTypewriter({
  text,
  speed = 80,
  delay = 0,
}: UseTypewriterOptions) {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    // 重置
    setDisplayText('');
    setIsComplete(false);
    setIsTyping(false);
    startedRef.current = false;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // 延迟后开始打字
    const startDelay = setTimeout(() => {
      startedRef.current = true;
      setIsTyping(true);
      let charIndex = 0;

      const typeNextChar = () => {
        if (charIndex < text.length) {
          setDisplayText(text.slice(0, charIndex + 1));
          charIndex++;
          timeoutRef.current = setTimeout(typeNextChar, speed);
        } else {
          setIsComplete(true);
          setIsTyping(false);
        }
      };

      typeNextChar();
    }, delay);

    return () => {
      clearTimeout(startDelay);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [text, speed, delay]);

  return { displayText, isComplete, isTyping };
}

export default useTypewriter;
