import { motion } from 'framer-motion';

export default function GlowBackground() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="bg-grid-pattern absolute inset-0 opacity-[0.35]" />

      <motion.div
        aria-hidden="true"
        animate={isMobile ? { opacity: [0.08, 0.12, 0.08] } : { x: [0, 40, 10, 0], y: [0, 60, 20, 0] }}
        transition={{ duration: isMobile ? 8 : 18, repeat: Infinity, ease: 'easeInOut' }}
        className={`absolute -top-[15%] -left-[10%] w-[400px] md:w-[600px] h-[400px] md:h-[600px] rounded-full
                   bg-[var(--color-primary)] opacity-[0.12] ${isMobile ? 'blur-[60px]' : 'blur-[120px]'}`}
      />

      <motion.div
        aria-hidden="true"
        animate={isMobile ? { opacity: [0.05, 0.08, 0.05] } : { x: [0, -60, -20, 0], y: [0, 30, -30, 0] }}
        transition={{ duration: isMobile ? 10 : 22, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        className={`absolute -bottom-[10%] -right-[8%] w-[350px] md:w-[550px] h-[350px] md:h-[550px] rounded-full
                   bg-blue-400 opacity-[0.08] ${isMobile ? 'blur-[50px]' : 'blur-[110px]'}`}
      />

      <motion.div
        aria-hidden="true"
        animate={isMobile ? { opacity: [0.03, 0.05, 0.03] } : { x: [0, 30, -20, 0], y: [0, -40, 20, 0] }}
        transition={{ duration: isMobile ? 12 : 26, repeat: Infinity, ease: 'easeInOut', delay: 7 }}
        className={`absolute top-[40%] left-[35%] w-[250px] md:w-[350px] h-[250px] md:h-[350px] rounded-full
                   bg-[var(--color-primary)] opacity-[0.05] ${isMobile ? 'blur-[40px]' : 'blur-[90px]'}`}
      />
    </div>
  );
}
