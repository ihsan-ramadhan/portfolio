import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sectionsApi } from '../services/api.service';
import type { SiteSection } from '../types';

export function useSections() {
  return useQuery<SiteSection[], Error>({
    queryKey: ['sections'],
    queryFn: sectionsApi.getSections,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateSection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data, token }: { id: string; data: Partial<SiteSection>; token: string }) =>
      sectionsApi.updateSection({ id, data, token }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections'] });
    },
  });
}

export function useReorderSections() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ sections, token }: { sections: { name: string; order: number }[]; token: string }) =>
      sectionsApi.reorderSections({ sections, token }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sections'] });
    },
  });
}
