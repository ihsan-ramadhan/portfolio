import { type ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'outline' | 'ghost' | 'primary';
  className?: string;
}

export default function Badge({ 
  children, 
  variant = 'outline', 
  className = '' 
}: BadgeProps) {
  const variants = {
    outline: "border-[var(--color-primary)] text-[var(--color-primary)]",
    primary: "bg-[var(--color-primary)] text-white border-[var(--color-primary)]",
    ghost: "border-[var(--color-border)] text-[var(--color-text-muted)]"
  };

  return (
    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase transition-colors ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
