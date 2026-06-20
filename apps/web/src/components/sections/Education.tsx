import { Terminal, Calendar } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import AnimatedSection from '../ui/AnimatedSection';
import Skeleton from '../ui/Skeleton';
import ErrorState from '../ui/ErrorState';
import { useEducations } from '../../hooks/use-education';

export default function Education() {
  const { data: educations = [], isLoading } = useEducations();

  if (isLoading && educations.length === 0) {
    return (
      <section id="education" className="py-20 w-full border-t border-border">
        <AnimatedSection>
          <SectionHeader icon={Terminal} title="education" />
          <div className="relative border-l border-border ml-3 md:ml-6 space-y-12">
            {[1, 2].map((i) => (
              <div key={i} className="relative pl-8 md:pl-10">
                <span className="absolute -left-1.25 top-1.5 flex h-2.5 w-2.5 items-center justify-center">
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-border"></span>
                </span>
                <Skeleton className="h-22.5 rounded-xl w-full" />
              </div>
            ))}
          </div>
        </AnimatedSection>
      </section>
    );
  }

  if (educations.length === 0) {
    return (
      <section id="education" className="py-20 w-full border-t border-border">
        <AnimatedSection>
          <SectionHeader icon={Terminal} title="education" />
          <ErrorState message="Education data is temporarily unavailable." />
        </AnimatedSection>
      </section>
    );
  }

  return (
    <section id="education" className="py-20 w-full border-t border-border">
      <AnimatedSection>
        <SectionHeader icon={Terminal} title="education" />

        <div className="relative border-l border-border ml-3 md:ml-6 space-y-12">
          {educations.map((edu, idx) => (
            <div key={edu.id || idx} className="relative pl-8 md:pl-10 group">
              <span className="absolute -left-1.25 top-1.5 flex h-2.5 w-2.5 items-center justify-center">
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
              </span>

              <div className="glass-panel hover-glow p-6 rounded-xl shadow-md">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-text font-sans">
                      {edu.institution}
                    </h3>
                    <span className="text-sm font-mono text-primary">
                      {edu.major}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-mono text-text-muted bg-bg px-3 py-1 rounded-full border border-border self-start md:self-center">
                    <Calendar size={12} />
                    <span>{edu.startYear} — {edu.endYear || 'Present'}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </AnimatedSection>
    </section>
  );
}
