import { motion } from 'framer-motion';
import { Terminal } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import AnimatedSection from '../ui/AnimatedSection';
import { useSkills } from '../../hooks/use-skills';
import { FALLBACK_SKILLS } from '../../constants';

export default function Skills() {
  const { data: skills = [], isLoading } = useSkills();

  const displaySkills = skills.length > 0 ? skills.map(s => ({
    name: s.name,
    icon: s.icon || s.name.toLowerCase().replace(/[^a-z0-9]/g, ''),
    url: `https://google.com/search?q=${encodeURIComponent(s.name)}`
  })) : FALLBACK_SKILLS;

  const duplicatedStack = [...displaySkills, ...displaySkills];

  return (
    <section id="skills" className="py-20 w-full border-t border-[var(--color-border)] overflow-hidden">
      <div className="w-full mb-12">
        <AnimatedSection>
          <SectionHeader icon={Terminal} title="tech.stack" />
        </AnimatedSection>
      </div>

      <div className="relative w-full flex items-center">
        {isLoading && skills.length === 0 ? (
          <div className="w-full py-12 text-center font-mono text-[var(--color-text-muted)] animate-pulse">
            Loading tech stack...
          </div>
        ) : (
          <motion.div
            className="flex whitespace-nowrap gap-16 py-4"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              ease: "linear",
              duration: 40, 
              repeat: Infinity,
            }}
          >
            {duplicatedStack.map((tech, index) => (
              <a
                key={index}
                href={tech.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col items-center justify-center transition-transform hover:scale-110"
                title={tech.name}
              >
                <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center p-3 rounded-xl bg-[var(--color-bg-subtle)] border border-[var(--color-border)] group-hover:border-[var(--color-primary)] group-hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all duration-300">
                  <img
                    src={`https://cdn.simpleicons.org/${tech.icon}/3b82f6`} 
                    alt={tech.name}
                    className="w-full h-full object-contain opacity-60 group-hover:opacity-100 transition-all duration-300"
                  />
                </div>
                <span className="absolute -bottom-6 font-mono text-[10px] text-[var(--color-primary)] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {tech.name}
                </span>
              </a>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}