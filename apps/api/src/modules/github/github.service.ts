import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Octokit } from '@octokit/rest';

export interface GitHubRepository {
  id: number;
  name: string;
  description: string | null;
  url: string;
  language: string | null;
  stargazers_count: number;
  pinned: boolean;
}

export interface GitHubRawEvent {
  id: string;
  type: string | null;
  repo: {
    id: number;
    name: string;
    url: string;
  };
  payload?: {
    action?: string;
    ref_type?: string;
    ref?: string;
  };
  created_at: string | null;
}

export interface GitHubActivitySummary {
  stats: {
    publicRepos: number;
    totalStars: number;
    totalContributions: number;
  };
  events: GitHubRawEvent[];
  syncTime: string;
}

@Injectable()
export class GitHubService {
  private readonly logger = new Logger(GitHubService.name);
  private octokit: Octokit | null = null;
  private readonly username: string;

  constructor(private configService: ConfigService) {
    const githubToken = this.configService.get<string>('GITHUB_TOKEN');
    const githubUsername = this.configService.get<string>('GITHUB_USERNAME');

    if (!githubToken || !githubUsername) {
      this.logger.warn(
        'GitHub token or username not configured — sync will be disabled',
      );
      this.octokit = null;
      this.username = '';
      return;
    }

    this.octokit = new Octokit({
      auth: githubToken,
    });

    this.username = githubUsername;
  }

  async fetchPublicRepositories(): Promise<GitHubRepository[]> {
    if (!this.octokit) {
      this.logger.warn('GitHub not configured, returning empty array');
      return [];
    }

    try {
      this.logger.log(
        `Fetching pinned repositories for user: ${this.username} via GraphQL`,
      );

      const query = `
        query($username: String!) {
          user(login: $username) {
            pinnedItems(first: 6, types: REPOSITORY) {
              nodes {
                ... on Repository {
                  databaseId
                  name
                  description
                  url
                  stargazerCount
                  primaryLanguage {
                    name
                  }
                }
              }
            }
          }
        }
      `;

      interface PinnedReposResponse {
        user: {
          pinnedItems: {
            nodes: Array<{
              databaseId: number;
              name: string;
              description: string | null;
              url: string;
              stargazerCount: number;
              primaryLanguage: {
                name: string;
              } | null;
            }>;
          };
        };
      }

      const response = await this.octokit.graphql<PinnedReposResponse>(query, {
        username: this.username,
      });

      const pinnedRepos = response.user.pinnedItems.nodes;

      this.logger.log(`Found ${pinnedRepos.length} pinned repositories`);

      return pinnedRepos.map(
        (repo: PinnedReposResponse['user']['pinnedItems']['nodes'][0]) => ({
          id: repo.databaseId,
          name: repo.name,
          description: repo.description ?? null,
          url: repo.url,
          language: repo.primaryLanguage?.name ?? null,
          stargazers_count: repo.stargazerCount ?? 0,
          pinned: true,
        }),
      );
    } catch (error) {
      this.logger.error(
        'Error fetching pinned repositories from GitHub',
        error,
      );
      return this.fetchOwnedRepositories();
    }
  }

  private async fetchOwnedRepositories(): Promise<GitHubRepository[]> {
    if (!this.octokit) {
      this.logger.warn('GitHub not configured, returning empty array');
      return [];
    }

    const { data: repositories } = await this.octokit.repos.listForUser({
      username: this.username,
      type: 'owner',
      per_page: 10,
      sort: 'updated',
    });

    return (repositories as any[]).map(
      (repo: {
        id: number;
        name: string;
        description: string | null;
        html_url: string;
        language: string | null;
        stargazers_count: number;
      }) => ({
        id: repo.id,
        name: repo.name,
        description: repo.description ?? null,
        url: repo.html_url,
        language: repo.language ?? null,
        stargazers_count: repo.stargazers_count ?? 0,
        pinned: false,
      }),
    );
  }

  async getRepositoryDetails(owner: string, repo: string) {
    if (!this.octokit) {
      this.logger.warn('GitHub not configured, cannot fetch repo details');
      throw new Error('GitHub credentials not configured');
    }

    try {
      const { data: repository } = await this.octokit.repos.get({
        owner,
        repo,
      });

      const { data: languages } = await this.octokit.repos.listLanguages({
        owner,
        repo,
      });

      return {
        ...repository,
        languages: Object.keys(languages),
      };
    } catch (error) {
      this.logger.error(
        `Error fetching details for repo ${owner}/${repo}`,
        error,
      );
      throw error;
    }
  }

