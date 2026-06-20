import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import { useSections } from '../../hooks/use-sections';

const sectionMapping: Record<string, { name: string; href: string }> = {
  about: { name: "About", href: "#about" },
  skills: { name: "Stacks", href: "#skills" },
  projects: { name: "Projects", href: "#projects" },
  experience: { name: "Experience", href: "#experience" },
  education: { name: "Education", href: "#education" },
  contact: { name: "Contact", href: "#contact" },
};

export default function Navbar() {
  const { data: sections = [] } = useSections();
  
  const navLinks = sections
    .filter((sec) => sec.isEnabled && sectionMapping[sec.name])
    .map((sec) => sectionMapping[sec.name]);
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsOpen(false);
    
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
      scrolled 
      ? "bg-bg-subtle/65 backdrop-blur-md border-border py-3 shadow-sm shadow-border/10"
      : "bg-transparent border-transparent py-4"
    }`}>
      <div className="w-full px-4 md:px-8 lg:px-16 flex items-center justify-between">
        <a 
          href="#" 
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="font-mono font-bold text-xl tracking-tighter z-50 group hover:opacity-95 transition-opacity"
        >
          ihsan<span className="text-primary group-hover:text-secondary transition-colors duration-300">.is-a.dev</span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              onClick={(e) => handleScrollClick(e, link.href)}
              className="relative text-sm font-mono text-text-muted hover:text-primary transition-colors py-1 group"
            >
              {link.name}
              <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-gradient-to-r from-primary to-secondary transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
          <ThemeToggle />
        </div>

        <div className="flex md:hidden items-center gap-4 z-50">
          <ThemeToggle />
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="text-text p-1"
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: '100vh' }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed inset-0 bg-bg z-40 flex flex-col items-center justify-center gap-8 md:hidden"
          >
            {navLinks.map((link, idx) => (
              <motion.a
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={link.name}
                href={link.href}
                onClick={(e) => handleScrollClick(e, link.href)}
                className="text-2xl font-mono font-bold hover:text-primary"
              >
                {link.name}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}