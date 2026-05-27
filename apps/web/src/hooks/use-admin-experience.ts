import { useMutation, useQueryClient } from '@tanstack/react-query';
import { experienceApi } from '../services/api.service';
import type { Experience } from '../types';

export function useCreateExperience() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data, token }: { data: Omit<Experience, 'id'>; token: string }) =>
      experienceApi.createExperience({ data, token }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] });
    },
  });
}

export function useUpdateExperience() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data, token }: { id: string; data: Partial<Experience>; token: string }) =>
      experienceApi.updateExperience({ id, data, token }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] });
    },
  });
}

export function useDeleteExperience() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, token }: { id: string; token: string }) =>
      experienceApi.deleteExperience({ id, token }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['experiences'] });
    },
  });
}