  private activityCache: GitHubActivitySummary | null = null;
  private activityCacheExpiry: number = 0;

  async getGitHubActivitySummary(): Promise<GitHubActivitySummary> {
    if (!this.octokit) {
      throw new Error('GitHub credentials not configured');
    }

    const now = Date.now();
    if (this.activityCache && now < this.activityCacheExpiry) {
      this.logger.log('Returning cached GitHub activity summary');
      return this.activityCache;
    }

    this.logger.log(
      'Fetching fresh GitHub activity summary and updating cache',
    );

    try {
      const [profileStats, events] = await Promise.all([
        this.getGitHubProfileStats(),
        this.getUserEvents(10),
      ]);

      const allowedTypes = ['PushEvent', 'PullRequestEvent', 'CreateEvent'];
      const filteredEvents = events
        .filter((event: GitHubRawEvent) =>
          allowedTypes.includes(event.type || ''),
        )
        .slice(0, 5)
        .map((event: GitHubRawEvent) => ({
          id: event.id,
          type: event.type || '',
          repo: {
            id: event.repo.id,
            name: event.repo.name,
            url: event.repo.url,
          },
          payload: {
            action: event.payload?.action,
            ref_type: event.payload?.ref_type,
            ref: event.payload?.ref,
          },
          created_at: event.created_at || '',
        }));

      const summary = {
        stats: {
          publicRepos: profileStats.publicRepos,
          totalStars: profileStats.totalStars,
          totalContributions: profileStats.totalContributions,
        },
        events: filteredEvents,
        syncTime: new Date().toISOString(),
      };

      this.activityCache = summary;
      this.activityCacheExpiry = now + 5 * 60 * 1000;

      return summary;
    } catch (error) {
      this.logger.error('Failed to generate GitHub activity summary:', error);
      throw error;
    }
  }

  private async getGitHubProfileStats(): Promise<{
    publicRepos: number;
    totalStars: number;
    totalContributions: number;
  }> {
    if (!this.octokit) {
      return { publicRepos: 0, totalStars: 0, totalContributions: 0 };
    }
    try {
      this.logger.log(`Fetching general GitHub stats for ${this.username}`);
      const query = `
        query($username: String!) {
          user(login: $username) {
            publicRepositories: repositories(privacy: PUBLIC, ownerAffiliations: OWNER) {
              totalCount
            }
            contributionsCollection {
              contributionCalendar {
                totalContributions
              }
            }
            repositories(first: 100, ownerAffiliations: OWNER, privacy: PUBLIC) {
              nodes {
                stargazerCount
              }
            }
          }
        }
      `;
      interface GraphQLStatsResponse {
        user: {
          publicRepositories: {
            totalCount: number;
          };
          contributionsCollection: {
            contributionCalendar: {
              totalContributions: number;
            };
          };
          repositories: {
            nodes: Array<{
              stargazerCount: number;
            }>;
          };
        };
      }
      const response = await this.octokit.graphql<GraphQLStatsResponse>(query, {
        username: this.username,
      });
      const user = response.user;
      const publicRepos = user.publicRepositories.totalCount;
      const totalContributions =
        user.contributionsCollection.contributionCalendar.totalContributions;
      const totalStars = user.repositories.nodes.reduce(
        (sum: number, repo: { stargazerCount: number }) =>
          sum + (repo.stargazerCount || 0),
        0,
      );
      return { publicRepos, totalContributions, totalStars };
    } catch (error) {
      this.logger.error(
        'Error fetching general GitHub stats via GraphQL:',
        error,
      );
      return { publicRepos: 0, totalStars: 0, totalContributions: 0 };
    }
  }

  private async getUserEvents(perPage: number): Promise<GitHubRawEvent[]> {
    if (!this.octokit) return [];
    try {
      const { data } = await this.octokit.activity.listPublicEventsForUser({
        username: this.username,
        per_page: perPage,
      });
      return data;
    } catch (error) {
      this.logger.error('Error fetching user events:', error);
      return [];
    }
  }
}
