'use client';

import { motion } from 'framer-motion';
import { hoverLift } from '@/src/lib/animations';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
}

export default function Card({
  children,
  className = '',
  hoverable = true,
  onClick,
}: CardProps) {
  const baseClasses = `
    bg-[var(--color-bg-primary)]
    border border-[var(--color-border)]
    rounded-[var(--radius-lg)]
    p-[var(--space-5)]
    transition-all
    duration-300
    ${onClick ? 'cursor-pointer' : ''}
  `;

  if (!hoverable) {
    return (
      <div className={`${baseClasses} ${className}`} onClick={onClick}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={`${baseClasses} ${className}`}
      whileHover="hover"
      initial="initial"
      variants={{
        initial: { y: 0, boxShadow: 'var(--shadow-sm)' },
        hover: { y: -4, boxShadow: 'var(--shadow-md)' },
      }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
}
