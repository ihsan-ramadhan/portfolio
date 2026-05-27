import { useQuery } from '@tanstack/react-query';
import { experienceApi } from '../services/api.service';

export function useExperiences() {
  return useQuery({
    queryKey: ['experiences'],
    queryFn: experienceApi.getExperiences,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}
