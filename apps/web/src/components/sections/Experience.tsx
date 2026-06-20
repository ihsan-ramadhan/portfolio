import { Terminal, Calendar } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import AnimatedSection from '../ui/AnimatedSection';
import Skeleton from '../ui/Skeleton';
import ErrorState from '../ui/ErrorState';
import { useExperiences } from '../../hooks/use-experience';

export default function Experience() {
  const { data: experiences = [], isLoading } = useExperiences();

  return (
    <section id="experience" className="py-20 w-full border-t border-border">
      <AnimatedSection>
        <SectionHeader icon={Terminal} title="experience" />

        {isLoading ? (
          <div className="relative border-l border-border ml-3 md:ml-6 space-y-12">
            {[1, 2].map((i) => (
              <div key={i} className="relative pl-8 md:pl-10">
                <span className="absolute -left-1.25 top-1.5 flex h-2.5 w-2.5 items-center justify-center">
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-border"></span>
                </span>
                <Skeleton className="h-30 rounded-xl w-full" />
              </div>
            ))}
          </div>
        ) : experiences.length === 0 ? (
          <ErrorState message="Experience data is temporarily unavailable." />
        ) : (
          <div className="relative border-l border-border ml-3 md:ml-6 space-y-12">
            {experiences.map((exp, idx) => (
              <div key={exp.id || idx} className="relative pl-8 md:pl-10 group">
                <span className="absolute -left-1.25 top-1.5 flex h-2.5 w-2.5 items-center justify-center">
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
                </span>

                <div className="glass-panel hover-glow p-6 rounded-xl shadow-md">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-text font-sans">
                        {exp.position}
                      </h3>
                      <span className="text-sm font-mono text-primary">
                        {exp.company}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-mono text-text-muted bg-bg px-3 py-1 rounded-full border border-border self-start md:self-center">
                      <Calendar size={12} />
                      <span>{exp.startDate} — {exp.endDate || 'Present'}</span>
                    </div>
                  </div>

                  {exp.description && (
                    <p className="text-sm text-text-muted leading-relaxed whitespace-pre-line">
                      {exp.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </AnimatedSection>
    </section>
  );
}
