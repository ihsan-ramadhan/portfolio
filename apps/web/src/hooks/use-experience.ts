import { useQuery } from '@tanstack/react-query';
import { experienceApi } from '../services/api.service';
import type { Experience } from '../types';

export function useExperiences() {
  return useQuery<Experience[], Error>({
    queryKey: ['experiences'],
    queryFn: experienceApi.getExperiences,
    staleTime: 5 * 60 * 1000,
  });
}
