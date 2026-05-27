import { useMutation, useQueryClient } from '@tanstack/react-query';
import { skillsApi } from '../services/api.service';
import type { Skill } from '../types';

export function useCreateSkill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ data, token }: { data: Omit<Skill, 'id'>; token: string }) =>
      skillsApi.createSkill({ data, token }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
    },
  });
}

export function useUpdateSkill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data, token }: { id: string; data: Partial<Skill>; token: string }) =>
      skillsApi.updateSkill({ id, data, token }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
    },
  });
}

export function useDeleteSkill() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, token }: { id: string; token: string }) =>
      skillsApi.deleteSkill({ id, token }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skills'] });
    },
  });
}
