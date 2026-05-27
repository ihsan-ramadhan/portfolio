import { useState } from 'react';
import { Layout, ArrowUp, ArrowDown, Save, Eye, EyeOff } from 'lucide-react';
import type { SiteSection } from '../../types';
import { useSections, useUpdateSection, useReorderSections } from '../../hooks/use-sections';

interface SectionsTabProps {
  token: string | null;
  setMessage: (msg: { text: string; type: string }) => void;
}

export function SectionsTab({ token, setMessage }: Readonly<SectionsTabProps>) {
  const { data: sectionsData = [], isLoading } = useSections();
  const updateSectionMut = useUpdateSection();
  const reorderSectionsMut = useReorderSections();

  const [localSections, setLocalSections] = useState<SiteSection[]>([]);
  const [prevSectionsData, setPrevSectionsData] = useState<SiteSection[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  if (sectionsData !== prevSectionsData && sectionsData.length > 0) {
    setPrevSectionsData(sectionsData);
    setLocalSections([...sectionsData].sort((a, b) => a.order - b.order));
  }

  const handleToggle = async (section: SiteSection) => {
    if (!token) return;
    try {
      await updateSectionMut.mutateAsync({
        id: section.id,
        data: { isEnabled: !section.isEnabled },
        token,
      });
      setMessage({ text: `Section '${section.name}' updated!`, type: 'success' });
    } catch {
      setMessage({ text: 'Failed to update section visibility', type: 'error' });
    }
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === localSections.length - 1) return;

    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const newSections = [...localSections];
    
    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;

    const updatedSections = newSections.map((sec, idx) => ({
      ...sec,
      order: idx + 1,
    }));

    setLocalSections(updatedSections);
    setHasChanges(true);
  };

  const handleSaveOrder = async () => {
    if (!token) return;
    try {
      const payload = localSections.map((sec) => ({
        name: sec.name,
        order: sec.order,
      }));
      await reorderSectionsMut.mutateAsync({
        sections: payload,
        token,
      });
      setHasChanges(false);
      setMessage({ text: 'Sections order saved successfully!', type: 'success' });
    } catch {
      setMessage({ text: 'Failed to save sections order', type: 'error' });
    }
  };

  if (isLoading) {
    return <div className="font-mono text-[var(--color-text-muted)] animate-pulse">Loading sections data...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-[var(--color-bg-subtle)] p-8 rounded-xl border border-[var(--color-border)]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Layout size={18} className="text-[var(--color-primary)]" />
            <h3 className="font-mono font-bold">Manage Site Sections</h3>
          </div>
          {hasChanges && (
            <button
              onClick={handleSaveOrder}
              disabled={reorderSectionsMut.isPending}
              className="flex items-center gap-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-dim)] text-white text-xs font-mono px-4 py-2 rounded-lg cursor-pointer transition-all"
            >
              <Save size={14} />
              Save New Order
            </button>
          )}
        </div>

        <div className="space-y-3">
          {localSections.map((section, idx) => (
            <div
              key={section.id}
              className="flex items-center justify-between bg-[var(--color-bg)] p-4 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-primary)]/40 transition-colors"
            >
              <div className="flex items-center gap-4">
                <span className="font-mono text-xs text-[var(--color-text-muted)]">
                  #{section.order}
                </span>
                <span className="font-mono font-bold capitalize text-sm">
                  {section.name}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 border-r border-[var(--color-border)] pr-3">
                  <button
                    onClick={() => moveSection(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1.5 hover:bg-[var(--color-bg-subtle)] rounded text-[var(--color-text-muted)] hover:text-[var(--color-primary)] disabled:opacity-30 cursor-pointer"
                    title="Move Up"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    onClick={() => moveSection(idx, 'down')}
                    disabled={idx === localSections.length - 1}
                    className="p-1.5 hover:bg-[var(--color-bg-subtle)] rounded text-[var(--color-text-muted)] hover:text-[var(--color-primary)] disabled:opacity-30 cursor-pointer"
                    title="Move Down"
                  >
                    <ArrowDown size={14} />
                  </button>
                </div>

                <button
                  onClick={() => handleToggle(section)}
                  disabled={updateSectionMut.isPending}
                  className={`flex items-center gap-1.5 font-mono text-xs px-3 py-1.5 rounded-lg border cursor-pointer transition-colors ${
                    section.isEnabled
                      ? 'bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20'
                      : 'bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20'
                  }`}
                >
                  {section.isEnabled ? <Eye size={12} /> : <EyeOff size={12} />}
                  <span>{section.isEnabled ? 'Enabled' : 'Disabled'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
