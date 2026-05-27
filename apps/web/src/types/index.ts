export interface Profile {
  headline: string;
  bio: string;
  location: string;
  photoUrl: string;
  statusBadge?: string;
  tagline?: string;
}

export interface Project {
  id: string;
  githubId?: number;
  name: string;
  description?: string;
  customDesc?: string;
  imageUrl?: string;
  url: string;
  language?: string;
  stars: number;
  tags: string[];
  isPinned: boolean;
  pinnedAt?: string;
  isVisible: boolean;
  lastSyncedAt?: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  statusCode: number;
}

export interface Skill {
  id: string;
  name: string;
  category: 'FRONTEND' | 'BACKEND' | 'TOOLS' | 'OTHERS';
  proficiency: number;
  icon?: string;
  url?: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

