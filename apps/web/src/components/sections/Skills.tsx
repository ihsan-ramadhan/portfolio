import { motion } from 'framer-motion';
import { Terminal } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import AnimatedSection from '../ui/AnimatedSection';

const techStack = [
  { name: "Laravel", icon: "laravel", url: "https://laravel.com" },
  { name: "NestJS", icon: "nestjs", url: "https://nestjs.com" },
  { name: "Next.js", icon: "nextdotjs", url: "https://nextjs.org" },
  { name: "React", icon: "react", url: "https://react.dev" },
  { name: "Vue.js", icon: "vuedotjs", url: "https://vuejs.org" },
  { name: "Flutter", icon: "flutter", url: "https://flutter.dev" },
  { name: "TypeScript", icon: "typescript", url: "https://www.typescriptlang.org" },
  { name: "JavaScript", icon: "javascript", url: "https://www.javascript.com" },
  { name: "PHP", icon: "php", url: "https://www.php.net" },
  { name: "Java", icon: "openjdk", url: "https://www.java.com" },
  { name: "Dart", icon: "dart", url: "https://dart.dev" },
  { name: "Python", icon: "python", url: "https://www.python.org" },
  { name: "PostgreSQL", icon: "postgresql", url: "https://www.postgresql.org" },
  { name: "Redis", icon: "redis", url: "https://redis.io" },
  { name: "Supabase", icon: "supabase", url: "https://supabase.com" },
  { name: "Git", icon: "git", url: "https://git-scm.com" },
  { name: "Postman", icon: "postman", url: "https://www.postman.com" },
  { name: "Tailwind CSS", icon: "tailwindcss", url: "https://tailwindcss.com" },
  { name: "Bootstrap", icon: "bootstrap", url: "https://getbootstrap.com" },
  { name: "Docker", icon: "docker", url: "https://www.docker.com" },
];

export default function Skills() {
  const duplicatedStack = [...techStack, ...techStack];

  return (
    <section id="skills" className="py-20 w-full border-t border-[var(--color-border)] overflow-hidden">
      <div className="container mx-auto px-6 max-w-5xl mb-12">
        <AnimatedSection>
          <SectionHeader icon={Terminal} title="tech.stack" />
        </AnimatedSection>
      </div>

      <div className="relative w-full flex items-center">
        <div className="absolute inset-y-0 left-0 w-12 md:w-20 z-10 bg-gradient-to-r from-[var(--color-bg)] to-transparent pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-12 md:w-20 z-10 bg-gradient-to-l from-[var(--color-bg)] to-transparent pointer-events-none"></div>

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
                  src={`https://cdn.simpleicons.org/${tech.icon}/64748b`} 
                  alt={tech.name}
                  className="w-full h-full object-contain grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                />
              </div>
              <span className="absolute -bottom-6 font-mono text-[10px] text-[var(--color-primary)] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {tech.name}
              </span>
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}