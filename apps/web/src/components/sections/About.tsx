import { MapPin, Terminal, Image as ImageIcon } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import AnimatedSection from '../ui/AnimatedSection';
import ErrorState from '../ui/ErrorState';
import Skeleton from '../ui/Skeleton';
import type { Profile } from '../../types';

export default function About({ profile, isLoading }: { profile?: Profile; isLoading: boolean }) {
  if (isLoading) {
    return (
      <section id="about" className="py-20 w-full border-t border-[var(--color-border)]">
        <AnimatedSection>
          <SectionHeader icon={Terminal} title="whoami" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
            {/* Text Content Skeleton */}
            <div className="md:col-span-2 space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <div className="flex gap-4 pt-6">
                <Skeleton className="h-6 w-32" />
              </div>
            </div>
            {/* Image Skeleton */}
            <Skeleton className="relative aspect-square rounded-xl w-full max-w-sm mx-auto" />
          </div>
        </AnimatedSection>
      </section>
    );
  }

  if (!profile) {
    return (
      <section id="about" className="py-20 w-full border-t border-[var(--color-border)]">
        <AnimatedSection>
          <SectionHeader icon={Terminal} title="whoami" />
          <ErrorState message="Biography data is temporarily unavailable." />
        </AnimatedSection>
      </section>
    );
  }
  return (
    <section id="about" className="py-20 w-full border-t border-[var(--color-border)]">
      <AnimatedSection>
        <SectionHeader icon={Terminal} title="whoami" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
          {/* Text Content */}
          <div className="md:col-span-2 space-y-6 text-[var(--color-text-muted)] leading-relaxed">
            <div className="whitespace-pre-wrap">
              {profile?.bio}
            </div>
            
            <div className="flex flex-wrap gap-6 pt-2">
              <div className="flex items-center gap-2 text-[var(--color-text)] font-mono text-sm">
                <MapPin size={16} className="text-[var(--color-primary)]" />
                <span>{profile?.location}</span>
              </div>
            </div>
          </div>

          <div className="relative group mx-auto w-4/5 md:w-full max-w-sm">
            <div className="absolute -inset-1 bg-gradient-to-r from-[var(--color-primary)] to-blue-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
            
            <div className="relative aspect-square rounded-xl bg-[var(--color-bg-subtle)] border border-[var(--color-border)] p-2 flex items-center justify-center overflow-hidden">
               {profile?.photoUrl ? (
                 <img 
                   src={profile.photoUrl} 
                   alt="Ihsan" 
                   loading="lazy"
                   decoding="async"
                   fetchPriority="low"
                   width={400}
                   height={400}
                   className="w-full h-full object-cover rounded-lg"
                 />
               ) : (
                 <div className="w-full h-full rounded-lg bg-[var(--color-terminal)] flex flex-col items-center justify-center text-[var(--color-text-muted)] border border-dashed border-[var(--color-text-muted)]/30">
                   <ImageIcon size={40} className="mb-3 opacity-40" />
                   <span className="font-mono text-xs">/assets/profile-ihsan.jpg</span>
                 </div>
               )}
            </div>
          </div>
        </div>
      </AnimatedSection>
    </section>
  );
}
