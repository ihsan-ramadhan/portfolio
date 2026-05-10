import { motion } from 'framer-motion';
import { Terminal, Github, Code2, Rocket } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import Badge from '../ui/Badge';

const projects = [
  {
    title: "Project Alpha",
    description: "A high-performance web application built with NestJS and Next.js, featuring real-time data synchronization.",
    tags: ["NestJS", "Next.js", "PostgreSQL"],
    github: "https://github.com/ihsan-ramadhan",
    demo: "#",
    category: "Web"
  },
  {
    title: "Mobile Logbook",
    description: "Cross-platform mobile application for activity tracking with offline-first capabilities using Flutter.",
    tags: ["Flutter", "Dart", "Supabase"],
    github: "https://github.com/ihsan-ramadhan",
    demo: "#",
    category: "Mobile"
  },
  {
    title: "Defense Simulation",
    description: "A strategic defense game developed using Godot Engine with complex AI pathfinding and upgrade systems.",
    tags: ["Godot", "C#", "GameDev"],
    github: "https://github.com/ihsan-ramadhan",
    demo: "#",
    category: "Game"
  }
];

export default function Projects() {
  return (
    <section id="projects" className="py-20 w-full border-t border-[var(--color-border)]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <SectionHeader 
          icon={Terminal} 
          title="ls ./projects" 
          subtitle={`Total items: ${projects.length}`}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group relative flex flex-col bg-[var(--color-bg-subtle)] border border-[var(--color-border)] rounded-xl overflow-hidden hover:border-[var(--color-primary)] transition-all duration-300 shadow-sm hover:shadow-[0_0_20px_rgba(59,130,246,0.1)]"
            >
              <div className="aspect-video bg-[var(--color-terminal)] flex items-center justify-center border-b border-[var(--color-border)] group-hover:border-[var(--color-primary)] transition-colors">
                <Code2 size={48} className="text-[var(--color-text-muted)] opacity-20 group-hover:opacity-40 transition-opacity" />
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold font-mono text-[var(--color-text)]">{project.title}</h3>
                  <Badge>{project.category}</Badge>
                </div>
                
                <p className="text-sm text-[var(--color-text-muted)] mb-6 line-clamp-3 leading-relaxed">
                  {project.description}
                </p>

                <div className="mt-auto">
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags.map(tag => (
                      <Badge key={tag} variant="ghost">#{tag}</Badge>
                    ))}
                  </div>

                  <div className="flex items-center gap-4">
                    <a href={project.github} className="flex items-center gap-2 text-sm font-mono hover:text-[var(--color-primary)] transition-colors">
                      <Github size={16} /> Code
                    </a>
                    <a href={project.demo} className="flex items-center gap-2 text-sm font-mono hover:text-[var(--color-primary)] transition-colors">
                      <Rocket size={16} /> Live Demo
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}