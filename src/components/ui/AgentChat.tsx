'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import DitherImage from './DitherImage';

interface AgentChatProps {
  photoUrl?: string;
}

// 已发送的代码内容（按行分割，带语法标记）
interface CodeLine {
  text: string;
  type: 'comment' | 'keyword' | 'string' | 'normal' | 'property';
}

const codeLines: CodeLine[] = [
  { text: '// Identity Configuration', type: 'comment' },
  { text: 'export const profile = {', type: 'keyword' },
  { text: "  name: '钱一鹏 / Aubyn',", type: 'property' },
  { text: "  role: 'AI Product Manager',", type: 'property' },
  { text: "  classOf: '2027',", type: 'property' },
  { text: "  status: 'SEEKING_Intern&HC',", type: 'property' },
  { text: "  background: 'Engineering',", type: 'property' },
  { text: "  philosophy: 'Rigor + Warmth',", type: 'property' },
  { text: "  mission: 'Anchor abstract ideas into", type: 'property' },
  { text: "tangible experiences',", type: 'string' },
  { text: "  position: 'ai technologies, the basic", type: 'property' },
  { text: 'principles of NLP, machine learning,', type: 'string' },
  { text: 'LLM,possesses strong initiative,', type: 'string' },
  { text: 'logical thinking, think independently,', type: 'string' },
  { text: "analytical skills',", type: 'string' },
  { text: '};', type: 'normal' },
  { text: '', type: 'normal' },
  { text: '// Status: READY_2_DEPLOY', type: 'comment' },
];

// 计算完整文本用于打字计数
const codeContent = codeLines.map(l => l.text).join('\n');

const pendingPrompt = '帮我根据以上 Prompt 生成候选人';

// 语法高亮颜色
const syntaxColors = {
  comment: '#6a9955',
  keyword: '#569cd6',
  string: '#ce9178',
  property: '#9cdcfe',
  normal: '#d4d4d4',
};

