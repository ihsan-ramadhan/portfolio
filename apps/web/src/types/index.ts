export interface Profile {
  headline: string;
  bio: string;
  location: string;
  photoUrl: string;
}

export interface Project {
  id: string;
  githubId?: number;
  name: string;
  description?: string;
  customDesc?: string;
  url: string;
  language?: string;
  stars: number;
  tags: string[];
  isPinned: boolean;
  isVisible: boolean;
  lastSyncedAt?: string;
}

export interface ApiResponse<T> {
  data: T;
  message: string;
  statusCode: number;
}
