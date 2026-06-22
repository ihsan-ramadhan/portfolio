import React, { useState } from 'react';
import { FolderGit2, Star, Eye, EyeOff, Edit, Github, Camera, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Project } from '../../types';
import { projectsApi } from '../../services/api.service';
import { ImageUploadModal } from '../../components/ui/ImageUploadModal';

interface ProjectsTabProps {
  token: string | null;
  setMessage: (msg: { text: string; type: string }) => void;
}

export function ProjectsTab({ token, setMessage }: Readonly<ProjectsTabProps>) {
  const queryClient = useQueryClient();

  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
  const [previewUrlForPending, setPreviewUrlForPending] = useState<string | null>(null);
  const [shouldDeleteExistingImage, setShouldDeleteExistingImage] = useState(false);
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

  const updateProjectMut = useMutation({
    mutationFn: projectsApi.updateProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminProjects'] });
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      setMessage({ text: 'Project updated successfully!', type: 'success' });
      handleClose();
    },
    onError: () => {
      setMessage({ text: 'Failed to update project', type: 'error' });
    },
  });
  const isPending = updateProjectMut.isPending;

  const cleanupPreviewUrl = () => {
    if (previewUrlForPending) {
      URL.revokeObjectURL(previewUrlForPending);
      setPreviewUrlForPending(null);
    }
  };

  const handleLocalImageUpload = (file: File) => {
    cleanupPreviewUrl();
    const objectUrl = URL.createObjectURL(file);
    setPendingImageFile(file);
    setPreviewUrlForPending(objectUrl);
    setProjectForm((prev) => ({ ...prev, imageUrl: objectUrl }));
    setShouldDeleteExistingImage(false);
  };

  const handleLocalImageDelete = () => {
    setPendingImageFile(null);
    cleanupPreviewUrl();
    setProjectForm((prev) => ({ ...prev, imageUrl: '' }));
    if (editingProject?.imageUrl) {
      setShouldDeleteExistingImage(true);
    }
  };

  const hasUnsavedChanges = () => {
    if (!editingProject) return false;
    return (
      projectForm.name !== editingProject.name ||
      projectForm.customDesc !== (editingProject.customDesc || '') ||
      pendingImageFile !== null ||
      shouldDeleteExistingImage ||
      projectForm.imageUrl !== (editingProject.imageUrl || '') ||
      projectForm.language !== (editingProject.language || '') ||
      JSON.stringify(projectForm.tags) !== JSON.stringify(editingProject.tags || []) ||
      projectForm.isPinned !== editingProject.isPinned ||
      projectForm.isVisible !== editingProject.isVisible
    );
  };

  const handleClose = () => {
    cleanupPreviewUrl();
    setPendingImageFile(null);
    setPreviewUrlForPending(null);
    setShouldDeleteExistingImage(false);
    setIsProjectModalOpen(false);
    setShowCloseConfirm(false);
  };

  const handleCloseAttempt = () => {
    if (hasUnsavedChanges()) {
      setShowCloseConfirm(true);
    } else {
      handleClose();
    }
  };

  const handleOpenEditProject = (project: Project) => {
    setShowCloseConfirm(false);
    setPendingImageFile(null);
    setPreviewUrlForPending(null);
    setShouldDeleteExistingImage(false);
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
      let finalImageUrl = projectForm.imageUrl;

      // 1. If we have a pending local image file, upload it now
      if (pendingImageFile) {
        const uploadedUrl = await projectsApi.uploadProjectImage({
          file: pendingImageFile,
          oldImageUrl: editingProject.imageUrl || undefined,
          token,
        });
        finalImageUrl = uploadedUrl;
      } else if (shouldDeleteExistingImage && editingProject.imageUrl) {
        // 2. If the user explicitly deleted the existing image, delete it from storage
        await projectsApi.deleteProjectImage({
          imageUrl: editingProject.imageUrl,
          token,
        });
        finalImageUrl = '';
      }

      await updateProjectMut.mutateAsync({
        id: editingProject.id,
        data: {
          name: projectForm.name,
          customDesc: projectForm.customDesc,
          imageUrl: finalImageUrl,
          language: projectForm.language,
          tags: projectForm.tags,
          isPinned: projectForm.isPinned,
          isVisible: projectForm.isVisible,
        },
        token,
      });
    } catch {
      // Error handled in mutation/catch block
      setMessage({ text: 'Failed to save customizations', type: 'error' });
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
        <div className="py-12 text-center font-mono text-text-muted animate-pulse">
          Loading projects data...
        </div>
      );
    }
    if (projects.length === 0) {
      return (
        <div className="py-12 text-center font-mono text-text-muted border border-dashed border-border rounded-md p-8">
          No projects found. Click "GitHub Sync" in the sidebar to fetch repositories.
        </div>
      );
    }
    return (
      <div className="space-y-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className={`p-6 rounded-md border transition-all ${
              !project.isVisible
                ? 'bg-bg border-dashed border-border opacity-60'
                : 'bg-bg border-border hover:border-primary shadow-sm'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 border-b border-border pb-4">
              <div className="flex items-center gap-4">
                {project.imageUrl && (
                  <img
                    src={project.imageUrl}
                    alt={project.name}
                    className="w-16 h-16 rounded-md object-cover border border-border shadow-sm flex-shrink-0"
                  />
                )}
                <div className="space-y-1">
                  <div className="font-mono font-bold text-base flex items-center gap-2 text-text">
                    <FolderGit2 size={18} className="text-primary" />
                    {project.name}
                    {project.isPinned && (
                      <span className="bg-primary/10 border border-primary/30 text-primary text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1">
                        <Star size={12} className="fill-primary" /> Featured
                      </span>
                    )}
                    {!project.isVisible && (
                      <span className="bg-red-500/10 border border-red-500/30 text-red-500 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1">
                        <EyeOff size={12} /> Hidden
                      </span>
                    )}
                  </div>
                  <a href={project.url} target="_blank" rel="noreferrer" className="text-xs font-mono text-primary hover:underline flex items-center gap-1">
                    <Github size={14} /> {project.url}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleTogglePin(project)}
                  disabled={isPending}
                  className={`p-2 rounded-md border font-mono text-xs flex items-center gap-1 transition-all cursor-pointer ${
                    project.isPinned
                      ? 'bg-primary text-white border-primary'
                      : 'bg-bg-subtle text-text-muted border-border hover:border-primary'
                  }`}
                  title={project.isPinned ? 'Unpin Project' : 'Pin Project'}
                >
                  <Star size={14} className={project.isPinned ? 'fill-white' : ''} />
                  {project.isPinned ? 'Pinned' : 'Pin'}
                </button>
                <button
                  onClick={() => handleToggleVisibility(project)}
                  disabled={isPending}
                  className={`p-2 rounded-md border font-mono text-xs flex items-center gap-1 transition-all cursor-pointer ${
                    project.isVisible
                      ? 'bg-bg-subtle text-text-muted border-border hover:border-red-500 hover:text-red-500'
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
                  className="p-2 bg-bg-subtle text-text-muted hover:text-primary border border-border hover:border-primary rounded-md transition-all cursor-pointer"
                  title="Customize Project"
                >
                  <Edit size={16} />
                </button>
              </div>
            </div>
            <p className="font-mono text-sm text-text mb-4 leading-relaxed">
              {project.customDesc || project.description || 'No description provided.'}
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border">
              {project.language && (
                <span className="px-2.5 py-1 text-[10px] font-mono font-bold bg-bg-subtle text-primary border border-border rounded-md uppercase tracking-wider shadow-sm">
                  {project.language}
                </span>
              )}
              {project.tags?.map((tag) => (
                <span key={tag} className="px-2.5 py-1 text-[10px] font-mono font-bold bg-bg-subtle text-text-muted border border-border rounded-md uppercase tracking-wider shadow-sm">
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
    <div className="bg-bg-subtle p-8 rounded-md border border-border space-y-6 shadow-sm">
      <div className="flex items-center justify-between mb-6 border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <FolderGit2 size={18} className="text-primary" />
          <h3 className="font-mono font-bold text-lg">Project Customizations</h3>
        </div>
        <span className="text-xs font-mono text-text-muted">
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
            className="bg-bg-subtle border border-border rounded-md p-6 w-full max-w-lg space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center border-b border-border pb-4">
              <h3 className="font-mono font-bold text-lg flex items-center gap-2 text-text">
                <FolderGit2 size={18} className="text-primary" />
                Customize Project
              </h3>
              <button
                onClick={handleCloseAttempt}
                className="text-text-muted hover:text-text transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-mono text-text-muted uppercase tracking-wider">
                  Project Name
                </label>
                <input
                  type="text"
                  value={projectForm.name}
                  onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                  required
                  className="w-full bg-bg border border-border rounded-md p-3 focus:outline-none focus:border-primary transition-colors font-mono text-sm text-text"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-text-muted uppercase tracking-wider">
                  Preview Image URL / Upload
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={projectForm.imageUrl}
                    onChange={(e) => setProjectForm({ ...projectForm, imageUrl: e.target.value })}
                    placeholder="https://... or choose local file"
                    className="w-full bg-bg border border-border rounded-md p-3 focus:outline-none focus:border-primary transition-colors font-mono text-sm text-text"
                  />
                  <button
                    type="button"
                    onClick={() => setIsImageModalOpen(true)}
                    className="flex items-center gap-2 bg-bg-subtle border border-border hover:border-primary px-4 py-2 rounded-md text-xs font-mono text-text cursor-pointer transition-all flex-shrink-0"
                  >
                    <Camera size={16} className="text-primary" />
                    <span>Upload Image</span>
                  </button>
                </div>
                {projectForm.imageUrl && (
                  <div className="mt-2 relative w-32 h-20 rounded-md overflow-hidden border border-border group">
                    <img src={projectForm.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={handleLocalImageDelete}
                      className="absolute top-1 right-1 bg-black/75 hover:bg-red-600 text-white rounded-full p-1 transition-all cursor-pointer shadow-md"
                      title="Delete Image"
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-text-muted uppercase tracking-wider">
                  Custom Description
                </label>
                <textarea
                  rows={4}
                  value={projectForm.customDesc}
                  onChange={(e) => setProjectForm({ ...projectForm, customDesc: e.target.value })}
                  placeholder={editingProject.description || 'Enter custom description...'}
                  className="w-full bg-bg border border-border rounded-md p-3 focus:outline-none focus:border-primary transition-colors font-mono text-sm text-text resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-text-muted uppercase tracking-wider">
                  Programming Language
                </label>
                <input
                  type="text"
                  value={projectForm.language}
                  onChange={(e) => setProjectForm({ ...projectForm, language: e.target.value })}
                  placeholder="e.g. TypeScript, Python"
                  className="w-full bg-bg border border-border rounded-md p-3 focus:outline-none focus:border-primary transition-colors font-mono text-sm text-text"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-text-muted uppercase tracking-wider">
                  Custom Tags (Comma separated)
                </label>
                <input
                  type="text"
                  value={projectForm.tags.join(', ')}
                  onChange={(e) => setProjectForm({ ...projectForm, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })}
                  placeholder="e.g. React, NestJS, Supabase"
                  className="w-full bg-bg border border-border rounded-md p-3 focus:outline-none focus:border-primary transition-colors font-mono text-sm text-text"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
                <label className="flex items-center gap-2 cursor-pointer p-3 bg-bg border border-border rounded-md hover:border-primary transition-all">
                  <input
                    type="checkbox"
                    checked={projectForm.isPinned}
                    onChange={(e) => setProjectForm({ ...projectForm, isPinned: e.target.checked })}
                    className="rounded-md border-border text-primary focus:ring-primary"
                  />
                  <span className="text-xs font-mono text-text">Pin (Featured)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer p-3 bg-bg border border-border rounded-md hover:border-primary transition-all">
                  <input
                    type="checkbox"
                    checked={projectForm.isVisible}
                    onChange={(e) => setProjectForm({ ...projectForm, isVisible: e.target.checked })}
                    className="rounded-md border-border text-primary focus:ring-primary"
                  />
                  <span className="text-xs font-mono text-text">Visible to Public</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={handleCloseAttempt}
                  className="px-4 py-2 bg-bg border border-border rounded-md font-mono text-sm text-text hover:bg-bg-subtle hover:border-text-muted transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-6 py-2 bg-primary text-white rounded-md font-mono text-sm hover:bg-primary-dim transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  {isPending ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {showCloseConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-bg-subtle border border-border rounded-md p-6 w-full max-w-sm space-y-4 shadow-2xl relative text-center"
          >
            <h4 className="font-mono font-bold text-base text-text">
              Discard Changes?
            </h4>
            <p className="font-mono text-xs text-text-muted leading-relaxed">
              You have unsaved changes. If you close now, your customizations will be discarded.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowCloseConfirm(false)}
                className="px-4 py-2 bg-bg border border-border rounded-md font-mono text-xs text-text hover:bg-bg-subtle hover:border-text-muted transition-all cursor-pointer"
              >
                Keep Editing
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 bg-red-600 text-white rounded-md font-mono text-xs hover:bg-red-500 transition-all cursor-pointer shadow-md"
              >
                Discard Changes
              </button>
            </div>
          </motion.div>
        </div>
      )}
      <ImageUploadModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        onUpload={async (file) => {
          handleLocalImageUpload(file);
        }}
        onDelete={async () => {
          handleLocalImageDelete();
        }}
        currentImageUrl={projectForm.imageUrl}
        title="Project Preview Image"
      />
    </div>
  );
}
