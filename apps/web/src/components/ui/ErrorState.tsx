
interface ErrorStateProps {
  message: string;
  className?: string;
}

export default function ErrorState({ message, className = "py-10" }: ErrorStateProps) {
  return (
    <div className={`w-full text-center font-mono text-sm text-[var(--color-text-muted)] border border-dashed border-[var(--color-border)] rounded-xl ${className}`}>
      {message}
    </div>
  );
}
