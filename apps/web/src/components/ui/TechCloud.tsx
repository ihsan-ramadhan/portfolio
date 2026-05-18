import { useMemo } from 'react';
import { motion } from 'framer-motion';

const techIcons = [
  { name: "React", icon: "react" },
  { name: "Next.js", icon: "nextdotjs" },
  { name: "Vue.js", icon: "vuedotjs"},
  { name: "Laravel", icon: "laravel" },
  { name: "NestJS", icon: "nestjs" },
  { name: "Flutter", icon: "flutter" },
  { name: "PostgreSQL", icon: "postgresql" },
  { name: "MongoDB", icon: "mongodb" },
];

export default function TechCloud() {
  const cloudItems = useMemo(() => {
    return techIcons.map((tech, idx) => {
      const duration = 3 + (idx % 3);
      
      return {
        ...tech,
        x: Math.sin(idx * 2.2) * 220,
        y: Math.cos(idx * 1.7) * 180,
        duration: duration,
        delay: idx * 0.1
      };
    });
  }, []);

  return (
    <div className="relative w-full h-[400px] hidden lg:flex items-center justify-center">
      {cloudItems.map((item) => (
        <motion.div
          key={item.name}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: 0.6, 
            scale: 1,
            x: item.x,
            y: item.y,
          }}
          whileHover={{ 
            opacity: 1, 
            scale: 1.2, 
            zIndex: 10,
            transition: { duration: 0.2 } 
          }}
          style={{ willChange: 'transform' }}
          transition={{
            x: {
              duration: item.duration,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut"
            },
            y: {
              duration: item.duration * 1.2,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "easeInOut"
            },
            opacity: { duration: 1, delay: item.delay },
            scale: { duration: 0.5, delay: item.delay }
          }}
          className="absolute p-4 rounded-2xl bg-[var(--color-bg-subtle)] border border-[var(--color-border)] shadow-sm backdrop-blur-sm cursor-default group"
        >
          <img
            src={`https://cdn.simpleicons.org/${item.icon}/3b82f6`}
            alt={item.name}
            loading="lazy"
            decoding="async"
            className="w-8 h-8 object-contain transition-transform group-hover:rotate-12"
          />
          <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-mono text-[var(--color-primary)] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            {item.name}
          </span>
        </motion.div>
      ))}
      
      <div className="absolute w-32 h-32 bg-[var(--color-primary)] opacity-5 blur-[80px] rounded-full animate-pulse" />
    </div>
  );
}
