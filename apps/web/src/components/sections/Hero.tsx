import { motion } from 'framer-motion';
import { Terminal } from 'lucide-react';
import AsciiLogo from '../ui/AsciiLogo';
import Skeleton from '../ui/Skeleton';
import type { Profile } from '../../types';

export default function Hero({ profile, isLoading }: { profile?: Profile; isLoading: boolean }) {
  return (
    <section className="min-h-[85vh] flex flex-col justify-center items-start w-full py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
        {/* Left Side: Text Content */}
        <div className="flex flex-col items-start w-full">
          {isLoading ? (
            <Skeleton className="mb-8 w-36 h-7 rounded-full" />
          ) : (
            profile?.statusBadge && (
              <div className="mb-8 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--color-primary)] bg-[var(--color-bg-subtle)] text-[var(--color-primary)] text-xs md:text-sm font-mono shadow-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-primary)] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--color-primary)]"></span>
                </span>
                {profile.statusBadge}
              </div>
            )
          )}

          <h1 className="text-5xl md:text-7xl font-extrabold mb-4 tracking-tight">
            Hi, I'm <span className="text-[var(--color-primary)]">Ihsan</span>.
          </h1>

          {isLoading ? (
            <Skeleton className="h-8 w-64 mb-4" />
          ) : (
            <h2 className={`text-xl md:text-2xl text-[var(--color-text-muted)] max-w-2xl leading-relaxed ${profile?.tagline ? 'mb-4' : 'mb-10'}`}>
              {profile?.headline || 'Full Stack Developer'}
            </h2>
          )}

          {isLoading ? (
            <Skeleton className="h-6 w-80 mb-10" />
          ) : (
            profile?.tagline && (
              <p className="text-base md:text-lg text-[var(--color-text-muted)] opacity-85 mb-10 max-w-2xl">
                {profile.tagline}
              </p>
            )
          )}

          <div className="w-full max-w-2xl bg-[var(--color-terminal)] rounded-lg overflow-hidden border border-[var(--color-border)] shadow-2xl">
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
              <div className="relative overflow-hidden w-fit text-green-400">
                <span>$ pnpm run dev:portfolio</span>
                <motion.div
                  initial={{ x: "0%" }}
                  animate={{ x: "100%" }}
                  transition={{ duration: 1.5, delay: 0.8, ease: "linear" }}
                  className="absolute inset-y-0 right-0 left-0 bg-[var(--color-terminal)] border-l-2 border-green-400"
                />
              </div>
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
          </div>
        </div>

        {/* Right Side: Ascii Logo Visual */}
        <div className="hidden lg:block relative">
          <AsciiLogo />
        </div>
      </div>
    </section>
  );
}