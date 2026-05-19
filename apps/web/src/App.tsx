import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SpeedInsights } from '@vercel/speed-insights/react';
import InteractiveMesh from './components/layout/InteractiveMesh';
import Home from './pages/Home';
import Login from './pages/Login';
import Admin from './pages/Admin';

function App() {
  return (
    <Router>
      <div className="min-h-screen text-[var(--color-text)] selection:bg-[var(--color-primary)] selection:text-white">
        <InteractiveMesh />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
        <SpeedInsights />
      </div>
    </Router>
  );
}

export default App;