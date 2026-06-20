import { Terminal } from 'lucide-react';
import AnimatedSection from '../ui/AnimatedSection';
import SectionHeader from '../ui/SectionHeader';
import ErrorState from '../ui/ErrorState';
import Skeleton from '../ui/Skeleton';
import { useSkills } from '../../hooks/use-skills';

export default function Skills() {
  const { data: skills = [], isLoading } = useSkills();

  const displaySkills = skills.map(s => ({
    name: s.name,
    icon: s.icon || s.name.toLowerCase().replace(/[^a-z0-9]/g, ''),
    url: s.url || `https://google.com/search?q=${encodeURIComponent(s.name)}`
  }));

  const multiplier = displaySkills.length < 8 ? 4 : 2;
  const duplicatedStack = Array(multiplier).fill(displaySkills).flat();

  return (
    <section id="skills" className="py-20 w-full border-t border-border overflow-hidden">
      <AnimatedSection>
        <div className="w-full mb-12">
          <SectionHeader icon={Terminal} title="tech.stack" />
        </div>

        <div className="relative w-full flex items-center overflow-hidden">
          {isLoading ? (
            <div className="flex gap-8 py-4 overflow-hidden w-full justify-center flex-wrap md:flex-nowrap">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((i) => (
                <div key={i} className="flex flex-col items-center gap-2 shrink-0">
                  <Skeleton className="w-14 h-14 md:w-16 md:h-16 rounded-xl" />
                  <Skeleton className="w-12 h-3" />
                </div>
              ))}
            </div>
          ) : skills.length === 0 ? (
            <ErrorState message="Tech stack data is temporarily unavailable." />
          ) : (
            <div className="animate-marquee pt-4 pb-10">
              {duplicatedStack.map((tech, index) => (
                <a
                  key={index}
                  href={tech.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex flex-col items-center justify-center transition-transform hover:scale-110 mr-16"
                  title={tech.name}
                >
                  <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center p-3 rounded-xl glass-panel group-hover:border-primary group-hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all duration-300">
                    <img
                      src={`https://cdn.simpleicons.org/${tech.icon}/3b82f6`}
                      alt={tech.name}
                      className="w-full h-full object-contain opacity-60 group-hover:opacity-100 transition-all duration-300"
                    />
                  </div>
                  <span className="absolute -bottom-6 font-mono text-[10px] text-primary opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {tech.name}
                  </span>
                </a>
              ))}
            </div>
          )}
        </div>
      </AnimatedSection>
    </section>
  );
}