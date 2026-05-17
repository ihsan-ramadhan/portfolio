import type { Profile, Project } from '../types';

export const DEFAULT_PROFILE: Profile = {
  headline: 'Full Stack Developer',
  bio: `An Informatics Engineering student at Politeknik Negeri Bandung with a strong passion for building digital solutions across Web Development. I am proficient in a diverse tech stack, including backend (Laravel, NestJS) and frontend (Vue.js, React, Next.js), to deliver functional and user-friendly applications.

Beyond engineering, I possess a strong entrepreneurial mindset as the Founder of Teladan Store, where I successfully managed over 375 digital asset transactions with a strict focus on customer satisfaction and security. My experience as a Secretary at DKM Luqmanul Hakim has further honed my skills in administrative management, documentation, and cross-functional team collaboration.

Currently, I am actively expanding my expertise in Quality Assurance (QA). I firmly believe that great software development goes beyond writing code, it is about ensuring system quality, performance, and reliability through rigorous testing. I am open to internship opportunities, professional collaborations, and discussions regarding technology or product development.`,
  photoUrl: 'https://bazygffrfmblwarsytef.supabase.co/storage/v1/object/public/portfolio/profile-photo-1778767997628',
  location: 'Bandar Lampung, Indonesia',
};

export const FALLBACK_PROJECTS: Project[] = [
  {
    id: 'fallback-1',
    name: 'polban-dataview',
    description: 'Modern analytical dashboard for real-time visualization of general, academic, and student data of study programs with Cloud-Native architecture.',
    url: 'https://github.com/ihsan-ramadhan/polban-dataview',
    language: 'Vue',
    stars: 1,
    tags: [],
    isVisible: true,
    isPinned: true
  },
  {
    id: 'fallback-2',
    name: 'smart-traffic-signs',
    description: "A 'Phygital' traffic education platform turning street signs into interactive learning spots via QR Codes & Gamification. (PKM-PI 2026)",
    url: 'https://github.com/ihsan-ramadhan/smart-traffic-signs',
    language: 'JavaScript',
    stars: 0,
    tags: [],
    isVisible: true,
    isPinned: true
  },
  {
    id: 'fallback-3',
    name: 'portfolio',
    description: 'My own portfolio website built with NestJS, React, and Supabase.',
    url: 'https://github.com/ihsan-ramadhan/portfolio',
    language: 'TypeScript',
    stars: 0,
    tags: [],
    isVisible: true,
    isPinned: true
  },
  {
    id: 'fallback-4',
    name: 'ReksaTani-App',
    description: "A system for managing transactions and acquiring agricultural commodities.",
    url: 'https://github.com/Umeem26/ReksaTani-App',
    language: 'Dart',
    stars: 0,
    tags: [],
    isVisible: true,
    isPinned: true
  },
  {
    id: 'fallback-5',
    name: 'Photobooth-Studio',
    description: 'A modern Desktop Photobooth application with Cloud Integration, QR Code generation, and Clean Architecture implementation.',
    url: 'https://github.com/Umeem26/Photobooth-Studio',
    language: 'Java',
    stars: 0,
    tags: [],
    isVisible: true,
    isPinned: true
  },
  {
    id: 'fallback-6',
    name: 'Proyek2-C3',
    description: 'Space invaders 2D arcade game built with C and SDL3.',
    url: 'https://github.com/rahmaattayat/Proyek2-C3',
    language: 'C',
    stars: 0,
    tags: [],
    isVisible: true,
    isPinned: true
  }
];

export const FALLBACK_SKILLS = [
  { name: "Laravel", icon: "laravel", url: "https://laravel.com" },
  { name: "NestJS", icon: "nestjs", url: "https://nestjs.com" },
  { name: "Next.js", icon: "nextdotjs", url: "https://nextjs.org" },
  { name: "React", icon: "react", url: "https://react.dev" },
  { name: "Vue.js", icon: "vuedotjs", url: "https://vuejs.org" },
  { name: "HTML5", icon: "html5", url: "https://developer.mozilla.org/en-US/docs/Web/HTML" },
  { name: "CSS3", icon: "css", url: "https://developer.mozilla.org/en-US/docs/Web/CSS" },
  { name: "Flutter", icon: "flutter", url: "https://flutter.dev" },
  { name: "TypeScript", icon: "typescript", url: "https://www.typescriptlang.org" },
  { name: "JavaScript", icon: "javascript", url: "https://www.javascript.com" },
  { name: "PHP", icon: "php", url: "https://www.php.net" },
  { name: "Java", icon: "openjdk", url: "https://www.java.com" },
  { name: "Dart", icon: "dart", url: "https://dart.dev" },
  { name: "Python", icon: "python", url: "https://www.python.org" },
  { name: "PostgreSQL", icon: "postgresql", url: "https://www.postgresql.org" },
  { name: "MongoDB", icon: "mongodb", url: "https://www.mongodb.com" },
  { name: "Redis", icon: "redis", url: "https://redis.io" },
  { name: "Supabase", icon: "supabase", url: "https://supabase.com" },
  { name: "Git", icon: "git", url: "https://git-scm.com" },
  { name: "Postman", icon: "postman", url: "https://www.postman.com" },
  { name: "Tailwind CSS", icon: "tailwindcss", url: "https://tailwindcss.com" },
  { name: "Bootstrap", icon: "bootstrap", url: "https://getbootstrap.com" },
  { name: "Docker", icon: "docker", url: "https://www.docker.com" },
];
