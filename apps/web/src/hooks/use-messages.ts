import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { messagesApi } from '../services/api.service';

export function useMessages(token: string) {
  return useQuery({
    queryKey: ['messages', token],
    queryFn: () => messagesApi.getMessages(token),
    enabled: !!token,
    staleTime: 60 * 1000, // 1 menit
  });
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, token }: { id: string; token: string }) => messagesApi.markAsRead({ id, token }),
    onSuccess: (_, { token }) => {
      queryClient.invalidateQueries({ queryKey: ['messages', token] });
    },
  });
}

export function useDeleteMessage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, token }: { id: string; token: string }) => messagesApi.deleteMessage({ id, token }),
    onSuccess: (_, { token }) => {
      queryClient.invalidateQueries({ queryKey: ['messages', token] });
    },
  });
}

