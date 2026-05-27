import React, { Suspense } from 'react';
import Navbar from '../components/layout/Navbar';
import Hero from '../components/sections/Hero';
import About from '../components/sections/About';

const Skills = React.lazy(() => import('../components/sections/Skills'));
const Projects = React.lazy(() => import('../components/sections/Projects'));
const Experience = React.lazy(() => import('../components/sections/Experience'));
const Education = React.lazy(() => import('../components/sections/Education'));
const Contact = React.lazy(() => import('../components/sections/Contact'));
const Footer = React.lazy(() => import('../components/layout/Footer'));

import { useProfile } from '../hooks/use-profile';
import { useSections } from '../hooks/use-sections';

export default function Home() {
  const { data: profile, isLoading: isProfileLoading } = useProfile();
  const { data: sections = [] } = useSections();

  const sectionRenderer: Record<string, React.ReactNode> = {
    hero: <Hero profile={profile} isLoading={isProfileLoading} />,
    about: <About profile={profile} isLoading={isProfileLoading} />,
    skills: <Skills />,
    projects: <Projects />,
    experience: <Experience />,
    education: <Education />,
    contact: <Contact />,
  };

  const defaultSections = [
    { name: 'hero', isEnabled: true },
    { name: 'about', isEnabled: true },
    { name: 'skills', isEnabled: true },
    { name: 'projects', isEnabled: true },
    { name: 'contact', isEnabled: true },
  ];

  const activeSections = sections.length > 0 ? sections : defaultSections;

  return (
    <>
      <Navbar />
      <main className="w-full px-4 md:px-8 lg:px-16 pb-20">
        <Suspense fallback={<div className="h-64 flex items-center justify-center font-mono text-[var(--color-text-muted)] animate-pulse">Loading section...</div>}>
          {activeSections
            .filter((sec) => sec.isEnabled && sectionRenderer[sec.name])
            .map((sec) => (
              <React.Fragment key={sec.name}>
                {sectionRenderer[sec.name]}
              </React.Fragment>
            ))}
        </Suspense>
      </main>
      <Suspense fallback={<div className="h-20" />}>
        <Footer />
      </Suspense>
    </>
  );
}
