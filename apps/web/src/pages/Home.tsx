import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Hero from '../components/sections/Hero';
import About from '../components/sections/About';
import Skills from '../components/sections/Skills';
import Projects from '../components/sections/Projects';
import Contact from '../components/sections/Contact';

import { useProfile } from '../hooks/use-profile';

export default function Home() {
  const { data: profile } = useProfile();

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
