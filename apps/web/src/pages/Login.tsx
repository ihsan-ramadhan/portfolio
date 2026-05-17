import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Terminal, Lock, Mail, ArrowRight } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Login gagal');

      localStorage.setItem('token', data.data.access_token);
      navigate('/admin');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan yang tidak diketahui';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[var(--color-bg-subtle)] border border-[var(--color-border)] rounded-xl overflow-hidden shadow-2xl"
      >
        <div className="bg-[var(--color-bg)] p-6 border-b border-[var(--color-border)] flex items-center gap-2">
          <Terminal size={18} className="text-[var(--color-primary)] animate-pulse" />
          <span className="font-mono text-sm text-[var(--color-text)] font-bold tracking-wide">sudo auth login</span>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded text-red-500 text-sm font-mono">
              [ERROR]: {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-mono text-[var(--color-text-muted)] uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={18} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-[var(--color-primary)] transition-colors font-mono text-sm text-[var(--color-text)]"
                placeholder="admin@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-mono text-[var(--color-text-muted)] uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]" size={18} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-[var(--color-primary)] transition-colors font-mono text-sm text-[var(--color-text)]"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-dim)] text-white font-mono font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg"
          >
            {loading ? 'Authenticating...' : 'Access Granted'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="p-6 bg-[var(--color-bg)] border-t border-[var(--color-border)] text-center">
          <a href="/" className="text-xs font-mono text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors inline-flex items-center gap-2 font-bold tracking-wide">
            &larr; Back to Portfolio
          </a>
        </div>
      </motion.div>
    </div>
  );
}
