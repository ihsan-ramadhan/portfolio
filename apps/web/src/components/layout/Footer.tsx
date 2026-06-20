import { Github, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-12 border-t border-[var(--color-border)]/50 bg-white/40 dark:bg-[#030712]/40 backdrop-blur-md">
      <div className="w-full px-4 md:px-8 lg:px-16 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start gap-2">
          <span className="font-mono font-bold text-lg tracking-tighter">
            ihsan<span className="text-[var(--color-primary)]">.is-a.dev</span>
          </span>
          <p className="text-[var(--color-text-muted)] font-mono text-xs text-center md:text-left">
            © {currentYear} - Muhammad Ihsan Ramadhan
          </p>
        </div>
        
        <div className="flex items-center gap-6 text-[var(--color-text-muted)]">
          <a href="https://github.com/ihsan-ramadhan" target="_blank" rel="noopener noreferrer" aria-label="GitHub Profile" className="hover:text-[var(--color-primary)] transition-colors">
            <Github size={18} />
          </a>
          <a href="https://linkedin.com/in/m-ihsan-r" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn Profile" className="hover:text-[var(--color-primary)] transition-colors">
            <Linkedin size={18} />
          </a>
          <a href="mailto:m.ihsan.r30@gmail.com" aria-label="Email Me" className="hover:text-[var(--color-primary)] transition-colors">
            <Mail size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
}