import React, { useState } from 'react';
import { Briefcase, Plus, Edit, Trash2, X, Calendar, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Experience } from '../../types';
import { useExperiences } from '../../hooks/use-experience';
import { useCreateExperience, useUpdateExperience, useDeleteExperience } from '../../hooks/use-admin-experience';

interface ExperienceTabProps {
  token: string | null;
  setMessage: (msg: { text: string; type: string }) => void;
}

export function ExperienceTab({ token, setMessage }: Readonly<ExperienceTabProps>) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [form, setForm] = useState({
    company: '',
    position: '',
    startDate: '',
    endDate: 'Present',
    description: '',
    order: 1,
  });

  const { data: experiences = [], isLoading } = useExperiences();
  const createExpMut = useCreateExperience();
  const updateExpMut = useUpdateExperience();
  const deleteExpMut = useDeleteExperience();
  const isPending = createExpMut.isPending || updateExpMut.isPending;

  const handleOpenAdd = () => {
    setEditingExp(null);
    setForm({ company: '', position: '', startDate: '', endDate: 'Present', description: '', order: experiences.length + 1 });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (exp: Experience) => {
    setEditingExp(exp);
    setForm({
      company: exp.company,
      position: exp.position,
      startDate: exp.startDate,
      endDate: exp.endDate || 'Present',
      description: exp.description || '',
      order: exp.order || 1,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      if (editingExp) {
        await updateExpMut.mutateAsync({
          id: editingExp.id!,
          data: form,
          token,
        });
        setMessage({ text: 'Experience updated successfully!', type: 'success' });
      } else {
        await createExpMut.mutateAsync({
          data: form,
          token,
        });
        setMessage({ text: 'Experience added successfully!', type: 'success' });
      }
      setIsModalOpen(false);
    } catch {
      setMessage({ text: 'Failed to save experience', type: 'error' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!token || !confirm('Are you sure you want to delete this experience?')) return;
    try {
      await deleteExpMut.mutateAsync({ id, token });
      setMessage({ text: 'Experience deleted successfully!', type: 'success' });
    } catch {
      setMessage({ text: 'Failed to delete experience', type: 'error' });
    }
  };

  if (isLoading) {
    return <div className="font-mono text-[var(--color-text-muted)] animate-pulse">Loading experiences...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-[var(--color-bg-subtle)] p-8 rounded-xl border border-[var(--color-border)]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Briefcase size={18} className="text-[var(--color-primary)]" />
            <h3 className="font-mono font-bold">Manage Experience</h3>
          </div>
          <button 
            onClick={handleOpenAdd}
            className="flex items-center gap-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dim)] text-white text-xs font-mono px-4 py-2 rounded-lg cursor-pointer transition-all"
          >
            <Plus size={14} /> Add Experience
          </button>
        </div>

        {experiences.length === 0 ? (
          <div className="text-center py-8 text-[var(--color-text-muted)] font-mono text-sm border border-dashed border-[var(--color-border)] rounded-xl">
            No experience records found.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {experiences.map((exp) => (
              <div 
                key={exp.id} 
                className="bg-[var(--color-bg)] p-5 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-primary)]/40 transition-colors flex justify-between items-start gap-4"
              >
                <div className="space-y-2">
                  <h4 className="font-bold font-sans text-base">{exp.position}</h4>
                  <p className="text-xs font-mono text-[var(--color-primary)]">{exp.company}</p>
                  <p className="text-xs text-[var(--color-text-muted)] flex items-center gap-1">
                    <Calendar size={12} /> {exp.startDate} - {exp.endDate || 'Present'}
                  </p>
                  {exp.description && (
                    <p className="text-sm text-[var(--color-text-muted)] max-w-2xl whitespace-pre-wrap">{exp.description}</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleOpenEdit(exp)}
                    className="p-2 hover:bg-[var(--color-bg-subtle)] rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors cursor-pointer"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(exp.id!)}
                    className="p-2 hover:bg-[var(--color-bg-subtle)] rounded-lg text-[var(--color-text-muted)] hover:text-red-400 transition-colors cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[var(--color-bg-subtle)] w-full max-w-lg rounded-xl border border-[var(--color-border)] overflow-hidden shadow-2xl"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)] bg-[var(--color-bg)]">
              <h3 className="font-mono font-bold text-sm">
                {editingExp ? 'Edit Experience' : 'Add Experience'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-[var(--color-text-muted)] hover:text-[var(--color-text)] cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-mono text-[var(--color-text-muted)] uppercase">Company</label>
                <input 
                  type="text" 
                  required
                  value={form.company}
                  onChange={(e) => setForm({...form, company: e.target.value})}
                  className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg p-2.5 focus:outline-none focus:border-[var(--color-primary)] transition-colors font-mono text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-[var(--color-text-muted)] uppercase">Position</label>
                <input 
                  type="text" 
                  required
                  value={form.position}
                  onChange={(e) => setForm({...form, position: e.target.value})}
                  className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg p-2.5 focus:outline-none focus:border-[var(--color-primary)] transition-colors font-mono text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-[var(--color-text-muted)] uppercase">Start Date</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Jan 2024"
                    required
                    value={form.startDate}
                    onChange={(e) => setForm({...form, startDate: e.target.value})}
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg p-2.5 focus:outline-none focus:border-[var(--color-primary)] transition-colors font-mono text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-[var(--color-text-muted)] uppercase">End Date</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Present or Dec 2024"
                    required
                    value={form.endDate}
                    onChange={(e) => setForm({...form, endDate: e.target.value})}
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg p-2.5 focus:outline-none focus:border-[var(--color-primary)] transition-colors font-mono text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-[var(--color-text-muted)] uppercase">Description</label>
                <textarea 
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm({...form, description: e.target.value})}
                  className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg p-2.5 focus:outline-none focus:border-[var(--color-primary)] transition-colors font-mono text-sm resize-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-[var(--color-text-muted)] uppercase">Display Order</label>
                <input 
                  type="number" 
                  required
                  value={form.order}
                  onChange={(e) => setForm({...form, order: parseInt(e.target.value) || 1})}
                  className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg p-2.5 focus:outline-none focus:border-[var(--color-primary)] transition-colors font-mono text-sm"
                />
              </div>

              <button 
                type="submit"
                disabled={isPending}
                className="w-full flex items-center justify-center gap-2 bg-[var(--color-primary)] text-white font-mono py-2.5 rounded-lg hover:bg-[var(--color-primary-dim)] transition-all disabled:opacity-50 cursor-pointer shadow-md text-sm"
              >
                <Save size={16} />
                {isPending ? 'Saving...' : 'Save Experience'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
