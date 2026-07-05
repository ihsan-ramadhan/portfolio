import { describe, expect, it, vi, beforeEach } from 'vitest';
import { waitFor } from '@testing-library/react';
import type { Project } from '../types';
import { projectsApi } from '../services/api.service';
import { renderHookWithQuery, makeQueryClient } from '../test/hook-test-utils';
import { useProjects } from './use-projects';

const mockProject: Project = {
  id: 'p1',
  name: 'demo',
  url: 'https://github.com/me/demo',
  stars: 3,
  tags: ['ts'],
  isPinned: true,
  isVisible: true,
};

describe('useProjects', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('resolves with the project list', async () => {
    vi.spyOn(projectsApi, 'getProjects').mockResolvedValue([mockProject]);
    const { result } = renderHookWithQuery(() => useProjects());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([mockProject]);
  });

  it('surfaces errors from the api', async () => {
    vi.spyOn(projectsApi, 'getProjects').mockRejectedValue(new Error('boom'));
    const { result } = renderHookWithQuery(() => useProjects());

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toBe('boom');
  });

  it('does not refetch within staleTime across mounts', async () => {
    const spy = vi.spyOn(projectsApi, 'getProjects').mockResolvedValue([mockProject]);
    const client = makeQueryClient();
    const { unmount } = renderHookWithQuery(() => useProjects(), { queryClient: client });

    await waitFor(() => expect(spy).toHaveBeenCalledTimes(1));

    unmount();
    renderHookWithQuery(() => useProjects(), { queryClient: client });
    // synchronous mount after unmount; no refetch because cache is fresh
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
