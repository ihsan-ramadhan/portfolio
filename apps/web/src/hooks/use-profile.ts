import { useQuery } from '@tanstack/react-query';
import { profileApi } from '../services/api.service';
import type { Profile } from '../types';

export function useProfile() {
  return useQuery<Profile, Error>({
    queryKey: ['profile'],
    queryFn: profileApi.getProfile,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}
