import ThemeToggle from './components/layout/ThemeToggle';
import Hero from './components/sections/Hero';
import About from './components/sections/About';

function App() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] transition-colors duration-300">
      <header className="sticky top-0 z-50 w-full border-b border-[var(--color-border)] bg-[var(--color-bg)]/80 backdrop-blur-md">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between max-w-5xl">
          <span className="font-mono font-bold text-xl tracking-tighter">
            ihsan<span className="text-[var(--color-primary)]">.dev</span>
          </span>
          <nav className="flex items-center gap-4">
            <ThemeToggle />
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-6 max-w-5xl">
        <Hero />
        <About />
      </main>
    </div>
  );
}

export default App;