import ThemeToggle from './components/layout/ThemeToggle';

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-md w-full bg-[var(--color-bg-subtle)] border border-[var(--color-border)] p-8 rounded-lg shadow-lg text-center space-y-6">
        <h1 className="text-3xl font-bold text-[var(--color-primary)] font-mono">
          System.out.println("Hello, Ihsan!");
        </h1>
        <p className="text-[var(--color-text-muted)]">
          Portofolio Full-Stack dengan Vite, NestJS, dan Tailwind v4.
        </p>
        
        <div className="flex justify-center pt-4">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}

export default App;