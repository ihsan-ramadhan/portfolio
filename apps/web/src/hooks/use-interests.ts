import { useQuery } from '@tanstack/react-query';
import { interestsApi } from '../services/api.service';
import type { Interest } from '../types';

export function useInterests() {
  return useQuery<Interest[], Error>({
    queryKey: ['interests'],
    queryFn: interestsApi.getInterests,
    staleTime: 5 * 60 * 1000,
  });
}
