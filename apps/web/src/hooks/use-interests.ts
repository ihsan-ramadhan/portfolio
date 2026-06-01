import { useQuery } from '@tanstack/react-query';
import { interestsApi } from '../services/api.service';

export function useInterests() {
  return useQuery({
    queryKey: ['interests'],
    queryFn: interestsApi.getInterests,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}
