import { describe, expect, it, vi, beforeEach } from 'vitest';
import { waitFor } from '@testing-library/react';
import { apiClient } from '../services/api.service';
import { renderHookWithQuery } from '../test/hook-test-utils';
import { useGitHubActivity } from './use-github-activity';

const mockActivity = {
  stats: { publicRepos: 4, totalStars: 12, totalContributions: 100 },
  contributions: {
    period: 'last-90-days',
    commits: { total: 50, repoCount: 3, topRepos: [{ name: 'x', count: 30 }] },
    pullRequests: { opened: 5, merged: 4 },
    reviews: 2,
    reposCreated: 1,
  },
  syncTime: '2025-01-01T00:00:00Z',
};

describe('useGitHubActivity', () => {
  beforeEach(() => vi.clearAllMocks());

  it('resolves with the activity payload from /github/activity', async () => {
    vi.spyOn(apiClient, 'get').mockResolvedValue({ data: { data: mockActivity, message: 'ok', statusCode: 200 } });
    const { result } = renderHookWithQuery(() => useGitHubActivity());

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockActivity);
  });

  it('exposes the error if the request fails', async () => {
    vi.spyOn(apiClient, 'get').mockRejectedValue(new Error('github down'));
    const { result } = renderHookWithQuery(() => useGitHubActivity());

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error?.message).toBe('github down');
  });
});
