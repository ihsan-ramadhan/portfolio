import { motion } from 'framer-motion';
import { Terminal } from 'lucide-react';
import TechCloud from '../ui/TechCloud';
import type { Profile } from '../../types';

export default function Hero({ profile }: { profile: Profile | null }) {
  return (
    <section className="min-h-[85vh] flex flex-col justify-center items-start w-full py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
        {/* Left Side: Text Content */}
        <div className="flex flex-col items-start">
          {profile?.statusBadge && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--color-primary)] bg-[var(--color-bg-subtle)] text-[var(--color-primary)] text-xs md:text-sm font-mono shadow-sm"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-primary)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--color-primary)]"></span>
              </span>
              {profile.statusBadge}
            </motion.div>
          )}

          <motion.h1
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold mb-4 tracking-tight"
          >
            Hi, I'm <span className="text-[var(--color-primary)]">Ihsan</span>.
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className={`text-xl md:text-2xl text-[var(--color-text-muted)] max-w-2xl leading-relaxed ${profile?.tagline ? 'mb-4' : 'mb-10'}`}
          >
            {profile?.headline || 'Full Stack Developer'}
          </motion.h2>

          {profile?.tagline && (
            <motion.p
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-base md:text-lg text-[var(--color-text-muted)] opacity-85 mb-10 max-w-2xl"
            >
              {profile.tagline}
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="w-full max-w-2xl bg-[var(--color-terminal)] rounded-lg overflow-hidden border border-[var(--color-border)] shadow-2xl"
          >
            <div className="flex items-center px-4 py-3 bg-[#0A0F1E]/50 border-b border-[var(--color-border)]">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <div className="mx-auto flex items-center gap-2 text-xs text-slate-400 font-mono">
                <Terminal size={14} /> guest@ihsan-portfolio:~
              </div>
            </div>
            
            <div className="p-5 font-mono text-sm md:text-base">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.5, delay: 0.8, ease: "linear" }}
                className="overflow-hidden whitespace-nowrap border-r-2 border-green-400 pr-2 text-green-400"
              >
                $ pnpm run dev:portfolio
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5 }}
                className="text-slate-200 mt-3 leading-loose"
              >
                <span className="text-blue-400">{'>'}</span> Initializing stack... [OK]<br/>
                <span className="text-blue-400">{'>'}</span> Loading projects module... [OK]<br/>
                <span className="text-green-400">{'>'}</span> System ready. Scroll to explore.
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Tech Cloud Visual */}
        <div className="hidden lg:block relative">
          <TechCloud />
        </div>
      </div>
    </section>
  );
}