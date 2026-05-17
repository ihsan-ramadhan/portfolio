import { motion } from 'framer-motion';
import { Github, Terminal} from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import AnimatedSection from '../ui/AnimatedSection';

import { useProjects } from '../../hooks/use-projects';
import { FALLBACK_PROJECTS } from '../../constants';

export default function Projects() {
  const { data: projects = FALLBACK_PROJECTS, isLoading: loading } =
    useProjects();

  return (
    <section id="projects" className="py-20 w-full border-t border-[var(--color-border)]">
      <AnimatedSection>
        <SectionHeader 
          icon={Terminal} 
          title="ls ./projects" 
          subtitle={`Total items: ${projects.length}`}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="h-[400px] bg-[var(--color-bg-subtle)] rounded-xl border border-[var(--color-border)] animate-pulse" />
            ))
          ) : (
            projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative flex flex-col bg-[var(--color-bg-subtle)] border border-[var(--color-border)] rounded-xl overflow-hidden hover:border-[var(--color-primary)] transition-all duration-300"
              >
                {/* Project Placeholder Icon */}
                <div className="relative aspect-video overflow-hidden bg-[var(--color-bg)] flex items-center justify-center border-b border-[var(--color-border)]">
                  <div className="flex flex-col items-center gap-3 opacity-20 group-hover:opacity-40 transition-opacity">
                    <Terminal size={48} className="text-[var(--color-primary)]" />
                    <span className="font-mono text-xs uppercase tracking-widest">{project.language || 'Repository'}</span>
                  </div>
                </div>

                {/* Project Info */}
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold mb-3 group-hover:text-[var(--color-primary)] transition-colors font-mono">
                    {project.name}
                  </h3>
                  <p className="text-sm text-[var(--color-text-muted)] mb-6 line-clamp-3 leading-relaxed">
                    {project.description || 'No description provided.'}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6 mt-auto">
                    {/* Combine language and custom tags */}
                    {[project.language, ...(project.tags || [])].filter(Boolean).map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 text-[10px] font-mono font-bold bg-[var(--color-bg)] text-[var(--color-primary)] border border-[var(--color-border)] rounded-md uppercase tracking-wider shadow-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 pt-4 border-t border-[var(--color-border)]">
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors flex items-center gap-2 text-xs font-mono"
                    >
                      <Github size={18} /> View Code
                    </a>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </AnimatedSection>
    </section>
  );
}