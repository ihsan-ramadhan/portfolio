import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Home, User, Briefcase, Code, Mail, Sun, Terminal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Command {
  id: string;
  title: string;
  icon: React.ElementType;
  action: () => void;
  category: string;
}

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const toggleTheme = () => {
    const isDark = document.documentElement.classList.contains('dark');
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  };

  const scrollTo = (id: string) => {
    navigate('/');
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const commands: Command[] = [
    { id: 'home', title: 'Go to Home', icon: Home, category: 'Navigation', action: () => scrollTo('hero') },
    { id: 'about', title: 'Go to About', icon: User, category: 'Navigation', action: () => scrollTo('about') },
    { id: 'skills', title: 'Go to Skills', icon: Code, category: 'Navigation', action: () => scrollTo('skills') },
    { id: 'projects', title: 'Go to Projects', icon: Briefcase, category: 'Navigation', action: () => scrollTo('projects') },
    { id: 'contact', title: 'Go to Contact', icon: Mail, category: 'Navigation', action: () => scrollTo('contact') },
    { id: 'admin', title: 'Open Admin Dashboard', icon: Terminal, category: 'System', action: () => navigate('/admin') },
    { id: 'theme', title: 'Toggle Theme', icon: Sun, category: 'System', action: toggleTheme },
  ];

  const filteredCommands = commands.filter((cmd) =>
    cmd.title.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        setSearch('');
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleSelect = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredCommands.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        handleSelect(filteredCommands[selectedIndex].action);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-xl bg-[var(--color-bg)] border border-[var(--color-border)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[60vh]"
          >
            <div className="flex items-center px-4 py-3 border-b border-[var(--color-border)]">
              <Search className="w-5 h-5 text-[var(--color-text-muted)] mr-3" />
              <input
                ref={inputRef}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Type a command or search..."
                className="flex-1 bg-transparent border-none outline-none text-[var(--color-text)] font-mono text-sm placeholder:text-[var(--color-text-muted)]"
              />
              <div className="flex items-center gap-1 text-[var(--color-text-muted)]">
                <kbd className="bg-[var(--color-bg-subtle)] border border-[var(--color-border)] rounded px-1.5 py-0.5 text-[10px] font-mono">ESC</kbd>
              </div>
            </div>

            <div className="overflow-hidden p-2 flex-1">
              {filteredCommands.length === 0 ? (
                <div className="py-8 text-center text-sm font-mono text-[var(--color-text-muted)]">
                  No results found.
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredCommands.map((cmd, index) => {
                    const isSelected = index === selectedIndex;
                    return (
                      <button
                        key={cmd.id}
                        onClick={() => handleSelect(cmd.action)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`w-full flex items-center px-3 py-3 rounded-xl transition-colors text-left group ${
                          isSelected 
                            ? 'bg-[var(--color-bg-subtle)] text-[var(--color-primary)]' 
                            : 'hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-primary)]'
                        }`}
                      >
                        <cmd.icon className={`w-4 h-4 mr-3 transition-colors ${
                          isSelected ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)]'
                        }`} />
                        <span className={`font-mono text-sm flex-1 ${
                          isSelected ? 'text-[var(--color-primary)]' : 'text-[var(--color-text)]'
                        }`}>{cmd.title}</span>
                        <span className={`text-[10px] uppercase font-mono transition-colors ${
                          isSelected ? 'text-[var(--color-primary)]/70' : 'text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)]/70'
                        }`}>{cmd.category}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            
            <div className="border-t border-[var(--color-border)] px-4 py-2 bg-[var(--color-bg-subtle)] flex items-center justify-between">
              <span className="text-[10px] font-mono text-[var(--color-text-muted)]">
                Navigation Menu
              </span>
              <span className="text-[10px] font-mono text-[var(--color-text-muted)]">
                <kbd className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded px-1.5 py-0.5 mx-0.5 text-[10px] font-mono">↑</kbd>
                <kbd className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded px-1.5 py-0.5 mx-0.5 text-[10px] font-mono">↓</kbd>
                to navigate
              </span>
              <span className="text-[10px] font-mono text-[var(--color-text-muted)]">
                <kbd className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded px-1.5 py-0.5 mx-0.5 text-[10px] font-mono">↵</kbd>
                to select
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
