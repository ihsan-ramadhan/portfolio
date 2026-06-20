import React, { useState } from 'react';
import { Code, Plus, Edit, Trash2, X } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Skill } from '../../types';
import { useSkills } from '../../hooks/use-skills';
import { useCreateSkill, useUpdateSkill, useDeleteSkill } from '../../hooks/use-admin-skills';

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
    url: '',
  });

  const { data: skills = [], isLoading: skillsLoading } = useSkills();
  const createSkillMut = useCreateSkill();
  const updateSkillMut = useUpdateSkill();
  const deleteSkillMut = useDeleteSkill();
  const isPending = createSkillMut.isPending || updateSkillMut.isPending;

  const handleOpenAddSkill = () => {
    setEditingSkill(null);
    setSkillForm({ name: '', category: 'FRONTEND', proficiency: 80, icon: '', url: '' });
    setIsSkillModalOpen(true);
  };

  const handleOpenEditSkill = (skill: Skill) => {
    setEditingSkill(skill);
    setSkillForm({
      name: skill.name,
      category: skill.category,
      proficiency: skill.proficiency,
      icon: skill.icon || '',
      url: skill.url || '',
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
    if (!token || !confirm('Are you sure you want to delete this skill?')) return;
    try {
      await deleteSkillMut.mutateAsync({ id, token });
      setMessage({ text: 'Skill deleted successfully!', type: 'success' });
    } catch {
      setMessage({ text: 'Failed to delete skill', type: 'error' });
    }
  };

  if (skillsLoading) {
    return <div className="font-mono text-text-muted animate-pulse">Loading skills...</div>;
  }

  const categories: Skill['category'][] = ['FRONTEND', 'BACKEND', 'TOOLS', 'OTHERS'];

  return (
    <div className="space-y-6">
      <div className="bg-bg-subtle p-8 rounded-xl border border-border">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Code size={18} className="text-primary" />
            <h3 className="font-mono font-bold">Manage Skills</h3>
          </div>
          <button 
            onClick={handleOpenAddSkill}
            className="flex items-center gap-2 bg-primary hover:bg-primary-dim text-white text-xs font-mono px-4 py-2 rounded-lg cursor-pointer transition-all"
          >
            <Plus size={14} /> Add Skill
          </button>
        </div>

        <div className="space-y-6">
          {categories.map((cat) => {
            const catSkills = skills.filter((s) => s.category === cat);
            if (catSkills.length === 0) return null;

            return (
              <div key={cat} className="space-y-3">
                <h4 className="font-mono text-xs text-text-muted uppercase border-b border-border pb-1">{cat}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {catSkills.map((skill) => (
                    <div 
                      key={skill.id} 
                      className="bg-bg p-4 rounded-lg border border-border hover:border-primary/40 transition-colors flex justify-between items-center"
                    >
                      <div className="flex items-center gap-3">
                        {skill.icon && (
                          <div className="w-8 h-8 rounded-lg bg-bg-subtle border border-border p-1.5 flex items-center justify-center">
                            <img 
                              src={`https://cdn.simpleicons.org/${skill.icon}/3b82f6`} 
                              alt={skill.name} 
                              className="w-full h-full object-contain opacity-70"
                            />
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-sm">{skill.name}</p>
                          <p className="text-[10px] font-mono text-text-muted">Proficiency: {skill.proficiency}%</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => handleOpenEditSkill(skill)}
                          className="p-1.5 hover:bg-bg-subtle rounded-md text-text-muted hover:text-primary transition-colors cursor-pointer"
                        >
                          <Edit size={14} />
                        </button>
                        <button 
                          onClick={() => handleDeleteSkill(skill.id)}
                          className="p-1.5 hover:bg-bg-subtle rounded-md text-text-muted hover:text-red-400 transition-colors cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {isSkillModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-bg-subtle w-full max-w-md rounded-xl border border-border overflow-hidden shadow-2xl"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-bg">
              <h3 className="font-mono font-bold text-sm">
                {editingSkill ? 'Edit Skill' : 'Add Skill'}
              </h3>
              <button 
                onClick={() => setIsSkillModalOpen(false)}
                className="text-text-muted hover:text-text cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveSkill} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-mono text-text-muted uppercase">Skill Name</label>
                <input 
                  type="text" 
                  required
                  value={skillForm.name}
                  onChange={(e) => setSkillForm({...skillForm, name: e.target.value})}
                  className="w-full bg-bg border border-border rounded-lg p-2.5 focus:outline-none focus:border-primary transition-colors font-mono text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-text-muted uppercase">Category</label>
                <select 
                  value={skillForm.category}
                  onChange={(e) => setSkillForm({...skillForm, category: e.target.value as Skill['category']})}
                  className="w-full bg-bg border border-border rounded-lg p-2.5 focus:outline-none focus:border-primary transition-colors font-mono text-sm"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-text-muted uppercase">Proficiency (%)</label>
                <input 
                  type="number" 
                  required
                  min="0"
                  max="100"
                  value={skillForm.proficiency}
                  onChange={(e) => setSkillForm({...skillForm, proficiency: parseInt(e.target.value) || 0})}
                  className="w-full bg-bg border border-border rounded-lg p-2.5 focus:outline-none focus:border-primary transition-colors font-mono text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-text-muted uppercase flex items-center justify-between">
                  <span>SimpleIcon Slug</span>
                  <span className="text-[9px] text-text-muted lowercase">e.g. react, node-dot-js</span>
                </label>
                <input 
                  type="text" 
                  value={skillForm.icon}
                  onChange={(e) => setSkillForm({...skillForm, icon: e.target.value})}
                  className="w-full bg-bg border border-border rounded-lg p-2.5 focus:outline-none focus:border-primary transition-colors font-mono text-sm"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono text-text-muted uppercase">Documentation / Search URL</label>
                <input 
                  type="url" 
                  value={skillForm.url}
                  onChange={(e) => setSkillForm({...skillForm, url: e.target.value})}
                  className="w-full bg-bg border border-border rounded-lg p-2.5 focus:outline-none focus:border-primary transition-colors font-mono text-sm"
                />
              </div>

              <button 
                type="submit"
                disabled={isPending}
                className="w-full flex items-center justify-center gap-2 bg-primary text-white font-mono py-2.5 rounded-lg hover:bg-primary-dim transition-all disabled:opacity-50 cursor-pointer shadow-md text-sm"
              >
                <Code size={16} />
                {isPending ? 'Saving...' : 'Save Skill'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
