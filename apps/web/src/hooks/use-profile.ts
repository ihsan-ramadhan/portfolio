import { useQuery } from '@tanstack/react-query';
import { profileApi } from '../services/api.service';
import { DEFAULT_PROFILE } from '../constants';
import type { Profile } from '../types';

export function useProfile() {
  return useQuery<Profile, Error>({
    queryKey: ['profile'],
    queryFn: profileApi.getProfile,
    staleTime: 5 * 60 * 1000,
    placeholderData: DEFAULT_PROFILE,
    retry: 2,
  });
}
