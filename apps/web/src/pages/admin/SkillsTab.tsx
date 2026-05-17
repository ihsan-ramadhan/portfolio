import React, { useState } from 'react';
import { Code, Plus, Edit, Trash2, X } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Skill } from '../../types';
import { useSkills, useCreateSkill, useUpdateSkill, useDeleteSkill } from '../../hooks/use-skills';

interface SkillsTabProps {
  token: string | null;
  setMessage: (msg: { text: string; type: string }) => void;
}

export function SkillsTab({ token, setMessage }: Readonly<SkillsTabProps>) {
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [skillForm, setSkillForm] = useState({
    name: '',
    category: 'FRONTEND' as Skill['category'],
    proficiency: 80,
    icon: '',
  });

  const { data: skills = [], isLoading: skillsLoading } = useSkills();
  const createSkillMut = useCreateSkill();
  const updateSkillMut = useUpdateSkill();
  const deleteSkillMut = useDeleteSkill();
  const isPending = createSkillMut.isPending || updateSkillMut.isPending;

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

  return (
    <div className="bg-[var(--color-bg-subtle)] p-8 rounded-xl border border-[var(--color-border)] space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Code size={18} className="text-[var(--color-primary)]" />
          <h3 className="font-mono font-bold text-lg">Tech Stack & Skills</h3>
        </div>
        <button
          onClick={handleOpenAddSkill}
          className="flex items-center gap-2 bg-[var(--color-primary)] text-white font-mono px-4 py-2 rounded-lg text-sm hover:bg-[var(--color-primary-dim)] transition-all active:scale-95 cursor-pointer shadow-md"
        >
          <Plus size={16} /> Add Skill
        </button>
      </div>

      {renderSkillsList()}

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
                  Check available icon slugs at <a href="https://simpleicons.org" target="_blank" rel="noreferrer" className="text-[var(--color-primary)] underline hover:text-[var(--color-primary-dim)]">simpleicons.org</a>
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
                  disabled={isPending}
                  className="px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg font-mono text-sm hover:bg-[var(--color-primary-dim)] transition-all active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  {isPending ? 'Saving...' : 'Save Skill'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
