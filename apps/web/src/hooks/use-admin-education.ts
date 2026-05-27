import { useMutation, useQueryClient } from '@tanstack/react-query';
import { educationApi } from '../services/api.service';
import type { Education } from '../types';

export function useCreateEducation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data, token }: { data: Omit<Education, 'id'>; token: string }) =>
      educationApi.createEducation({ data, token }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['educations'] });
    },
  });
}

export function useUpdateEducation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data, token }: { id: string; data: Partial<Education>; token: string }) =>
      educationApi.updateEducation({ id, data, token }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['educations'] });
    },
  });
}

export function useDeleteEducation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, token }: { id: string; token: string }) =>
      educationApi.deleteEducation({ id, token }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['educations'] });
    },
  });
}
