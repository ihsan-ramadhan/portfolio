import { motion } from 'framer-motion';

export default function GlowBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">

      <div className="bg-grid-pattern absolute inset-0 opacity-[0.35]" />

      <motion.div
        aria-hidden="true"
        animate={{ x: [0, 40, 10, 0], y: [0, 60, 20, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-[15%] -left-[10%] w-[600px] h-[600px] rounded-full
                   bg-[var(--color-primary)] opacity-[0.12] blur-[120px]"
      />

      <motion.div
        aria-hidden="true"
        animate={{ x: [0, -60, -20, 0], y: [0, 30, -30, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        className="absolute -bottom-[10%] -right-[8%] w-[550px] h-[550px] rounded-full
                   bg-blue-400 opacity-[0.08] blur-[110px]"
      />

      <motion.div
        aria-hidden="true"
        animate={{ x: [0, 30, -20, 0], y: [0, -40, 20, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut', delay: 7 }}
        className="absolute top-[40%] left-[35%] w-[350px] h-[350px] rounded-full
                   bg-[var(--color-primary)] opacity-[0.05] blur-[90px]"
      />
    </div>
  );
}
