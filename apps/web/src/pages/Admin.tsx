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
  Layout,
  Code,
  Plus,
  Trash2,
  Edit,
  X
} from 'lucide-react';

import type { Profile, Skill } from '../types';
import { useSkills, useCreateSkill, useUpdateSkill, useDeleteSkill } from '../hooks/use-skills';

export default function Admin() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'profile' | 'skills'>('profile');

  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [skillForm, setSkillForm] = useState({
    name: '',
    category: 'FRONTEND' as Skill['category'],
    proficiency: 80,
    icon: '',
  });

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

  const { data: skills = [], isLoading: skillsLoading } = useSkills();
  const createSkillMut = useCreateSkill();
  const updateSkillMut = useUpdateSkill();
  const deleteSkillMut = useDeleteSkill();

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

  const handleOpenAddSkill = () => {
    setEditingSkill(null);
    setSkillForm({ name: '', category: 'FRONTEND', proficiency: 80, icon: '' });
    setIsSkillModalOpen(true);
  };

  const handleOpenEditSkill = (skill: Skill) => {
    setEditingSkill(skill);
    setSkillForm({
      name: skill.name,
      category: skill.category,
      proficiency: skill.proficiency,
      icon: skill.icon || '',
    });
    setIsSkillModalOpen(true);
  };

  const handleSaveSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      if (editingSkill) {
        await updateSkillMut.mutateAsync({
          id: editingSkill.id,
          data: skillForm,
          token,
        });
        setMessage({ text: 'Skill updated successfully!', type: 'success' });
      } else {
        await createSkillMut.mutateAsync({
          data: skillForm,
          token,
        });
        setMessage({ text: 'Skill created successfully!', type: 'success' });
      }
      setIsSkillModalOpen(false);
    } catch {
      setMessage({ text: 'Failed to save skill', type: 'error' });
    }
  };

  const handleDeleteSkill = async (id: string) => {
    if (!token || !window.confirm('Are you sure you want to delete this skill?')) return;
    try {
      await deleteSkillMut.mutateAsync({ id, token });
      setMessage({ text: 'Skill deleted successfully!', type: 'success' });
    } catch {
      setMessage({ text: 'Failed to delete skill', type: 'error' });
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
        className="px-4 py-2 bg-[var(--color-terminal)] border border-[var(--color-border)] rounded-lg text-xs hover:border-[var(--color-primary)] transition-colors cursor-pointer"
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

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-[var(--color-border)] pb-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm transition-all cursor-pointer ${
            activeTab === 'profile'
              ? 'bg-[var(--color-primary)] text-white font-bold shadow-lg'
              : 'bg-[var(--color-bg-subtle)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] border border-[var(--color-border)]'
          }`}
        >
          <User size={16} /> Profile Details
        </button>
        <button
          onClick={() => setActiveTab('skills')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm transition-all cursor-pointer ${
            activeTab === 'skills'
              ? 'bg-[var(--color-primary)] text-white font-bold shadow-lg'
              : 'bg-[var(--color-bg-subtle)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] border border-[var(--color-border)]'
          }`}
        >
          <Code size={16} /> Tech Stack & Skills
        </button>
      </div>

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

        {/* Main Content Area */}
        <div className="lg:col-span-2">
          {activeTab === 'profile' ? (
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
                className="flex items-center gap-2 bg-[var(--color-primary)] text-white font-mono px-6 py-3 rounded-lg hover:bg-[var(--color-primary-hover)] transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                <Save size={18} />
                {saving ? 'Saving Changes...' : 'Save Profile'}
              </button>
            </form>
          ) : (
            <div className="bg-[var(--color-bg-subtle)] p-8 rounded-xl border border-[var(--color-border)] space-y-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <Code size={18} className="text-[var(--color-primary)]" />
                  <h3 className="font-mono font-bold text-lg">Tech Stack & Skills</h3>
                </div>
                <button
                  onClick={handleOpenAddSkill}
                  className="flex items-center gap-2 bg-[var(--color-primary)] text-white font-mono px-4 py-2 rounded-lg text-sm hover:bg-[var(--color-primary-hover)] transition-all active:scale-95 cursor-pointer shadow-md"
                >
                  <Plus size={16} /> Add Skill
                </button>
              </div>

              {skillsLoading ? (
                <div className="py-12 text-center font-mono text-[var(--color-text-muted)] animate-pulse">
                  Loading skills data...
                </div>
              ) : skills.length === 0 ? (
                <div className="py-12 text-center font-mono text-[var(--color-text-muted)] border border-dashed border-[var(--color-border)] rounded-xl p-8">
                  No skills found. Click "Add Skill" above to create your first tech stack item.
                </div>
              ) : (
                <div className="space-y-6">
                  {(['FRONTEND', 'BACKEND', 'TOOLS', 'OTHERS'] as const).map((cat) => {
                    const catSkills = skills.filter((s) => s.category === cat);
                    if (catSkills.length === 0) return null;
                    return (
                      <div key={cat} className="space-y-3">
                        <h4 className="text-xs font-mono text-[var(--color-text-muted)] uppercase tracking-wider border-b border-[var(--color-border)] pb-2">
                          {cat}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {catSkills.map((skill) => (
                            <div
                              key={skill.id}
                              className="flex items-center justify-between p-4 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl hover:border-[var(--color-primary)] transition-all group"
                            >
                              <div className="space-y-1">
                                <div className="font-mono font-bold text-sm flex items-center gap-2">
                                  {skill.name}
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-24 bg-[var(--color-bg-subtle)] h-1.5 rounded-full overflow-hidden border border-[var(--color-border)]">
                                    <div
                                      className="bg-[var(--color-primary)] h-full"
                                      style={{ width: `${skill.proficiency}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-[10px] font-mono text-[var(--color-text-muted)]">
                                    {skill.proficiency}%
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => handleOpenEditSkill(skill)}
                                  className="p-2 text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors cursor-pointer rounded-lg hover:bg-[var(--color-bg-subtle)]"
                                  title="Edit Skill"
                                >
                                  <Edit size={16} />
                                </button>
                                <button
                                  onClick={() => handleDeleteSkill(skill.id)}
                                  className="p-2 text-[var(--color-text-muted)] hover:text-red-500 transition-colors cursor-pointer rounded-lg hover:bg-red-500/10"
                                  title="Delete Skill"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Skill Modal */}
      {isSkillModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[var(--color-bg-subtle)] border border-[var(--color-border)] rounded-2xl p-6 w-full max-w-md space-y-6 shadow-2xl relative"
          >
            <div className="flex justify-between items-center border-b border-[var(--color-border)] pb-4">
              <h3 className="font-mono font-bold text-lg flex items-center gap-2">
                <Code size={18} className="text-[var(--color-primary)]" />
                {editingSkill ? 'Edit Skill' : 'Add New Skill'}
              </h3>
              <button
                onClick={() => setIsSkillModalOpen(false)}
                className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveSkill} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-mono text-[var(--color-text-muted)] uppercase tracking-wider">
                  Skill Name
                </label>
                <input
                  type="text"
                  required
                  value={skillForm.name}
                  onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                  placeholder="e.g. React, TypeScript, Docker"
                  className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg p-3 focus:outline-none focus:border-[var(--color-primary)] transition-colors font-mono text-sm"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-[var(--color-text-muted)] uppercase tracking-wider">
                  Category
                </label>
                <select
                  value={skillForm.category}
                  onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value as Skill['category'] })}
                  className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg p-3 focus:outline-none focus:border-[var(--color-primary)] transition-colors font-mono text-sm"
                >
                  <option value="FRONTEND">FRONTEND</option>
                  <option value="BACKEND">BACKEND</option>
                  <option value="TOOLS">TOOLS</option>
                  <option value="OTHERS">OTHERS</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-[var(--color-text-muted)] flex justify-between uppercase tracking-wider">
                  <span>Proficiency</span>
                  <span className="text-[var(--color-primary)] font-bold">{skillForm.proficiency}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={skillForm.proficiency}
                  onChange={(e) => setSkillForm({ ...skillForm, proficiency: parseInt(e.target.value) })}
                  className="w-full accent-[var(--color-primary)] cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-[var(--color-text-muted)] uppercase tracking-wider">
                  SimpleIcons Slug (Optional)
                </label>
                <input
                  type="text"
                  value={skillForm.icon}
                  onChange={(e) => setSkillForm({ ...skillForm, icon: e.target.value })}
                  placeholder="e.g. react, vuedotjs, tailwindcss, docker"
                  className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg p-3 focus:outline-none focus:border-[var(--color-primary)] transition-colors font-mono text-sm"
                />
                <p className="text-[10px] font-mono text-[var(--color-text-muted)]">
                  Check available icon slugs at <a href="https://simpleicons.org" target="_blank" rel="noreferrer" className="text-[var(--color-primary)] underline hover:text-[var(--color-primary-hover)]">simpleicons.org</a>
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
                <button
                  type="button"
                  onClick={() => setIsSkillModalOpen(false)}
                  className="px-4 py-2 bg-[var(--color-terminal)] border border-[var(--color-border)] rounded-lg font-mono text-sm hover:border-[var(--color-text-muted)] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createSkillMut.isPending || updateSkillMut.isPending}
                  className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg font-mono text-sm hover:bg-[var(--color-primary-hover)] transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  {createSkillMut.isPending || updateSkillMut.isPending ? 'Saving...' : 'Save Skill'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
