import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, 
  Github, 
  Camera, 
  Save, 
  RefreshCw, 
  LogOut,
  MapPin,
  FileText,
  Layout
} from 'lucide-react';

import type { Profile } from '../types';

export default function Admin() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  const fetchProfile = useCallback(async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/profile`);
      const data = await response.json();
      setProfile(data.data);
    } catch {
      console.error('Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initAdmin = async () => {
      if (!token) {
        navigate('/login');
        return;
      }
      await fetchProfile();
    };

    initAdmin();
  }, [token, navigate, fetchProfile]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setSaving(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          headline: profile.headline,
          bio: profile.bio,
          location: profile.location
        }),
      });
      if (response.ok) {
        setMessage({ text: 'Profile updated successfully!', type: 'success' });
      }
    } catch {
      setMessage({ text: 'Failed to update profile', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleSyncGitHub = async () => {
    setSyncing(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/sync/trigger`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setMessage({ text: 'GitHub sync triggered successfully!', type: 'success' });
      }
    } catch {
      setMessage({ text: 'Failed to sync GitHub', type: 'error' });
    } finally {
      setSyncing(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setSaving(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/profile/photo`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const data = await response.json();
      if (response.ok) {
        setProfile({ ...profile, photoUrl: data.data.photoUrl });
        setMessage({ text: 'Photo uploaded successfully!', type: 'success' });
      }
    } catch {
      setMessage({ text: 'Failed to upload photo', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center font-mono text-[var(--color-text-muted)] animate-pulse">
      Initialising Admin Environment...
    </div>
  );

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <header className="flex justify-between items-center bg-[var(--color-bg-subtle)] p-6 rounded-xl border border-[var(--color-border)]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[var(--color-primary)] rounded-lg flex items-center justify-center text-white">
            <Layout size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold font-mono">Admin Dashboard</h1>
            <p className="text-xs text-[var(--color-text-muted)] font-mono">Control Center v1.0.0</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="p-3 text-[var(--color-text-muted)] hover:text-red-500 transition-colors"
          title="Logout"
        >
          <LogOut size={20} />
        </button>
      </header>

      {message.text && (
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`p-4 rounded-lg font-mono text-sm border ${
            message.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'
          }`}
        >
          {message.type === 'success' ? '[SUCCESS]:' : '[ERROR]:'} {message.text}
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Sidebar */}
        <div className="space-y-6">
          <div className="bg-[var(--color-bg-subtle)] p-6 rounded-xl border border-[var(--color-border)] text-center">
            <div className="relative w-32 h-32 mx-auto mb-4 group">
              <img 
                src={profile.photoUrl || 'https://via.placeholder.com/150'} 
                alt="Profile" 
                className="w-full h-full object-cover rounded-full border-2 border-[var(--color-border)] group-hover:border-[var(--color-primary)] transition-colors"
              />
              <label className="absolute bottom-0 right-0 p-2 bg-[var(--color-primary)] rounded-full text-white cursor-pointer hover:scale-110 transition-transform shadow-lg">
                <Camera size={16} />
                <input type="file" className="hidden" onChange={handlePhotoUpload} accept="image/*" />
              </label>
            </div>
            <h2 className="font-bold font-mono">{profile.headline}</h2>
            <p className="text-sm text-[var(--color-text-muted)] font-mono">{profile.location}</p>
          </div>

          <div className="bg-[var(--color-terminal)] p-6 rounded-xl border border-[var(--color-border)]">
            <h3 className="text-xs font-mono text-[var(--color-text-muted)] uppercase tracking-widest mb-4">Quick Actions</h3>
            <button 
              onClick={handleSyncGitHub}
              disabled={syncing}
              className="w-full flex items-center justify-between p-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-sm font-mono hover:border-[var(--color-primary)] transition-all disabled:opacity-50"
            >
              <div className="flex items-center gap-3">
                <Github size={18} />
                <span>GitHub Sync</span>
              </div>
              <RefreshCw size={16} className={syncing ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Edit Section */}
        <div className="lg:col-span-2">
          <form onSubmit={handleUpdateProfile} className="bg-[var(--color-bg-subtle)] p-8 rounded-xl border border-[var(--color-border)] space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <User size={18} className="text-[var(--color-primary)]" />
              <h3 className="font-mono font-bold">Edit Profile Details</h3>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-[var(--color-text-muted)] flex items-center gap-2 uppercase">
                <Layout size={14} /> Headline
              </label>
              <input 
                type="text" 
                value={profile.headline}
                onChange={(e) => setProfile({...profile, headline: e.target.value})}
                className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg p-3 focus:outline-none focus:border-[var(--color-primary)] transition-colors font-mono"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-[var(--color-text-muted)] flex items-center gap-2 uppercase">
                <MapPin size={14} /> Location
              </label>
              <input 
                type="text" 
                value={profile.location}
                onChange={(e) => setProfile({...profile, location: e.target.value})}
                className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg p-3 focus:outline-none focus:border-[var(--color-primary)] transition-colors font-mono"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-mono text-[var(--color-text-muted)] flex items-center gap-2 uppercase">
                <FileText size={14} /> Bio
              </label>
              <textarea 
                rows={4}
                value={profile.bio}
                onChange={(e) => setProfile({...profile, bio: e.target.value})}
                className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg p-3 focus:outline-none focus:border-[var(--color-primary)] transition-colors font-mono resize-none"
              />
            </div>

            <button 
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-[var(--color-primary)] text-white font-mono px-6 py-3 rounded-lg hover:bg-[var(--color-primary-hover)] transition-all active:scale-95 disabled:opacity-50"
            >
              <Save size={18} />
              {saving ? 'Saving Changes...' : 'Save Profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
