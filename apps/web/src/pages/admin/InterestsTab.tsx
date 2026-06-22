import React, { useState } from 'react';
import { Sparkles, Plus, Edit2, Trash2, X, GripVertical, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Interest } from '../../types';
import { useInterests } from '../../hooks/use-interests';
import { useCreateInterest, useUpdateInterest, useDeleteInterest } from '../../hooks/use-admin-interests';

interface InterestsTabProps {
  token: string | null;
  setMessage: (msg: { text: string; type: string }) => void;
}

export function InterestsTab({ token, setMessage }: Readonly<InterestsTabProps>) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInterest, setEditingInterest] = useState<Interest | null>(null);
  const [form, setForm] = useState({ name: '', order: 0 });

  const { data: interests = [], isLoading } = useInterests();
  const createMut = useCreateInterest();
  const updateMut = useUpdateInterest();
  const deleteMut = useDeleteInterest();
  const isPending = createMut.isPending || updateMut.isPending;

  const handleOpenAdd = () => {
    setEditingInterest(null);
    setForm({ name: '', order: interests.length });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (interest: Interest) => {
    setEditingInterest(interest);
    setForm({ name: interest.name, order: interest.order });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    try {
      if (editingInterest) {
        await updateMut.mutateAsync({ id: editingInterest.id, data: form, token });
        setMessage({ text: 'Interest updated successfully!', type: 'success' });
      } else {
        await createMut.mutateAsync({ data: form, token });
        setMessage({ text: 'Interest added successfully!', type: 'success' });
      }
      setIsModalOpen(false);
    } catch {
      setMessage({ text: 'Failed to save interest', type: 'error' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!token || !confirm('Delete this interest?')) return;
    try {
      await deleteMut.mutateAsync({ id, token });
      setMessage({ text: 'Interest deleted successfully!', type: 'success' });
    } catch {
      setMessage({ text: 'Failed to delete interest', type: 'error' });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-3 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-12 bg-bg-subtle rounded-md border border-border" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-bg-subtle p-8 rounded-md border border-border">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-primary" />
            <div>
              <h3 className="font-mono font-bold">Manage Interests</h3>
              <p className="text-xs text-text-muted font-mono mt-0.5">
              </p>
            </div>
          </div>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 bg-primary hover:bg-primary-dim text-white text-xs font-mono px-4 py-2 rounded-md cursor-pointer transition-all shadow-md"
          >
            <Plus size={14} /> Add Interest
          </button>
        </div>

        {interests.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-border rounded-md">
            <Sparkles size={32} className="mx-auto text-text-muted mb-3 opacity-40" />
            <p className="font-mono text-sm text-text-muted">No interests yet</p>
            <p className="font-mono text-xs text-text-muted mt-1 opacity-60">
              Add things you are passionate about
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <AnimatePresence>
              {interests.map((interest) => (
                <motion.div
                  key={interest.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="group flex items-center justify-between gap-3 bg-bg border border-border hover:border-primary/50 rounded-md px-4 py-3 transition-all"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <GripVertical
                      size={14}
                      className="text-text-muted opacity-40 shrink-0"
                    />
                    <div className="w-7 h-7 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                      <Tag size={12} className="text-primary" />
                    </div>
                    <span className="font-mono text-sm font-semibold text-text truncate">
                      {interest.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleOpenEdit(interest)}
                      className="p-1.5 hover:bg-bg-subtle rounded-md text-text-muted hover:text-primary transition-colors cursor-pointer"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(interest.id)}
                      className="p-1.5 hover:bg-bg-subtle rounded-md text-text-muted hover:text-red-400 transition-colors cursor-pointer"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.2 }}
              className="bg-bg-subtle w-full max-w-sm rounded-md border border-border overflow-hidden shadow-2xl"
            >
              <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-bg">
                <div className="flex items-center gap-2">
                  <Tag size={15} className="text-primary" />
                  <h3 className="font-mono font-bold text-sm">
                    {editingInterest ? 'Edit Interest' : 'Add Interest'}
                  </h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-text-muted hover:text-text cursor-pointer transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-text-muted uppercase tracking-wider">
                    Interest Name
                  </label>
                  <input
                    type="text"
                    required
                    autoFocus
                    placeholder="e.g. Open Source, System Design, Coffee..."
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-bg border border-border rounded-md p-2.5 focus:outline-none focus:border-primary transition-colors font-mono text-sm placeholder:text-text-muted/50"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-text-muted uppercase tracking-wider">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.order}
                    onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                    className="w-full bg-bg border border-border rounded-md p-2.5 focus:outline-none focus:border-primary transition-colors font-mono text-sm"
                  />
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-2.5 border border-border rounded-md font-mono text-sm text-text-muted hover:text-text transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="flex-1 flex items-center justify-center gap-2 bg-primary text-white font-mono py-2.5 rounded-md hover:bg-primary-dim transition-all disabled:opacity-50 cursor-pointer shadow-md text-sm"
                  >
                    <Sparkles size={14} />
                    {isPending ? 'Saving...' : editingInterest ? 'Update' : 'Add'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
