import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from '@vercel/analytics/react';
import { Toaster } from 'sonner';
import React, { useState, useEffect, Suspense } from 'react';
import InteractiveMesh from './components/layout/InteractiveMesh';

const Home = React.lazy(() => import('./pages/Home'));
const Login = React.lazy(() => import('./pages/Login'));
const Admin = React.lazy(() => import('./pages/Admin'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

function App() {
  const [isDesktop, setIsDesktop] = useState(false);

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
      <div className="relative z-0 min-h-screen bg-bg text-text transition-colors duration-300 ease-in-out selection:bg-primary selection:text-white">
        <div className="bg-grid-pattern" />
        {isDesktop && <InteractiveMesh />}
        
        <Suspense fallback={<div className="h-screen w-full flex items-center justify-center font-mono text-text-muted animate-pulse">Initializing...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
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