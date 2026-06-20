import { motion } from 'framer-motion';
import { Github, Terminal } from 'lucide-react';
import SectionHeader from '../ui/SectionHeader';
import AnimatedSection from '../ui/AnimatedSection';
import ErrorState from '../ui/ErrorState';
import Skeleton from '../ui/Skeleton';

import { useProjects } from '../../hooks/use-projects';

export default function Projects() {
  const { data: projects = [], isLoading: loading } = useProjects();

  return (
    <section id="projects" className="py-20 w-full border-t border-border">
      <AnimatedSection>
        <SectionHeader 
          icon={Terminal} 
          title="projects" 
        />

        <div className="flex flex-col gap-20 md:gap-28">
          {loading ? (
            [0, 1].map((i) => {
              const isEven = i % 2 === 0;
              return (
                <div 
                  key={i} 
                  className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 lg:gap-16 items-center w-full`}
                >
                  <Skeleton className="w-full lg:w-[45%] aspect-video rounded-xl" />
                  <div className="w-full lg:w-[55%] space-y-4">
                    <Skeleton className="h-5 w-12" />
                    <Skeleton className="h-8 w-1/2" />
                    <Skeleton className="h-24 w-full" />
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                  </div>
                </div>
              );
            })
          ) : projects.length === 0 ? (
            <ErrorState message="Projects data is temporarily unavailable." />
          ) : (
            projects.map((project, index) => {
              const isEven = index % 2 === 0;
              const projectNum = String(index + 1).padStart(2, '0');
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.6 }}
                  className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-8 lg:gap-16 items-center w-full group py-4`}
                >
                  <div className="w-full lg:w-[45%] aspect-video glass-panel hover-glow rounded-xl overflow-hidden shrink-0 relative shadow-xl">
                    {project.imageUrl ? (
                      <img
                        src={project.imageUrl}
                        alt={project.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col p-4 font-mono text-xs text-text-muted justify-between select-none">
                        <div className="flex flex-col items-center justify-center grow gap-3 opacity-30 group-hover:opacity-60 group-hover:text-primary transition-all duration-300">
                          <Terminal size={48} className="text-primary" />
                          <span className="font-bold tracking-widest text-xs uppercase">{project.language || 'source-code'}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="w-full lg:w-[55%] flex flex-col">
                    <div className="font-mono text-xs md:text-sm text-primary font-bold mb-2 tracking-widest">
                      {projectNum}.
                    </div>
                    
                    <h3 className="text-2xl md:text-3xl font-extrabold mb-4 group-hover:text-primary transition-colors font-mono tracking-tight text-text">
                      {project.name}
                    </h3>

                    <p className="text-sm text-text-muted mb-6 leading-relaxed font-mono whitespace-pre-wrap">
                      {project.customDesc || project.description || 'No description provided.'}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-8">
                      {[project.language, ...(project.tags || [])].filter(Boolean).map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 text-[10px] font-mono font-bold bg-bg-subtle text-primary border border-border rounded-md uppercase tracking-wider shadow-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 pt-6 border-t border-border/60 w-fit">
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-text-muted hover:text-text transition-colors flex items-center gap-2 text-xs font-mono group/btn"
                      >
                        <Github size={18} className="group-hover/btn:rotate-12 transition-transform duration-300" /> 
                        <span>View Code</span>
                      </a>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </AnimatedSection>
    </section>
  );
}