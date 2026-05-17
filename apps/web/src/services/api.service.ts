import axios from 'axios';
import type { Profile, Project, Skill, ApiResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10_000,
});

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
};

export const skillsApi = {
  getSkills: async (): Promise<Skill[]> => {
    const response = await apiClient.get<ApiResponse<Skill[]>>('/skills');
    return response.data.data;
  },
  createSkill: async ({ data, token }: { data: Omit<Skill, 'id'>; token: string }): Promise<Skill> => {
    const response = await apiClient.post<ApiResponse<Skill>>('/skills', data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },
  updateSkill: async ({ id, data, token }: { id: string; data: Partial<Skill>; token: string }): Promise<Skill> => {
    const response = await apiClient.patch<ApiResponse<Skill>>(`/skills/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.data;
  },
  deleteSkill: async ({ id, token }: { id: string; token: string }): Promise<void> => {
    await apiClient.delete(`/skills/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
