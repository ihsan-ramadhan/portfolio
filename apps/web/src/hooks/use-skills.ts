import { useQuery } from '@tanstack/react-query';
import { skillsApi } from '../services/api.service';
import type { Skill } from '../types';

export function useSkills() {
  return useQuery<Skill[], Error>({
    queryKey: ['skills'],
    queryFn: skillsApi.getSkills,
    staleTime: 5 * 60 * 1000,
  });
}
