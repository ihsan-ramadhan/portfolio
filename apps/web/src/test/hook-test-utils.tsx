import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { renderHook, type RenderHookOptions } from '@testing-library/react';
import { vi } from 'vitest';

export function makeQueryClient() {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  // Disable retries for all known query keys so error tests resolve fast.
  // Hooks set `retry: 2` per-hook, which beats defaultOptions but is
  // itself beaten by per-key defaults.
  for (const key of [
    'profile',
    'projects',
    'skills',
    'educations',
    'experiences',
    'interests',
    'sections',
    'github-activity',
    'messages',
  ]) {
    client.setQueryDefaults([key], { retry: false });
  }
  return client;
}

export function makeWrapper(queryClient = makeQueryClient()) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

export function renderHookWithQuery<Result, Props>(
  callback: (props: Props) => Result,
  options?: Omit<RenderHookOptions<Props>, 'wrapper'> & { queryClient?: QueryClient }
) {
  const wrapper = makeWrapper(options?.queryClient);
  return renderHook(callback, { ...options, wrapper });
}

export function flushPromises() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

export function mockResolveOnce<T>(spy: ReturnType<typeof vi.fn>, value: T) {
  spy.mockResolvedValueOnce(value);
}

export function mockRejectOnce(spy: ReturnType<typeof vi.fn>, error: Error) {
  spy.mockRejectedValueOnce(error);
}
