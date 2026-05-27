import { GraduationCap, Calendar } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import AnimatedSection from '../ui/AnimatedSection';
import { useEducations } from '../../hooks/use-education';

export default function Education() {
  const { data: educations = [], isLoading } = useEducations();

  if (isLoading && educations.length === 0) {
    return (
      <section id="education" className="py-20 w-full border-t border-[var(--color-border)]">
        <div className="text-center font-mono text-[var(--color-text-muted)] animate-pulse">
          Loading education history...
        </div>
      </section>
    );
  }

  return (
    <section id="education" className="py-20 w-full border-t border-[var(--color-border)]">
      <AnimatedSection>
        <SectionHeader icon={GraduationCap} title="education" />

        <div className="relative border-l border-[var(--color-border)] ml-3 md:ml-6 space-y-12">
          {educations.map((edu, idx) => (
            <div key={edu.id || idx} className="relative pl-8 md:pl-10 group">
              <span className="absolute left-[-5px] top-1.5 flex h-2.5 w-2.5 items-center justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-primary)] opacity-30 group-hover:opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[var(--color-primary)]"></span>
              </span>

              <div className="bg-[var(--color-bg-subtle)] border border-[var(--color-border)] p-6 rounded-xl group-hover:border-[var(--color-primary)] transition-all duration-300 shadow-md">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-[var(--color-text)] font-sans">
                      {edu.institution}
                    </h3>
                    <span className="text-sm font-mono text-[var(--color-primary)]">
                      {edu.major}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-mono text-[var(--color-text-muted)] bg-[var(--color-bg)] px-3 py-1 rounded-full border border-[var(--color-border)] self-start md:self-center">
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
