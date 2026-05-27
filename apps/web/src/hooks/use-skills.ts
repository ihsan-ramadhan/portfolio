import { useQuery } from '@tanstack/react-query';
import { skillsApi } from '../services/api.service';

export function useSkills() {
  return useQuery({
    queryKey: ['skills'],
    queryFn: skillsApi.getSkills,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}
