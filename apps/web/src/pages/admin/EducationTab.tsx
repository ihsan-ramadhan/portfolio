import React, { useState } from 'react';
import { GraduationCap, Plus, Edit, Trash2, X, Calendar, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Education } from '../../types';
import { useEducations, useCreateEducation, useUpdateEducation, useDeleteEducation } from '../../hooks/use-education';

interface EducationTabProps {
  token: string | null;
  setMessage: (msg: { text: string; type: string }) => void;
}

export function EducationTab({ token, setMessage }: Readonly<EducationTabProps>) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEdu, setEditingEdu] = useState<Education | null>(null);
  const [form, setForm] = useState({
    institution: '',
    major: '',
    startYear: new Date().getFullYear() - 4,
    endYear: new Date().getFullYear(),
    order: 1,
  });

  const { data: educations = [], isLoading } = useEducations();
  const createEduMut = useCreateEducation();
  const updateEduMut = useUpdateEducation();
  const deleteEduMut = useDeleteEducation();
  const isPending = createEduMut.isPending || updateEduMut.isPending;

  const handleOpenAdd = () => {
    setEditingEdu(null);
    setForm({ institution: '', major: '', startYear: new Date().getFullYear() - 4, endYear: new Date().getFullYear(), order: educations.length + 1 });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (edu: Education) => {
    setEditingEdu(edu);
    setForm({
      institution: edu.institution,
      major: edu.major,
      startYear: edu.startYear,
      endYear: edu.endYear || new Date().getFullYear(),
      order: edu.order || 1,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      if (editingEdu) {
        await updateEduMut.mutateAsync({
          id: editingEdu.id!,
          data: form,
          token,
        });
        setMessage({ text: 'Education updated successfully!', type: 'success' });
      } else {
        await createEduMut.mutateAsync({
          data: form,
          token,
        });
        setMessage({ text: 'Education added successfully!', type: 'success' });
      }
      setIsModalOpen(false);
    } catch {
      setMessage({ text: 'Failed to save education', type: 'error' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!token || !confirm('Are you sure you want to delete this education record?')) return;
    try {
      await deleteEduMut.mutateAsync({ id, token });
      setMessage({ text: 'Education deleted successfully!', type: 'success' });
    } catch {
      setMessage({ text: 'Failed to delete education', type: 'error' });
    }
  };

  if (isLoading) {
    return <div className="font-mono text-[var(--color-text-muted)] animate-pulse">Loading education...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-[var(--color-bg-subtle)] p-8 rounded-xl border border-[var(--color-border)]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <GraduationCap size={18} className="text-[var(--color-primary)]" />
            <h3 className="font-mono font-bold">Manage Education</h3>
          </div>
          <button 
            onClick={handleOpenAdd}
            className="flex items-center gap-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dim)] text-white text-xs font-mono px-4 py-2 rounded-lg cursor-pointer transition-all"
          >
            <Plus size={14} /> Add Education
          </button>
        </div>

        {educations.length === 0 ? (
          <div className="text-center py-8 text-[var(--color-text-muted)] font-mono text-sm border border-dashed border-[var(--color-border)] rounded-xl">
            No education records found.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {educations.map((edu) => (
              <div 
                key={edu.id} 
                className="bg-[var(--color-bg)] p-5 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-primary)]/40 transition-colors flex justify-between items-start gap-4"
              >
                <div className="space-y-2">
                  <h4 className="font-bold font-sans text-base">{edu.institution}</h4>
                  <p className="text-xs font-mono text-[var(--color-primary)]">{edu.major}</p>
                  <p className="text-xs text-[var(--color-text-muted)] flex items-center gap-1">
                    <Calendar size={12} /> {edu.startYear} - {edu.endYear || 'Present'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleOpenEdit(edu)}
                    className="p-2 hover:bg-[var(--color-bg-subtle)] rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-primary)] transition-colors cursor-pointer"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(edu.id!)}
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
                {editingEdu ? 'Edit Education' : 'Add Education'}
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
                <label className="text-xs font-mono text-[var(--color-text-muted)] uppercase">Institution</label>
                <input 
                  type="text" 
                  required
                  value={form.institution}
                  onChange={(e) => setForm({...form, institution: e.target.value})}
                  className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg p-2.5 focus:outline-none focus:border-[var(--color-primary)] transition-colors font-mono text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-[var(--color-text-muted)] uppercase">Major / Field of Study</label>
                <input 
                  type="text" 
                  required
                  value={form.major}
                  onChange={(e) => setForm({...form, major: e.target.value})}
                  className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg p-2.5 focus:outline-none focus:border-[var(--color-primary)] transition-colors font-mono text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-[var(--color-text-muted)] uppercase">Start Year</label>
                  <input 
                    type="number" 
                    required
                    value={form.startYear}
                    onChange={(e) => setForm({...form, startYear: parseInt(e.target.value) || new Date().getFullYear()})}
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg p-2.5 focus:outline-none focus:border-[var(--color-primary)] transition-colors font-mono text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-[var(--color-text-muted)] uppercase">End Year (or Expected)</label>
                  <input 
                    type="number" 
                    required
                    value={form.endYear}
                    onChange={(e) => setForm({...form, endYear: parseInt(e.target.value) || new Date().getFullYear()})}
                    className="w-full bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg p-2.5 focus:outline-none focus:border-[var(--color-primary)] transition-colors font-mono text-sm"
                  />
                </div>
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
                {isPending ? 'Saving...' : 'Save Education'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
