'use client';

import { motion, type Variants } from 'framer-motion';
import { viewportConfig } from '@/src/lib/animations';

interface ProgressBarProps {
  value: number;
  label?: string;
  showValue?: boolean;
  height?: 'sm' | 'md' | 'lg';
  animate?: boolean;
  className?: string;
}

const heightStyles: Record<string, string> = {
  sm: 'h-1',
  md: 'h-1.5',
  lg: 'h-2',
};

export default function ProgressBar({
  value,
  label,
  showValue = false,
  height = 'md',
  animate = true,
  className = '',
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  const barVariants: Variants = {
    hidden: { width: '0%' },
    visible: {
      width: `${clampedValue}%`,
      transition: {
        duration: 1,
        ease: 'easeOut',
      },
    },
  };

  return (
    <div className={`w-full ${className}`}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-[var(--space-2)]">
          {label && (
            <span className="text-[var(--font-size-small)] text-[var(--color-text-secondary)]">
              {label}
            </span>
          )}
          {showValue && (
            <span className="text-[var(--font-size-small)] text-[var(--color-text-tertiary)] font-mono">
              {clampedValue}%
            </span>
          )}
        </div>
      )}
      <div
        className={`
          w-full
          bg-[var(--color-bg-tertiary)]
          rounded-[var(--radius-full)]
          overflow-hidden
          ${heightStyles[height]}
        `}
      >
        {animate ? (
          <motion.div
            className="h-full bg-[var(--color-accent)] rounded-[var(--radius-full)]"
            initial="hidden"
            whileInView="visible"
            viewport={viewportConfig}
            variants={barVariants}
          />
        ) : (
          <div
            className="h-full bg-[var(--color-accent)] rounded-[var(--radius-full)]"
            style={{ width: `${clampedValue}%` }}
          />
        )}
      </div>
    </div>
  );
}
