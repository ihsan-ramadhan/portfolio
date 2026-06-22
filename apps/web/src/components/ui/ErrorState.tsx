
interface ErrorStateProps {
  message: string;
  className?: string;
}

export default function ErrorState({ message, className = "py-10" }: ErrorStateProps) {
  return (
    <div className={`w-full text-center font-mono text-sm text-text-muted border border-dashed border-border rounded-md ${className}`}>
      {message}
    </div>
  );
}
