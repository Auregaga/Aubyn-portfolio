interface TagProps {
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'solid';
  size?: 'sm' | 'md';
  className?: string;
}

const variantStyles: Record<string, string> = {
  default: 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)]',
  outline: 'bg-transparent border border-[var(--color-border)] text-[var(--color-text-secondary)]',
  solid: 'bg-[var(--color-accent)] text-white',
};

const sizeStyles: Record<string, string> = {
  sm: 'px-[var(--space-2)] py-[2px] text-[var(--font-size-caption)]',
  md: 'px-[var(--space-3)] py-[var(--space-1)] text-[var(--font-size-small)]',
};

export default function Tag({
  children,
  variant = 'default',
  size = 'sm',
  className = '',
}: TagProps) {
  return (
    <span
      className={`
        inline-flex items-center
        rounded-[var(--radius-full)]
        font-medium
        whitespace-nowrap
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
