import { Link } from 'react-router-dom';
import { Terminal, Home } from 'lucide-react';
import AnimatedSection from '../components/ui/AnimatedSection';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
      <AnimatedSection>
        <div className="max-w-md w-full bg-bg-subtle border border-border rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <Terminal size={120} />
          </div>
          
          <div className="relative z-10 flex flex-col items-center text-center space-y-6">
            <div className="p-4 rounded-full bg-bg text-primary border border-border">
              <Terminal size={32} />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-6xl font-bold font-mono text-text">404</h1>
              <h2 className="text-xl font-bold font-mono text-text-muted uppercase tracking-widest">Page_Not_Found</h2>
            </div>
            
            <p className="text-text-muted font-mono text-sm leading-relaxed">
              The requested route does not exist in this directory. The requested resource could not be found on this server.
            </p>
            
            <Link 
              to="/"
              className="mt-4 w-full py-4 rounded-lg bg-primary text-white font-bold font-mono hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <Home size={18} />
              RETURN_HOME
            </Link>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}
