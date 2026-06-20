import AsciiLogo from '../ui/AsciiLogo';
import AnimatedSection from '../ui/AnimatedSection';
import GitHubActivity from './GitHubActivity';
import type { Profile } from '../../types';

export default function Hero({ profile }: { profile?: Profile; isLoading?: boolean }) {
  return (
    <section id="hero" className="min-h-[85vh] flex flex-col justify-center items-start w-full py-12">
      <AnimatedSection className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
        {/* Left Side: Text Content */}
        <div className="flex flex-col items-start w-full">
          {profile?.statusBadge && (
            <div className="mb-8 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border bg-bg-subtle/80 backdrop-blur-sm text-xs md:text-sm font-mono text-text-muted select-none shadow-sm">
              <span className="text-secondary font-bold">--status</span>
              <span>=</span>
              <span className="text-primary-dim font-semibold">"{profile.statusBadge}"</span>
            </div>
          )}

          <h1 className="text-5xl md:text-7xl font-extrabold mb-4 tracking-tight leading-none">
            Hi, I'm <span className="text-gradient-primary">Ihsan</span>.
          </h1>

          <h2 className={`text-xl md:text-2xl text-text-muted max-w-2xl leading-relaxed font-mono ${profile?.tagline ? 'mb-4' : 'mb-10'}`}>
            {profile?.headline || 'Full Stack Developer'}
          </h2>

          {profile?.tagline && (
            <p className="text-base md:text-lg text-text-muted opacity-85 mb-10 max-w-2xl">
              {profile.tagline}
            </p>
          )}

          <GitHubActivity />
        </div>

        {/* Right Side: Ascii Logo Visual */}
        <div className="hidden lg:block relative">
          <AsciiLogo />
        </div>
      </AnimatedSection>
    </section>
  );
}