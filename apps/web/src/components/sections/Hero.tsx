import AsciiLogo from '../ui/AsciiLogo';
import GitHubActivity from './GitHubActivity';
import type { Profile } from '../../types';

export default function Hero({ profile }: { profile?: Profile; isLoading?: boolean }) {
  return (
    <section className="min-h-[85vh] flex flex-col justify-center items-start w-full py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
        {/* Left Side: Text Content */}
        <div className="flex flex-col items-start w-full">
          {profile?.statusBadge && (
            <div className="mb-8 inline-flex items-center gap-1.5 px-3 py-1 rounded-md border border-[var(--color-border)] bg-[var(--color-bg-subtle)] text-xs md:text-sm font-mono text-[var(--color-text-muted)] select-none">
              <span className="text-[var(--color-primary)] font-bold">--status</span>
              <span>=</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">"{profile.statusBadge}"</span>
            </div>
          )}

          <h1 className="text-5xl md:text-7xl font-extrabold mb-4 tracking-tight">
            Hi, I'm <span className="text-[var(--color-primary)]">Ihsan</span>.
          </h1>

          <h2 className={`text-xl md:text-2xl text-[var(--color-text-muted)] max-w-2xl leading-relaxed ${profile?.tagline ? 'mb-4' : 'mb-10'}`}>
            {profile?.headline || 'Full Stack Developer'}
          </h2>

          {profile?.tagline && (
            <p className="text-base md:text-lg text-[var(--color-text-muted)] opacity-85 mb-10 max-w-2xl">
              {profile.tagline}
            </p>
          )}

          <GitHubActivity />
        </div>

        {/* Right Side: Ascii Logo Visual */}
        <div className="hidden lg:block relative">
          <AsciiLogo />
        </div>
      </div>
    </section>
  );
}