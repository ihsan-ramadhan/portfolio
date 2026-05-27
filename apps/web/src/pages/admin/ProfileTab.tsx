import React from 'react';
import { User, Layout, MapPin, FileText, Save, Activity } from 'lucide-react';
import type { Profile } from '../../types';

interface ProfileTabProps {
  profile: Profile;
  setProfile: (profile: Profile) => void;
  saving: boolean;
  handleUpdateProfile: (e: React.FormEvent) => void;
}

export function ProfileTab({ profile, setProfile, saving, handleUpdateProfile }: ProfileTabProps) {
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
          <FileText size={14} /> Tagline
        </label>
        <input 
          type="text" 
          placeholder="Leave empty to hide tagline"
          value={profile.tagline || ''}
          onChange={(e) => setProfile({...profile, tagline: e.target.value})}
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
          <Activity size={14} /> Status Badge
        </label>
        <input 
          type="text" 
          placeholder="Leave empty to hide badge"
          value={profile.statusBadge || ''}
          onChange={(e) => setProfile({...profile, statusBadge: e.target.value})}
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
        className="flex items-center gap-2 bg-[var(--color-primary)] text-white font-mono px-6 py-3 rounded-lg hover:bg-[var(--color-primary-dim)] transition-all active:scale-95 disabled:opacity-50 cursor-pointer shadow-md"
      >
        <Save size={18} />
        {saving ? 'Saving Changes...' : 'Save Profile'}
      </button>
    </form>
  );
}
