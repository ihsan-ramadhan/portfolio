import { useMutation, useQueryClient } from '@tanstack/react-query';
import { interestsApi } from '../services/api.service';
import type { Interest } from '../types';

export function useCreateInterest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data, token }: { data: Omit<Interest, 'id'>; token: string }) =>
      interestsApi.createInterest({ data, token }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interests'] });
    },
  });
}

export function useUpdateInterest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data, token }: { id: string; data: Partial<Interest>; token: string }) =>
      interestsApi.updateInterest({ id, data, token }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interests'] });
    },
  });
}

export function useDeleteInterest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, token }: { id: string; token: string }) =>
      interestsApi.deleteInterest({ id, token }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interests'] });
    },
  });
}
