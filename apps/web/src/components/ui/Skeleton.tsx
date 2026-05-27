interface SkeletonProps {
  className?: string;
}

export default function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-[var(--color-bg-subtle)] border border-[var(--color-border)] rounded ${className}`} />
  );
}
