import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../services/api.service';
import type { ApiResponse } from '../types';

export interface ContributionRepoEntry {
  name: string;
  count: number;
}

export interface GitHubContributions {
  period: string;
  commits: {
    total: number;
    repoCount: number;
    topRepos: ContributionRepoEntry[];
  };
  pullRequests: {
    opened: number;
    merged: number;
  };
  reviews: number;
  reposCreated: number;
}

export interface GitHubStats {
  publicRepos: number;
  totalStars: number;
  totalContributions: number;
}

export interface GitHubActivityData {
  stats: GitHubStats;
  contributions: GitHubContributions;
  syncTime: string;
}

export function useGitHubActivity() {
  return useQuery<GitHubActivityData, Error>({
    queryKey: ['github-activity'],
    queryFn: async () => {
      const res = await apiClient.get<ApiResponse<GitHubActivityData>>('/github/activity');
      return res.data.data;
    },
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}
