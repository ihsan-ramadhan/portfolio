import React from 'react';
import Navbar from '../components/layout/Navbar';
import Hero from '../components/sections/Hero';
import About from '../components/sections/About';
import Skills from '../components/sections/Skills';
import Projects from '../components/sections/Projects';
import Experience from '../components/sections/Experience';
import Education from '../components/sections/Education';
import Contact from '../components/sections/Contact';
import Footer from '../components/layout/Footer';

import { useProfile } from '../hooks/use-profile';
import { useSections } from '../hooks/use-sections';

export default function Home() {
  const { data: profile, isLoading: isProfileLoading } = useProfile();
  const { data: sections = [] } = useSections();

  const defaultSections = [
    { name: 'hero', isEnabled: true },
    { name: 'about', isEnabled: true },
    { name: 'education', isEnabled: true },
    { name: 'experience', isEnabled: true },
    { name: 'skills', isEnabled: true },
    { name: 'projects', isEnabled: true },
    { name: 'contact', isEnabled: true },
  ];

  const activeSections = sections.length > 0 ? sections : defaultSections;

  const sectionRenderer: Record<string, React.ReactNode> = {
    hero: <Hero profile={profile} isLoading={isProfileLoading} />,
    about: <About profile={profile} isLoading={isProfileLoading} />,
    skills: <Skills />,
    projects: <Projects />,
    experience: <Experience />,
    education: <Education />,
    contact: <Contact />,
  };
  return (
    <>
      <Navbar />
      <main className="w-full px-4 md:px-8 lg:px-16 pb-20 min-h-screen">
        {activeSections
          .filter((sec) => sec.isEnabled && sectionRenderer[sec.name])
          .map((sec) => (
            <React.Fragment key={sec.name}>
              {sectionRenderer[sec.name]}
            </React.Fragment>
          ))}
      </main>
      <Footer />
    </>
  );
}
