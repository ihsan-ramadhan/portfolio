import { useQuery } from '@tanstack/react-query';
import { educationApi } from '../services/api.service';
import type { Education } from '../types';

export function useEducations() {
  return useQuery<Education[], Error>({
    queryKey: ['educations'],
    queryFn: educationApi.getEducations,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}
