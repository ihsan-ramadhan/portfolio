import { useQuery } from '@tanstack/react-query';
import { projectsApi } from '../services/api.service';
import { FALLBACK_PROJECTS } from '../constants';
import type { Project } from '../types';

export function useProjects() {
  return useQuery<Project[], Error>({
    queryKey: ['projects'],
    queryFn: projectsApi.getProjects,
    staleTime: 5 * 60 * 1000,
    placeholderData: FALLBACK_PROJECTS,
    retry: 2,
  });
}
