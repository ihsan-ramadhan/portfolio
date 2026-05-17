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
  X,
  Mail,
  CheckCheck,
  FolderGit2,
  Star,
  Eye,
  EyeOff
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import type { Profile, Skill, Project } from '../types';
import { projectsApi } from '../services/api.service';
import { useSkills, useCreateSkill, useUpdateSkill, useDeleteSkill } from '../hooks/use-skills';
import { useMessages, useMarkAsRead, useDeleteMessage } from '../hooks/use-messages';

export default function Admin() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<'profile' | 'skills' | 'inbox' | 'projects'>('profile');

  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [skillForm, setSkillForm] = useState({
    name: '',
    category: 'FRONTEND' as Skill['category'],
    proficiency: 80,
    icon: '',
  });

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectForm, setProjectForm] = useState<{
    name: string;
    customDesc: string;
    imageUrl: string;
    language: string;
    tags: string[];
    isPinned: boolean;
    isVisible: boolean;
  }>({
    name: '',
    customDesc: '',
    imageUrl: '',
    language: '',
    tags: [],
    isPinned: false,
    isVisible: true,
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

  const { data: messages = [], isLoading: messagesLoading } = useMessages(token || '');
  const markAsReadMut = useMarkAsRead();
  const deleteMessageMut = useDeleteMessage();
  const unreadCount = messages.filter((m) => !m.isRead).length;

  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ['adminProjects', token],
    queryFn: () => projectsApi.getAdminProjects(token || ''),
    enabled: !!token,
  });

  const uploadProjectImageMut = useMutation({
    mutationFn: projectsApi.uploadProjectImage,
    onSuccess: (url) => {
      setProjectForm((prev) => ({ ...prev, imageUrl: url }));
      setMessage({ text: 'Project image uploaded successfully!', type: 'success' });
    },
    onError: () => {
      setMessage({ text: 'Failed to upload project image', type: 'error' });
    },
  });

  const updateProjectMut = useMutation({
    mutationFn: projectsApi.updateProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProjects'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setMessage({ text: 'Project updated successfully!', type: 'success' });
      setIsProjectModalOpen(false);
    },
    onError: () => {
      setMessage({ text: 'Failed to update project', type: 'error' });
    },
  });

  const handleMarkAsRead = async (id: string) => {
    if (!token) return;
    try {
      await markAsReadMut.mutateAsync({ id, token });
      setMessage({ text: 'Message marked as read!', type: 'success' });
    } catch {
      setMessage({ text: 'Failed to mark message as read', type: 'error' });
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (!token || !window.confirm('Are you sure you want to delete this message?')) return;
    try {
      await deleteMessageMut.mutateAsync({ id, token });
      setMessage({ text: 'Message deleted successfully!', type: 'success' });
    } catch {
      setMessage({ text: 'Failed to delete message', type: 'error' });
    }
  };

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
        })
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
    if (window.confirm('Are you sure you want to log out from the Admin Control Panel?')) {
      localStorage.removeItem('token');
      navigate('/login');
    }
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

  const handleOpenEditProject = (project: Project) => {
    setEditingProject(project);
    setProjectForm({
      name: project.name,
      customDesc: project.customDesc || '',
      imageUrl: project.imageUrl || '',
      language: project.language || '',
      tags: project.tags || [],
      isPinned: project.isPinned,
      isVisible: project.isVisible,
    });
    setIsProjectModalOpen(true);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !editingProject) return;

    try {
      await updateProjectMut.mutateAsync({
        id: editingProject.id,
        data: {
          name: projectForm.name,
          customDesc: projectForm.customDesc,
          imageUrl: projectForm.imageUrl,
          language: projectForm.language,
          tags: projectForm.tags,
          isPinned: projectForm.isPinned,
          isVisible: projectForm.isVisible,
        },
        token,
      });
    } catch {
      // Error handled in mutation onError
    }
  };

  const handleToggleVisibility = async (project: Project) => {
    if (!token) return;
    try {
      await updateProjectMut.mutateAsync({
        id: project.id,
        data: { isVisible: !project.isVisible },
        token,
      });
    } catch {
      // Error handled in mutation onError
    }
  };

  const handleTogglePin = async (project: Project) => {
    if (!token) return;
    try {
      await updateProjectMut.mutateAsync({
        id: project.id,
        data: { isPinned: !project.isPinned },
        token,
      });
    } catch {
      // Error handled in mutation onError
    }
  };

  const renderSkillsList = () => {
    if (skillsLoading) {
      return (
        <div className="py-12 text-center font-mono text-[var(--color-text-muted)] animate-pulse">
          Loading skills data...
        </div>
      );
    }
    if (skills.length === 0) {
      return (
        <div className="py-12 text-center font-mono text-[var(--color-text-muted)] border border-dashed border-[var(--color-border)] rounded-xl p-8">
          No skills found. Click "Add Skill" above to create your first tech stack item.
        </div>
      );
    }
    return (
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
    );
  };

  const renderMessagesList = () => {
    if (messagesLoading) {
      return (
        <div className="py-12 text-center font-mono text-[var(--color-text-muted)] animate-pulse">
          Loading inbox messages...
        </div>
      );
    }
    if (messages.length === 0) {
      return (
        <div className="py-12 text-center font-mono text-[var(--color-text-muted)] border border-dashed border-[var(--color-border)] rounded-xl p-8">
          No contact messages found. Your inbox is clean!
        </div>
      );
    }
    return (
      <div className="space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-6 rounded-xl border transition-all ${
              !msg.isRead
                ? 'bg-[var(--color-bg-subtle)] border-2 border-[var(--color-primary)] shadow-[0_0_15px_rgba(59,130,246,0.15)]'
                : 'bg-[var(--color-bg)] border-[var(--color-border)] opacity-80 hover:opacity-100'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4 border-b border-[var(--color-border)] pb-3">
              <div>
                <div className="font-mono font-bold text-sm flex items-center gap-2 text-[var(--color-text)]">
                  {msg.name}
                  {!msg.isRead && (
                    <span className="bg-red-500/20 border border-red-500/30 text-red-400 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      New
                    </span>
                  )}
                </div>
                <a href={`mailto:${msg.email}`} className="text-xs font-mono text-[var(--color-primary)] hover:underline">
                  {msg.email}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-mono text-[var(--color-text-muted)]">
                  {new Date(msg.createdAt).toLocaleString()}
                </span>
                {!msg.isRead && (
                  <button
                    onClick={() => handleMarkAsRead(msg.id)}
                    disabled={markAsReadMut.isPending}
                    className="flex items-center gap-1 bg-[var(--color-primary)] text-white text-xs font-mono px-3 py-1.5 rounded-lg hover:bg-[var(--color-primary-hover)] transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                    title="Mark as Read"
                  >
                    <CheckCheck size={14} />
                    {markAsReadMut.isPending ? 'Updating...' : 'Mark Read'}
                  </button>
                )}
                <button
                  onClick={() => handleDeleteMessage(msg.id)}
                  disabled={deleteMessageMut.isPending}
                  className="p-1.5 text-[var(--color-text-muted)] hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                  title="Delete Message"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <p className="font-mono text-sm text-[var(--color-text)] whitespace-pre-wrap leading-relaxed">
              {msg.message}
            </p>
          </div>
        ))}
      </div>
    );
  };

  const renderProjectsList = () => {
    if (projectsLoading) {
      return (
        <div className="py-12 text-center font-mono text-[var(--color-text-muted)] animate-pulse">
          Loading projects data...
        </div>
      );
    }
    if (projects.length === 0) {
      return (
        <div className="py-12 text-center font-mono text-[var(--color-text-muted)] border border-dashed border-[var(--color-border)] rounded-xl p-8">
          No projects found. Click "GitHub Sync" in the sidebar to fetch repositories.
        </div>
      );
    }
    return (
      <div className="space-y-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className={`p-6 rounded-xl border transition-all ${
              !project.isVisible
                ? 'bg-[var(--color-bg)] border-dashed border-[var(--color-border)] opacity-60'
                : 'bg-[var(--color-bg)] border-[var(--color-border)] hover:border-[var(--color-primary)] shadow-sm'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 border-b border-[var(--color-border)] pb-4">
              <div className="flex items-center gap-4">
                {project.imageUrl && (
                  <img
                    src={project.imageUrl}
                    alt={project.name}
                    className="w-16 h-16 rounded-lg object-cover border border-[var(--color-border)] shadow-sm flex-shrink-0"
                  />
                )}
                <div className="space-y-1">
                  <div className="font-mono font-bold text-base flex items-center gap-2 text-[var(--color-text)]">
                    <FolderGit2 size={18} className="text-[var(--color-primary)]" />
                    {project.name}
                    {project.isPinned && (
                      <span className="bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/30 text-[var(--color-primary)] text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1">
                        <Star size={12} className="fill-[var(--color-primary)]" /> Featured
                      </span>
                    )}
                    {!project.isVisible && (
                      <span className="bg-red-500/10 border border-red-500/30 text-red-500 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1">
                        <EyeOff size={12} /> Hidden
                      </span>
                    )}
                  </div>
                  <a href={project.url} target="_blank" rel="noreferrer" className="text-xs font-mono text-[var(--color-primary)] hover:underline flex items-center gap-1">
                    <Github size={14} /> {project.url}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleTogglePin(project)}
                  disabled={updateProjectMut.isPending}
                  className={`p-2 rounded-lg border font-mono text-xs flex items-center gap-1 transition-all cursor-pointer ${
                    project.isPinned
                      ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)]'
                      : 'bg-[var(--color-bg-subtle)] text-[var(--color-text-muted)] border-[var(--color-border)] hover:border-[var(--color-primary)]'
                  }`}
                  title={project.isPinned ? 'Unpin Project' : 'Pin Project'}
                >
                  <Star size={14} className={project.isPinned ? 'fill-white' : ''} />
                  {project.isPinned ? 'Pinned' : 'Pin'}
                </button>
                <button
                  onClick={() => handleToggleVisibility(project)}
                  disabled={updateProjectMut.isPending}
                  className={`p-2 rounded-lg border font-mono text-xs flex items-center gap-1 transition-all cursor-pointer ${
                    project.isVisible
                      ? 'bg-[var(--color-bg-subtle)] text-[var(--color-text-muted)] border-[var(--color-border)] hover:border-red-500 hover:text-red-500'
                      : 'bg-red-500 text-white border-red-500'
                  }`}
                  title={project.isVisible ? 'Hide Project' : 'Show Project'}
                >
                  {project.isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
                  {project.isVisible ? 'Visible' : 'Hidden'}
                </button>
                <button
                  onClick={() => handleOpenEditProject(project)}
                  disabled={updateProjectMut.isPending}
                  className="p-2 bg-[var(--color-bg-subtle)] text-[var(--color-text-muted)] hover:text-[var(--color-primary)] border border-[var(--color-border)] hover:border-[var(--color-primary)] rounded-lg transition-all cursor-pointer"
                  title="Customize Project"
                >
                  <Edit size={16} />
                </button>
              </div>
            </div>
            <p className="font-mono text-sm text-[var(--color-text)] mb-4 leading-relaxed">
              {project.customDesc || project.description || 'No description provided.'}
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[var(--color-border)]">
              {project.language && (
                <span className="px-2.5 py-1 text-[10px] font-mono font-bold bg-[var(--color-bg-subtle)] text-[var(--color-primary)] border border-[var(--color-border)] rounded-md uppercase tracking-wider shadow-sm">
                  {project.language}
                </span>
              )}
              {project.tags?.map((tag) => (
                <span key={tag} className="px-2.5 py-1 text-[10px] font-mono font-bold bg-[var(--color-bg-subtle)] text-[var(--color-text-muted)] border border-[var(--color-border)] rounded-md uppercase tracking-wider shadow-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
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
                value={profile.headline || ''}
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
                value={profile.location || ''}
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
                value={profile.bio || ''}
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
        );
      case 'skills':
        return (
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

            {renderSkillsList()}
          </div>
        );
      case 'inbox':
        return (
          <div className="bg-[var(--color-bg-subtle)] p-8 rounded-xl border border-[var(--color-border)] space-y-6">
            <div className="flex items-center justify-between mb-6 border-b border-[var(--color-border)] pb-4">
              <div className="flex items-center gap-2">
                <Mail size={18} className="text-[var(--color-primary)]" />
                <h3 className="font-mono font-bold text-lg">Contact Messages Inbox</h3>
              </div>
              <span className="text-xs font-mono text-[var(--color-text-muted)]">
                Total: {messages.length} | Unread: {unreadCount}
              </span>
            </div>

            {renderMessagesList()}
          </div>
        );
      case 'projects':
        return (
          <div className="bg-[var(--color-bg-subtle)] p-8 rounded-xl border border-[var(--color-border)] space-y-6 shadow-sm">
            <div className="flex items-center justify-between mb-6 border-b border-[var(--color-border)] pb-4">
              <div className="flex items-center gap-2">
                <FolderGit2 size={18} className="text-[var(--color-primary)]" />
                <h3 className="font-mono font-bold text-lg">Project Customizations </h3>
              </div>
              <span className="text-xs font-mono text-[var(--color-text-muted)]">
                Total: {projects.length} | Featured: {projects.filter(p => p.isPinned).length}
              </span>
            </div>

            {renderProjectsList()}
          </div>
        );
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
        <button
          onClick={() => setActiveTab('inbox')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm transition-all cursor-pointer ${
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
        <button
          onClick={() => setActiveTab('projects')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm transition-all cursor-pointer ${
            activeTab === 'projects'
              ? 'bg-[var(--color-primary)] text-white font-bold shadow-lg'
              : 'bg-[var(--color-bg-subtle)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] border border-[var(--color-border)]'
          }`}
        >
          <FolderGit2 size={16} /> Project Customizations
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
              <label className="absolute bottom-0 right-0 p-2 bg-[var(--color-primary)] rounded-full text-white cursor-pointer hover:scale-110 transition-transform shadow-lg">
                <Camera size={16} />
                <input type="file" className="hidden" onChange={handlePhotoUpload} accept="image/*" />
              </label>
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
                  value={skillForm.name}
                  onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                  required
                  placeholder="e.g. React, NestJS, Docker"
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
                  <option value="FRONTEND">Frontend</option>
                  <option value="BACKEND">Backend</option>
                  <option value="TOOLS">Tools & DevOps</option>
                  <option value="OTHERS">Others</option>
                </select>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-mono text-[var(--color-text-muted)] uppercase tracking-wider">
                    Proficiency
                  </label>
                  <span className="font-mono text-xs font-bold text-[var(--color-primary)]">
                    {skillForm.proficiency}%
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={skillForm.proficiency}
                  onChange={(e) => setSkillForm({ ...skillForm, proficiency: Number(e.target.value) })}
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
                  className="px-4 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg font-mono text-sm text-[var(--color-text)] hover:bg-[var(--color-bg-subtle)] hover:border-[var(--color-text-muted)] transition-all cursor-pointer"
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

      {/* Project Modal */}
      {isProjectModalOpen && editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[var(--color-bg-subtle)] border border-[var(--color-border)] rounded-2xl p-6 w-full max-w-lg space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center border-b border-[var(--color-border)] pb-4">
              <h3 className="font-mono font-bold text-lg flex items-center gap-2 text-[var(--color-text)]">
                <FolderGit2 size={18} className="text-[var(--color-primary)]" />
                Customize Project
              </h3>
              <button
                onClick={() => setIsProjectModalOpen(false)}
                className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-mono text-[var(--color-text-muted)] uppercase tracking-wider">
                  Project Name
                </label>
                <input
                  type="text"
                  value={projectForm.name}
                  onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                  required
                  className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg p-3 focus:outline-none focus:border-[var(--color-primary)] transition-colors font-mono text-sm text-[var(--color-text)]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-[var(--color-text-muted)] uppercase tracking-wider">
                  Preview Image URL / Upload
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={projectForm.imageUrl}
                    onChange={(e) => setProjectForm({ ...projectForm, imageUrl: e.target.value })}
                    placeholder="https://... or choose local file"
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg p-3 focus:outline-none focus:border-[var(--color-primary)] transition-colors font-mono text-sm text-[var(--color-text)]"
                  />
                  <label className="flex items-center gap-2 bg-[var(--color-bg-subtle)] border border-[var(--color-border)] hover:border-[var(--color-primary)] px-4 py-2 rounded-lg text-xs font-mono text-[var(--color-text)] cursor-pointer transition-all flex-shrink-0">
                    <Camera size={16} className="text-[var(--color-primary)]" />
                    <span>{uploadProjectImageMut.isPending ? 'Uploading...' : 'Upload'}</span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      disabled={uploadProjectImageMut.isPending}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file && token) {
                          uploadProjectImageMut.mutate({ file, token });
                        }
                      }}
                    />
                  </label>
                </div>
                {projectForm.imageUrl && (
                  <div className="mt-2 relative w-32 h-20 rounded-lg overflow-hidden border border-[var(--color-border)]">
                    <img src={projectForm.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-[var(--color-text-muted)] uppercase tracking-wider">
                  Custom Description
                </label>
                <textarea
                  rows={4}
                  value={projectForm.customDesc}
                  onChange={(e) => setProjectForm({ ...projectForm, customDesc: e.target.value })}
                  placeholder={editingProject.description || 'Enter custom description...'}
                  className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg p-3 focus:outline-none focus:border-[var(--color-primary)] transition-colors font-mono text-sm text-[var(--color-text)] resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-[var(--color-text-muted)] uppercase tracking-wider">
                  Programming Language
                </label>
                <input
                  type="text"
                  value={projectForm.language}
                  onChange={(e) => setProjectForm({ ...projectForm, language: e.target.value })}
                  placeholder="e.g. TypeScript, Python"
                  className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg p-3 focus:outline-none focus:border-[var(--color-primary)] transition-colors font-mono text-sm text-[var(--color-text)]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-[var(--color-text-muted)] uppercase tracking-wider">
                  Custom Tags (Comma separated)
                </label>
                <input
                  type="text"
                  value={projectForm.tags.join(', ')}
                  onChange={(e) => setProjectForm({ ...projectForm, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                  placeholder="e.g. React, NestJS, Supabase"
                  className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg p-3 focus:outline-none focus:border-[var(--color-primary)] transition-colors font-mono text-sm text-[var(--color-text)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-[var(--color-border)]">
                <label className="flex items-center gap-2 cursor-pointer p-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg hover:border-[var(--color-primary)] transition-all">
                  <input
                    type="checkbox"
                    checked={projectForm.isPinned}
                    onChange={(e) => setProjectForm({ ...projectForm, isPinned: e.target.checked })}
                    className="rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                  />
                  <span className="text-xs font-mono text-[var(--color-text)]">Pin (Featured)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer p-3 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg hover:border-[var(--color-primary)] transition-all">
                  <input
                    type="checkbox"
                    checked={projectForm.isVisible}
                    onChange={(e) => setProjectForm({ ...projectForm, isVisible: e.target.checked })}
                    className="rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                  />
                  <span className="text-xs font-mono text-[var(--color-text)]">Visible to Public</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border)]">
                <button
                  type="button"
                  onClick={() => setIsProjectModalOpen(false)}
                  className="px-4 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg font-mono text-sm text-[var(--color-text)] hover:bg-[var(--color-bg-subtle)] hover:border-[var(--color-text-muted)] transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateProjectMut.isPending}
                  className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg font-mono text-sm hover:bg-[var(--color-primary-hover)] transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  {updateProjectMut.isPending ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
