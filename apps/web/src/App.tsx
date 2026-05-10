import GlowBackground from './components/layout/GlowBackground';
import InteractiveMesh from './components/layout/InteractiveMesh';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Skills from './components/sections/Skills';
import Projects from './components/sections/Projects';
import Contact from './components/sections/Contact';

function App() {
  return (
    <div className="min-h-screen text-[var(--color-text)] selection:bg-[var(--color-primary)] selection:text-white">
      <GlowBackground />
      <InteractiveMesh />
      <Navbar />
      
      <main className="container mx-auto px-6 max-w-5xl pb-20">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}

export default App;