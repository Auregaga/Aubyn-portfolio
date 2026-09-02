'use client';

import { motion } from 'framer-motion';
import { fadeInUp, viewportConfig } from '@/src/lib/animations';

interface SectionWrapperProps {
  sectionId: string;
  variant?: 'primary' | 'secondary' | 'tertiary';
  animate?: boolean;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<string, string> = {
  primary: 'bg-[var(--color-bg-primary)]',
  secondary: 'bg-[var(--color-bg-secondary)]',
  tertiary: 'bg-[var(--color-bg-tertiary)]',
};

export default function SectionWrapper({
  sectionId,
  variant = 'primary',
  animate = true,
  children,
  className = '',
}: SectionWrapperProps) {
  const baseClasses = `w-full py-[var(--space-12)] md:py-[var(--space-16)] ${variantStyles[variant]}`;

  if (!animate) {
    return (
      <section id={sectionId} className={`${baseClasses} ${className}`}>
        <div className="max-w-[var(--container-max)] mx-auto px-[var(--container-padding-mobile)] md:px-[var(--container-padding)]">
          {children}
        </div>
      </section>
    );
  }

  return (
    <motion.section
      id={sectionId}
      className={`${baseClasses} ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={viewportConfig}
      variants={fadeInUp}
    >
      <div className="max-w-[var(--container-max)] mx-auto px-[var(--container-padding-mobile)] md:px-[var(--container-padding)]">
        {children}
      </div>
    </motion.section>
  );
}
