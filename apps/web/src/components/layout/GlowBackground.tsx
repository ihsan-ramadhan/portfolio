import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function GlowBackground() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const [themeTick, setThemeTick] = useState(0);

  useEffect(() => {
    const handler = () => setThemeTick(t => t + 1);
    window.addEventListener('theme-changed', handler);
    return () => window.removeEventListener('theme-changed', handler);
  }, []);

  return (
    <div key={themeTick} className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="bg-grid-pattern absolute inset-0 opacity-[0.35]" />

      <motion.div
        aria-hidden="true"
        animate={{ opacity: [0.08, 0.12, 0.08] }}
        transition={{ duration: isMobile ? 8 : 12, repeat: Infinity, ease: 'easeInOut' }}
        style={{ willChange: 'opacity' }}
        className={`absolute -top-[15%] -left-[10%] w-[400px] md:w-[600px] h-[400px] md:h-[600px] rounded-full
                   bg-[var(--color-primary)] opacity-[0.12] blur-[60px] md:blur-[120px]`}
      />

      <motion.div
        aria-hidden="true"
        animate={{ opacity: [0.05, 0.08, 0.05] }}
        transition={{ duration: isMobile ? 10 : 15, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        style={{ willChange: 'opacity' }}
        className={`absolute -bottom-[10%] -right-[8%] w-[350px] md:w-[550px] h-[350px] md:h-[550px] rounded-full
                   bg-blue-400 opacity-[0.08] blur-[50px] md:blur-[110px]`}
      />

      <motion.div
        aria-hidden="true"
        animate={{ opacity: [0.03, 0.05, 0.03] }}
        transition={{ duration: isMobile ? 12 : 18, repeat: Infinity, ease: 'easeInOut', delay: 7 }}
        style={{ willChange: 'opacity' }}
        className={`absolute top-[40%] left-[35%] w-[250px] md:w-[350px] h-[250px] md:h-[350px] rounded-full
                   bg-[var(--color-primary)] opacity-[0.05] blur-[40px] md:blur-[90px]`}
      />
    </div>
  );
}
