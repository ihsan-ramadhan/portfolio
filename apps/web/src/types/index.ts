export interface Profile {
  headline: string;
  bio: string;
  location: string;
  photoUrl: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  image?: string;
  tags: string[];
  language?: string;
  url: string;
  demoUrl?: string;
  category?: string;
}
