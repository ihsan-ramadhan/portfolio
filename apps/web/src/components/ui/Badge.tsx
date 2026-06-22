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
    outline: "border-primary text-primary",
    primary: "bg-primary text-white border-primary",
    ghost: "border-border text-text-muted"
  };

  return (
    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md border uppercase transition-colors ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
