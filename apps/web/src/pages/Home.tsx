import React, { Suspense } from 'react';
import Navbar from '../components/layout/Navbar';
import Hero from '../components/sections/Hero';
import About from '../components/sections/About';

const Skills = React.lazy(() => import('../components/sections/Skills'));
const Projects = React.lazy(() => import('../components/sections/Projects'));
const Contact = React.lazy(() => import('../components/sections/Contact'));
const Footer = React.lazy(() => import('../components/layout/Footer'));

import { useProfile } from '../hooks/use-profile';

export default function Home() {
  const { data: profile } = useProfile();

  return (
    <>
      <Navbar />
      <main className="w-full px-4 md:px-8 lg:px-16 pb-20">
        <Hero profile={profile} />
        <About profile={profile} />
        <Suspense fallback={<div className="h-64 flex items-center justify-center font-mono text-[var(--color-text-muted)] animate-pulse">Loading sections...</div>}>
          <Skills />
          <Projects />
          <Contact />
        </Suspense>
      </main>
      <Suspense fallback={<div className="h-20" />}>
        <Footer />
      </Suspense>
    </>
  );
}
