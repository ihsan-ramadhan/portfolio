import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Github, 
  Camera, 
  RefreshCw, 
  LogOut,
  Layout,
  Code,
  X,
  Mail,
  FolderGit2,
  Briefcase,
  GraduationCap,
  Sparkles
} from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

import type { Profile } from '../types';
import { useMessages } from '../hooks/use-messages';
import { ImageUploadModal } from '../components/ui/ImageUploadModal';

import { ProfileTab } from './admin/ProfileTab';
import { SkillsTab } from './admin/SkillsTab';
import { InboxTab } from './admin/InboxTab';
import { ProjectsTab } from './admin/ProjectsTab';
import { SectionsTab } from './admin/SectionsTab';
import { ExperienceTab } from './admin/ExperienceTab';
import { EducationTab } from './admin/EducationTab';
import { InterestsTab } from './admin/InterestsTab';

export default function Admin() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<'profile' | 'sections' | 'skills' | 'projects' | 'experience' | 'education' | 'interests' | 'inbox'>('profile');

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

  const { data: messages = [] } = useMessages(token || '');
  const unreadCount = messages.filter((m) => !m.isRead).length;

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setSaving(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          headline: profile.headline,
          bio: profile.bio,
          location: profile.location,
          statusBadge: profile.statusBadge,
          tagline: profile.tagline
        })
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        return;
      }
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
      if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        return;
      }
      if (response.ok) {
        queryClient.invalidateQueries({ queryKey: ['adminProjects'] });
        queryClient.invalidateQueries({ queryKey: ['projects'] });
        setMessage({ text: 'GitHub sync triggered successfully!', type: 'success' });
      }
    } catch {
      setMessage({ text: 'Failed to sync GitHub', type: 'error' });
    } finally {
      setSyncing(false);
    }
  };

  const handlePhotoUpload = async (file: File) => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/profile/photo`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        return;
      }
      const data = await response.json();
      if (response.ok) {
        if (profile) setProfile({ ...profile, photoUrl: data.data.photoUrl });
        setMessage({ text: 'Photo uploaded successfully!', type: 'success' });
      }
    } catch {
      setMessage({ text: 'Failed to upload photo', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoDelete = async () => {
    setSaving(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/profile/photo`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        return;
      }
      if (response.ok) {
        if (profile) setProfile({ ...profile, photoUrl: '' });
        setMessage({ text: 'Photo deleted successfully!', type: 'success' });
      }
    } catch {
      setMessage({ text: 'Failed to delete photo', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out from the Admin Control Panel?')) {
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <ProfileTab
            profile={profile}
            setProfile={setProfile}
            saving={saving}
            handleUpdateProfile={handleUpdateProfile}
          />
        );
      case 'sections':
        return <SectionsTab token={token} setMessage={setMessage} />;
      case 'skills':
        return <SkillsTab token={token} setMessage={setMessage} />;
      case 'inbox':
        return <InboxTab token={token} setMessage={setMessage} />;
      case 'projects':
        return <ProjectsTab token={token} setMessage={setMessage} />;
      case 'experience':
        return <ExperienceTab token={token} setMessage={setMessage} />;
      case 'education':
        return <EducationTab token={token} setMessage={setMessage} />;
      case 'interests':
        return <InterestsTab token={token} setMessage={setMessage} />;
      default:
        return null;
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center font-mono text-[var(--color-text-muted)] animate-pulse">
      Initialising Admin Environment...
    </div>
  );

  if (!profile) return (
    <div className="min-h-screen flex flex-col items-center justify-center font-mono gap-4 text-[var(--color-text-muted)]">
      <div className="text-red-500 font-bold">[ERROR]: Failed to load profile data</div>
      <button 
        onClick={fetchProfile}
        className="px-4 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-xs text-[var(--color-text)] hover:border-[var(--color-primary)] transition-colors cursor-pointer"
      >
        RETRY_FETCH
      </button>
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
            <h1 className="text-xl font-bold font-mono">Admin Control Panel</h1>
            <p className="text-xs text-[var(--color-text-muted)] font-mono">Portfolio Management System</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-xs font-mono text-[var(--color-text)] hover:bg-red-500 hover:text-white hover:border-red-500 transition-all cursor-pointer shadow-sm"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </header>

      {/* Status Notifications */}
      {message.text && (
        <div className={`p-4 rounded-lg font-mono text-sm flex items-center justify-between animate-fade-in ${
          message.type === 'success' 
            ? 'bg-green-500/10 border border-green-500/30 text-green-400' 
            : 'bg-red-500/10 border border-red-500/30 text-red-400'
        }`}>
          <span>{message.text}</span>
          <button onClick={() => setMessage({ text: '', type: '' })} className="hover:opacity-70 cursor-pointer">
            <X size={16} />
          </button>
        </div>
      )}

      <div className="flex gap-2 border-b border-[var(--color-border)] pb-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'profile'
              ? 'bg-[var(--color-primary)] text-white font-bold shadow-lg'
              : 'bg-[var(--color-bg-subtle)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] border border-[var(--color-border)]'
          }`}
        >
          <User size={16} /> Profile Details
        </button>
        <button
          onClick={() => setActiveTab('sections')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'sections'
              ? 'bg-[var(--color-primary)] text-white font-bold shadow-lg'
              : 'bg-[var(--color-bg-subtle)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] border border-[var(--color-border)]'
          }`}
        >
          <Layout size={16} /> Site Sections
        </button>
        <button
          onClick={() => setActiveTab('skills')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'skills'
              ? 'bg-[var(--color-primary)] text-white font-bold shadow-lg'
              : 'bg-[var(--color-bg-subtle)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] border border-[var(--color-border)]'
          }`}
        >
          <Code size={16} /> Tech Stack & Skills
        </button>
        <button
          onClick={() => setActiveTab('projects')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'projects'
              ? 'bg-[var(--color-primary)] text-white font-bold shadow-lg'
              : 'bg-[var(--color-bg-subtle)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] border border-[var(--color-border)]'
          }`}
        >
          <FolderGit2 size={16} /> Project Customizations
        </button>
        <button
          onClick={() => setActiveTab('experience')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'experience'
              ? 'bg-[var(--color-primary)] text-white font-bold shadow-lg'
              : 'bg-[var(--color-bg-subtle)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] border border-[var(--color-border)]'
          }`}
        >
          <Briefcase size={16} /> Work Experience
        </button>
        <button
          onClick={() => setActiveTab('education')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'education'
              ? 'bg-[var(--color-primary)] text-white font-bold shadow-lg'
              : 'bg-[var(--color-bg-subtle)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] border border-[var(--color-border)]'
          }`}
        >
          <GraduationCap size={16} /> Academic History
        </button>
        <button
          onClick={() => setActiveTab('interests')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'interests'
              ? 'bg-[var(--color-primary)] text-white font-bold shadow-lg'
              : 'bg-[var(--color-bg-subtle)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] border border-[var(--color-border)]'
          }`}
        >
          <Sparkles size={16} /> Interests
        </button>
        <button
          onClick={() => setActiveTab('inbox')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'inbox'
              ? 'bg-[var(--color-primary)] text-white font-bold shadow-lg'
              : 'bg-[var(--color-bg-subtle)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] border border-[var(--color-border)]'
          }`}
        >
          <Mail size={16} /> Contact Inbox
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Sidebar Profile Overview */}
        <div className="space-y-6">
          <div className="bg-[var(--color-bg-subtle)] p-6 rounded-xl border border-[var(--color-border)] text-center space-y-4">
            <div className="relative w-24 h-24 mx-auto group">
              <img 
                src={profile.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'} 
                alt={profile.headline}
                className="w-24 h-24 rounded-full object-cover border-2 border-[var(--color-primary)] shadow-lg group-hover:scale-105 transition-transform"
              />
              <button 
                type="button"
                onClick={() => setIsPhotoModalOpen(true)}
                className="absolute bottom-0 right-0 p-2 bg-[var(--color-primary)] rounded-full text-white cursor-pointer hover:scale-110 transition-transform shadow-lg"
              >
                <Camera size={16} />
              </button>
            </div>
            <h2 className="font-bold font-mono">{profile.headline}</h2>
            <p className="text-sm text-[var(--color-text-muted)] font-mono">{profile.location}</p>
          </div>

          <div className="bg-[var(--color-bg-subtle)] p-6 rounded-xl border border-[var(--color-border)] shadow-sm">
            <h3 className="text-xs font-mono text-[var(--color-text)] font-bold uppercase tracking-widest mb-4">Quick Actions</h3>
            <button 
              onClick={handleSyncGitHub}
              disabled={syncing}
              className="w-full flex items-center justify-between p-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg text-sm font-mono text-[var(--color-text)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all disabled:opacity-50 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <Github size={18} />
                <span>GitHub Sync</span>
              </div>
              <RefreshCw size={16} className={syncing ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-2">
          {renderTabContent()}
        </div>
      </div>
      <ImageUploadModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        onUpload={handlePhotoUpload}
        onDelete={handlePhotoDelete}
        currentImageUrl={profile.photoUrl}
        title="Profile Photo"
        isPending={saving}
      />
    </div>
  );
}
