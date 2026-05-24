import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from '@vercel/analytics/react';
import { Toaster } from 'sonner';
import { useState, useEffect } from 'react';
import InteractiveMesh from './components/layout/InteractiveMesh';
import CommandPalette from './components/layout/CommandPalette';
import Home from './pages/Home';
import Login from './pages/Login';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';

function App() {
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    
    checkIsDesktop();
    
    window.addEventListener('resize', checkIsDesktop);
    return () => window.removeEventListener('resize', checkIsDesktop);
  }, []);

  return (
    <Router>
      <div className="relative z-0 min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] transition-colors duration-300 ease-in-out selection:bg-[var(--color-primary)] selection:text-white">
        {isDesktop && <InteractiveMesh />}
        <CommandPalette />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <SpeedInsights />
        <Analytics />
        <Toaster 
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'var(--color-bg-subtle)',
              color: 'var(--color-text)',
              border: '1px solid var(--color-border)',
            },
            className: 'font-mono text-sm'
          }}
        />
      </div>
    </Router>
  );
}

export default App;