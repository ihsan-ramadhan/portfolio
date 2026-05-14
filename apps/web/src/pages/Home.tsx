import { useState, useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Hero from '../components/sections/Hero';
import About from '../components/sections/About';
import Skills from '../components/sections/Skills';
import Projects from '../components/sections/Projects';
import Contact from '../components/sections/Contact';

import type { Profile } from '../types';

export default function Home() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/profile`)
      .then(res => res.json())
      .then(data => setProfile(data.data))
      .catch(err => console.error('Error fetching profile:', err));
  }, []);

  return (
    <>
      <Navbar />
      <main className="w-full px-4 md:px-8 lg:px-16 pb-20">
        <Hero profile={profile} />
        <About profile={profile} />
        <Skills />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
