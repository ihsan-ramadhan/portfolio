import axios from 'axios';
import type { Profile, Project, Skill, ContactMessage, SiteSection, Experience, Education, ApiResponse, Interest } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10_000,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const profileApi = {
  getProfile: async (): Promise<Profile> => {
    const response = await apiClient.get<ApiResponse<Profile>>('/profile');
    return response.data.data;
  },
};

export const projectsApi = {
  getProjects: async (): Promise<Project[]> => {
    const response = await apiClient.get<ApiResponse<Project[]>>('/projects');
    return response.data.data;
  },
  getAdminProjects: async (token: string): Promise<Project[]> => {
    const response = await apiClient.get<ApiResponse<Project[]>>('/admin/projects', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },
  updateProject: async ({ id, data, token }: { id: string; data: Partial<Project>; token: string }): Promise<Project> => {
    const response = await apiClient.patch<ApiResponse<Project>>(`/admin/projects/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },
  uploadProjectImage: async ({ file, oldImageUrl, token }: { file: File; oldImageUrl?: string; token: string }): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    if (oldImageUrl) formData.append('oldImageUrl', oldImageUrl);
    const response = await apiClient.post<ApiResponse<{ imageUrl: string }>>('/admin/projects/upload-image', formData, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data.imageUrl;
  },
  deleteProjectImage: async ({ imageUrl, token }: { imageUrl: string; token: string }): Promise<void> => {
    await apiClient.delete('/admin/projects/image', {
      headers: { Authorization: `Bearer ${token}` },
      data: { imageUrl },
    });
  },
};

export const skillsApi = {
  getSkills: async (): Promise<Skill[]> => {
    const response = await apiClient.get<ApiResponse<Skill[]>>('/skills');
    return response.data.data;
  },
  createSkill: async ({ data, token }: { data: Omit<Skill, 'id'>; token: string }): Promise<Skill> => {
    const response = await apiClient.post<ApiResponse<Skill>>('/admin/skills', data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },
  updateSkill: async ({ id, data, token }: { id: string; data: Partial<Skill>; token: string }): Promise<Skill> => {
    const response = await apiClient.patch<ApiResponse<Skill>>(`/admin/skills/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },
  deleteSkill: async ({ id, token }: { id: string; token: string }): Promise<void> => {
    await apiClient.delete(`/admin/skills/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};

export const interestsApi = {
  getInterests: async (): Promise<Interest[]> => {
    const response = await apiClient.get<ApiResponse<Interest[]>>('/interests');
    return response.data.data;
  },
  createInterest: async ({ data, token }: { data: Omit<Interest, 'id'>; token: string }): Promise<Interest> => {
    const response = await apiClient.post<ApiResponse<Interest>>('/admin/interests', data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },
  updateInterest: async ({ id, data, token }: { id: string; data: Partial<Interest>; token: string }): Promise<Interest> => {
    const response = await apiClient.patch<ApiResponse<Interest>>(`/admin/interests/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },
  deleteInterest: async ({ id, token }: { id: string; token: string }): Promise<void> => {
    await apiClient.delete(`/admin/interests/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};

export const messagesApi = {
  getMessages: async (token: string): Promise<ContactMessage[]> => {
    const response = await apiClient.get<ApiResponse<ContactMessage[]>>('/admin/messages', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },
  markAsRead: async ({ id, token }: { id: string; token: string }): Promise<ContactMessage> => {
    const response = await apiClient.patch<ApiResponse<ContactMessage>>(`/admin/messages/${id}/read`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },
  deleteMessage: async ({ id, token }: { id: string; token: string }): Promise<void> => {
    await apiClient.delete(`/admin/messages/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};

export const sectionsApi = {
  getSections: async (): Promise<SiteSection[]> => {
    const response = await apiClient.get<ApiResponse<SiteSection[]>>('/sections');
    return response.data.data;
  },
  updateSection: async ({ id, data, token }: { id: string; data: Partial<SiteSection>; token: string }): Promise<SiteSection> => {
    const response = await apiClient.patch<ApiResponse<SiteSection>>(`/admin/sections/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },
  reorderSections: async ({ sections, token }: { sections: { name: string; order: number }[]; token: string }): Promise<SiteSection[]> => {
    const response = await apiClient.put<ApiResponse<SiteSection[]>>('/admin/sections/reorder', { sections }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },
};

export const experienceApi = {
  getExperiences: async (): Promise<Experience[]> => {
    const response = await apiClient.get<ApiResponse<Experience[]>>('/experience');
    return response.data.data;
  },
  createExperience: async ({ data, token }: { data: Omit<Experience, 'id'>; token: string }): Promise<Experience> => {
    const response = await apiClient.post<ApiResponse<Experience>>('/admin/experience', data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },
  updateExperience: async ({ id, data, token }: { id: string; data: Partial<Experience>; token: string }): Promise<Experience> => {
    const response = await apiClient.patch<ApiResponse<Experience>>(`/admin/experience/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },
  deleteExperience: async ({ id, token }: { id: string; token: string }): Promise<void> => {
    await apiClient.delete(`/admin/experience/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};

export const educationApi = {
  getEducations: async (): Promise<Education[]> => {
    const response = await apiClient.get<ApiResponse<Education[]>>('/education');
    return response.data.data;
  },
  createEducation: async ({ data, token }: { data: Omit<Education, 'id'>; token: string }): Promise<Education> => {
    const response = await apiClient.post<ApiResponse<Education>>('/admin/education', data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },
  updateEducation: async ({ id, data, token }: { id: string; data: Partial<Education>; token: string }): Promise<Education> => {
    const response = await apiClient.patch<ApiResponse<Education>>(`/admin/education/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },
  deleteEducation: async ({ id, token }: { id: string; token: string }): Promise<void> => {
    await apiClient.delete(`/admin/education/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};

