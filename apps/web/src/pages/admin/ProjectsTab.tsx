import React, { useState } from 'react';
import { FolderGit2, Star, Eye, EyeOff, Edit, Github, Camera, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Project } from '../../types';
import { projectsApi } from '../../services/api.service';
import { optimizeImage } from '../../utils/ImageOptimizer';

interface ProjectsTabProps {
  token: string | null;
  setMessage: (msg: { text: string; type: string }) => void;
}

export function ProjectsTab({ token, setMessage }: Readonly<ProjectsTabProps>) {
  const queryClient = useQueryClient();

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
  const isPending = updateProjectMut.isPending;

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
                  disabled={isPending}
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
                  disabled={isPending}
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
                  disabled={isPending}
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

  return (
    <div className="bg-[var(--color-bg-subtle)] p-8 rounded-xl border border-[var(--color-border)] space-y-6 shadow-sm">
      <div className="flex items-center justify-between mb-6 border-b border-[var(--color-border)] pb-4">
        <div className="flex items-center gap-2">
          <FolderGit2 size={18} className="text-[var(--color-primary)]" />
          <h3 className="font-mono font-bold text-lg">Project Customizations</h3>
        </div>
        <span className="text-xs font-mono text-[var(--color-text-muted)]">
          Total: {projects.length} | Featured: {projects.filter(p => p.isPinned).length}
        </span>
      </div>

      {renderProjectsList()}

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
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file && token) {
                          try {
                            const optimized = await optimizeImage(file);
                            uploadProjectImageMut.mutate({ file: optimized, token });
                          } catch {
                            setMessage({ text: 'Failed to optimize image', type: 'error' });
                            uploadProjectImageMut.mutate({ file, token });
                          }
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
                  disabled={isPending}
                  className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg font-mono text-sm hover:bg-[var(--color-primary-dim)] transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  {isPending ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