export default function AgentChat({ photoUrl }: AgentChatProps) {
  const [sent, setSent] = useState(false);
  const [showPhoto, setShowPhoto] = useState(false);
  const [typedChars, setTypedChars] = useState(0);
  const [hasStartedTyping, setHasStartedTyping] = useState(false);
  const [hoverSend, setHoverSend] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 进入视口时开始打字
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasStartedTyping) {
            setHasStartedTyping(true);
            setTimeout(() => {
              let i = 0;
              const typeNext = () => {
                if (i < codeContent.length) {
                  setTypedChars(i + 1);
                  i++;
                  // 打字速度有变化，更自然
                  const speed = codeContent[i - 1] === '\n' ? 40 : 8;
                  setTimeout(typeNext, speed);
                }
              };
              typeNext();
            }, 600);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [hasStartedTyping]);

  const isTypingComplete = typedChars >= codeContent.length;

  // 计算已打了多少字符，用于行渲染
  let remainingChars = typedChars;
  const typedLines: { text: string; type: string; isPartial: boolean }[] = [];
  for (const line of codeLines) {
    if (remainingChars <= 0) break;
    const lineLen = line.text.length + 1; // +1 for newline
    if (remainingChars >= lineLen) {
      typedLines.push({ text: line.text, type: line.type, isPartial: false });
      remainingChars -= lineLen;
    } else {
      typedLines.push({ text: line.text.slice(0, remainingChars), type: line.type, isPartial: true });
      remainingChars = 0;
    }
  }

  const handleSend = () => {
    if (sent || !isTypingComplete) return;
    setSent(true);

    setTimeout(() => {
      setShowPhoto(true);
    }, 1500);
  };

  return (
    <div ref={containerRef} className="w-full aspect-square relative">
      {/* 外层发光渐变边框 */}
      <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-[#4a4a4a] via-[#2a2a2a] to-[#1a1a1a] opacity-60" />

      {/* 外层点阵边框 */}
      <div
        className="absolute inset-0 rounded-2xl"
        style={{
          padding: '3px',
          backgroundImage:
            'radial-gradient(circle, #3a3a3a 1px, transparent 1px)',
          backgroundSize: '5px 5px',
        }}
      >
        <div className="w-full h-full overflow-hidden bg-[#161616] rounded-xl relative">
          {/* 顶部扫描线效果 */}
          <motion.div
            className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#4a9eff]/30 to-transparent z-10"
            animate={{ y: [0, '100%', 0] }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'linear',
            }}
          />

          <AnimatePresence mode="wait">
            {!showPhoto ? (
              <motion.div
                key="chat"
                className="w-full h-full flex flex-col relative"
                initial={{ opacity: 1 }}
                exit={{
                  opacity: 0,
                  y: -20,
                  transition: { duration: 0.5, ease: 'easeIn' },
                }}
              >
                {/* 顶部标题栏 - 居中，无三点 */}
                <div className="px-5 py-3.5 border-b border-[#2a2a2a] flex items-center justify-center relative bg-gradient-to-b from-[#1e1e1e] to-[#161616]">
                  <motion.div
                    className="flex items-center gap-2.5"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    {/* 状态指示点 */}
                    <motion.div
                      className="w-2 h-2 rounded-full bg-[#6a9955]"
                      animate={{ opacity: [1, 0.4, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <span className="text-[#aaa] font-mono text-sm tracking-[0.2em] uppercase">
                      Agent Terminal
                    </span>
                  </motion.div>

                  {/* 左右装饰线 */}
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-px bg-gradient-to-r from-transparent to-[#333]" />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-px bg-gradient-to-l from-transparent to-[#333]" />
                </div>

                {/* 代码内容区（带行号 + 语法高亮） */}
                <div className="flex-1 overflow-hidden py-4 px-2 font-mono text-[13px] leading-relaxed relative">
                  <div className="flex h-full">
                    {/* 行号列 */}
                    <div className="w-10 text-right pr-3 text-[#444] select-none flex-shrink-0 border-r border-[#222] mr-3">
                      {typedLines.map((line, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3 }}
                          className="h-[1.625em]"
                        >
                          {String(i + 1).padStart(3, '0')}
                        </motion.div>
                      ))}
                    </div>
                    {/* 代码列 */}
                    <div className="flex-1 whitespace-pre-wrap overflow-hidden">
                      {typedLines.map((line, i) => (
                        <div
                          key={i}
                          className="h-[1.625em]"
                          style={{ color: syntaxColors[line.type as keyof typeof syntaxColors] }}
                        >
                          {line.text}
                        </div>
                      ))}
                      {/* 光标 */}
                      {!isTypingComplete && typedLines.length > 0 && (
                        <span className="inline-block w-2 h-4 bg-[#d4d4d4] ml-0.5 align-text-bottom animate-blink" />
                      )}
                    </div>
                  </div>
                </div>

                {/* 底部状态栏 - 动态效果 */}
                <div className="px-4 py-2 border-t border-[#2a2a2a] flex items-center justify-between bg-gradient-to-t from-[#121212] to-[#161616]">
                  <div className="flex items-center gap-2">
                    <motion.div
                      className="w-1.5 h-1.5 rounded-full"
                      animate={{
                        backgroundColor: isTypingComplete ? '#6a9955' : '#febc2e',
                        scale: isTypingComplete ? [1, 1.2, 1] : 1,
                      }}
                      transition={{ duration: 0.5 }}
                    />
                    <span className="text-[#666] font-mono text-xs">
                      {isTypingComplete ? 'READY_2_DEPLOY' : 'TYPING...'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[#555] font-mono text-xs">
                      {typedLines.length} / {codeLines.length}
                    </span>
                    {/* 迷你进度条 */}
                    <div className="w-16 h-1 bg-[#222] rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-[#4a9eff] rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${(typedLines.length / codeLines.length) * 100}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>
                </div>

                {/* 输入区 - 加大加宽 + 精致边框 */}
                <motion.div
                  className="p-4 border-t border-[#2a2a2a]"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{
                    opacity: isTypingComplete ? 1 : 0.5,
                    y: isTypingComplete ? 0 : 10,
                  }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="flex items-end gap-3">
                    {/* 输入框 */}
                    <motion.div
                      className="flex-1 rounded-xl px-5 py-4 min-h-[72px] flex items-center relative overflow-hidden"
                      style={{
                        background: isTypingComplete ? '#0d0d0d' : '#121212',
                        border: `1px solid ${isTypingComplete ? '#3a3a3a' : '#222'}`,
                      }}
                      animate={isTypingComplete && !sent ? {
                        boxShadow: ['0 0 0 0 rgba(74, 158, 255, 0)', '0 0 0 4px rgba(74, 158, 255, 0.1)', '0 0 0 0 rgba(74, 158, 255, 0)'],
                      } : {}}
                      transition={isTypingComplete && !sent ? {
                        boxShadow: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
                      } : {}}
                    >
                      {/* 输入框内部光效 */}
                      {isTypingComplete && !sent && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-[#4a9eff]/5 to-transparent"
                          animate={{ x: ['-100%', '200%'] }}
                          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                        />
                      )}
                      <div className="flex items-start gap-3 w-full relative z-10">
                        <span className="text-[#6a9955] font-mono text-base flex-shrink-0 mt-0.5">
                          {'>'}
                        </span>
                        <span className="text-[#e0e0e0] font-mono text-sm flex-1 leading-relaxed">
                          {pendingPrompt}
                        </span>
                        {isTypingComplete && !sent && (
                          <span className="inline-block w-1.5 h-5 bg-[#e0e0e0] animate-blink flex-shrink-0 mt-0.5" />
                        )}
                      </div>
                    </motion.div>

                    {/* 圆形发送按钮 - 更醒目精致 */}
                    <motion.button
                      onClick={handleSend}
                      disabled={sent || !isTypingComplete}
                      onMouseEnter={() => setHoverSend(true)}
                      onMouseLeave={() => setHoverSend(false)}
                      className={`
                        relative w-14 h-14 rounded-full flex items-center justify-center
                        flex-shrink-0 transition-all duration-300 overflow-hidden
                        ${sent
                          ? 'bg-[#1e1e1e] text-[#6a9955] cursor-default border border-[#6a9955]/30'
                          : isTypingComplete
                            ? 'bg-white text-black cursor-pointer'
                            : 'bg-[#1e1e1e] text-[#444] cursor-not-allowed border border-[#2a2a2a]'
                        }
                      `}
                      whileHover={!sent && isTypingComplete ? { scale: 1.1 } : {}}
                      whileTap={!sent && isTypingComplete ? { scale: 0.9 } : {}}
                    >
                      {/* 按钮光晕效果 */}
                      {isTypingComplete && !sent && (
                        <>
                          <motion.div
                            className="absolute inset-0 rounded-full bg-white"
                            animate={{ opacity: hoverSend ? 1 : 0.9 }}
                          />
                          <motion.div
                            className="absolute inset-0 rounded-full"
                            style={{
                              boxShadow: '0 0 20px rgba(255,255,255,0.3)',
                            }}
                            animate={{
                              opacity: [0.5, 1, 0.5],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              ease: 'easeInOut',
                            }}
                          />
                        </>
                      )}
                      <span className="relative z-10">
                        {sent ? (
                          <motion.svg
                            initial={{ scale: 0, rotate: -30 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                            width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                          >
                            <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                          </motion.svg>
                        ) : (
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </span>
                    </motion.button>
                  </div>
                </motion.div>

                {/* 发送后的加载状态 - 更精致 */}
                <AnimatePresence>
                  {sent && !showPhoto && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                      className="absolute inset-0 flex items-center justify-center bg-[#161616]/90 backdrop-blur-sm"
                    >
                      <div className="flex flex-col items-center gap-5">
                        {/* 旋转圆环 */}
                        <div className="relative w-16 h-16">
                          <motion.div
                            className="absolute inset-0 rounded-full border-2 border-[#2a2a2a]"
                          />
                          <motion.div
                            className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#4a9eff]"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          />
                          <motion.div
                            className="absolute inset-2 rounded-full border-2 border-transparent border-t-[#6a9955]"
                            animate={{ rotate: -360 }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                          />
                          {/* 中心图标 */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4a9eff" strokeWidth="2">
                              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" />
                            </svg>
                          </div>
                        </div>
                        <div className="text-center">
                          <motion.p
                            className="text-[#ccc] font-mono text-sm"
                            animate={{ opacity: [0.6, 1, 0.6] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            Generating candidate profile...
                          </motion.p>
                          <p className="text-[#555] font-mono text-xs mt-1.5">
                            running inference pipeline
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div
                key="photo"
                className="w-full h-full relative"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              >
                {photoUrl ? (
                  <DitherImage
                    src={photoUrl}
                    alt="钱一鹏 / Aubyn"
                    className="w-full h-full"
                    ditherOptions={{
                      matrixSize: 8,
                      lightColor: '#ffffff',
                      darkColor: '#999999',
                      threshold: 0,
                      scale: 1,
                    }}
                    transitionDuration={0.5}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#2a2a2a] to-[#0f0f0f] flex items-center justify-center relative overflow-hidden">
                    {/* 装饰性网格 */}
                    <div
                      className="absolute inset-0 opacity-20"
                      style={{
                        backgroundImage:
                          'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
                        backgroundSize: '20px 20px',
                      }}
                    />
                    <div className="text-center relative z-10">
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                        className="w-28 h-28 mx-auto mb-5 rounded-full bg-gradient-to-br from-[#333] to-[#222] flex items-center justify-center border-2 border-[#444] shadow-2xl"
                      >
                        <span className="text-4xl font-bold text-[#aaa]">Q</span>
                      </motion.div>
                      <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="text-[#666] text-sm font-mono"
                      >
                        photo_placeholder
                      </motion.p>
                    </div>
                  </div>
                )}

                {/* 照片上的名字标签 */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="absolute bottom-5 left-5 right-5 flex justify-between items-end"
                >
                  <div>
                    <p className="text-white text-xl font-bold drop-shadow-lg">
                      钱一鹏 / Aubyn
                    </p>
                    <p className="text-white/70 text-xs font-mono drop-shadow mt-1">
                      AI Product Manager · Class of 2027
                    </p>
                  </div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8, type: 'spring', stiffness: 300 }}
                    className="px-3 py-1.5 bg-[#6a9955]/20 backdrop-blur-sm rounded-lg text-[#6a9955] text-xs font-mono border border-[#6a9955]/30"
                  >
                    ✓ DEPLOYED
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
