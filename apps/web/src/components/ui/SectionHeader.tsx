import type { LucideIcon } from 'lucide-react';

interface SectionHeaderProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
}

export default function SectionHeader({ icon: Icon, title, subtitle }: SectionHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
      <div className="flex items-center gap-3">
        <Icon className="text-[var(--color-primary)]" size={28} />
        <h2 className="text-2xl md:text-3xl font-bold font-mono tracking-tight">
          {title}
        </h2>
      </div>
      {subtitle && (
        <p className="text-[var(--color-text-muted)] font-mono text-sm">
          {subtitle}
        </p>
      )}
    </div>
  );
}
