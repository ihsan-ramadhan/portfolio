import { Terminal, Calendar } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import AnimatedSection from '../ui/AnimatedSection';
import Skeleton from '../ui/Skeleton';
import ErrorState from '../ui/ErrorState';
import { useExperiences } from '../../hooks/use-experience';

export default function Experience() {
  const { data: experiences = [], isLoading } = useExperiences();

  if (isLoading && experiences.length === 0) {
    return (
      <section id="experience" className="py-20 w-full border-t border-[var(--color-border)]">
        <AnimatedSection>
          <SectionHeader icon={Terminal} title="experience" />
          <div className="relative border-l border-[var(--color-border)] ml-3 md:ml-6 space-y-12">
            {[1, 2].map((i) => (
              <div key={i} className="relative pl-8 md:pl-10">
                <span className="absolute left-[-5px] top-1.5 flex h-2.5 w-2.5 items-center justify-center">
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--color-border)]"></span>
                </span>
                <Skeleton className="h-[120px] rounded-xl w-full" />
              </div>
            ))}
          </div>
        </AnimatedSection>
      </section>
    );
  }

  if (experiences.length === 0) {
    return (
      <section id="experience" className="py-20 w-full border-t border-[var(--color-border)]">
        <AnimatedSection>
          <SectionHeader icon={Terminal} title="experience" />
          <ErrorState message="Experience data is temporarily unavailable." />
        </AnimatedSection>
      </section>
    );
  }

  return (
    <section id="experience" className="py-20 w-full border-t border-[var(--color-border)]">
      <AnimatedSection>
        <SectionHeader icon={Terminal} title="experience" />

        <div className="relative border-l border-[var(--color-border)] ml-3 md:ml-6 space-y-12">
          {experiences.map((exp, idx) => (
            <div key={exp.id || idx} className="relative pl-8 md:pl-10 group">
              <span className="absolute left-[-5px] top-1.5 flex h-2.5 w-2.5 items-center justify-center">
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--color-primary)]"></span>
              </span>

              {/* Content Card */}
              <div className="bg-[var(--color-bg-subtle)] border border-[var(--color-border)] p-6 rounded-xl group-hover:border-[var(--color-primary)] transition-all duration-300 shadow-md">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-[var(--color-text)] font-sans">
                      {exp.position}
                    </h3>
                    <span className="text-sm font-mono text-[var(--color-primary)]">
                      {exp.company}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-mono text-[var(--color-text-muted)] bg-[var(--color-bg)] px-3 py-1 rounded-full border border-[var(--color-border)] self-start md:self-center">
                    <Calendar size={12} />
                    <span>{exp.startDate} — {exp.endDate || 'Present'}</span>
                  </div>
                </div>
                
                {exp.description && (
                  <p className="text-sm text-[var(--color-text-muted)] leading-relaxed whitespace-pre-line">
                    {exp.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </AnimatedSection>
    </section>
  );
}
