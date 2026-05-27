import { useQuery } from '@tanstack/react-query';
import { educationApi } from '../services/api.service';

export function useEducations() {
  return useQuery({
    queryKey: ['educations'],
    queryFn: educationApi.getEducations,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}
