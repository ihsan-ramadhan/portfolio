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

export interface ContributionRepoEntry {
  name: string;
  count: number;
}

export interface GitHubActivitySummary {
  stats: {
    publicRepos: number;
    totalStars: number;
    totalContributions: number;
  };
  contributions: {
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
  };
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
      const today = new Date();
      const fromDate = new Date(
        Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1),
      );
      const toDate = today;
      const period = fromDate.toLocaleString('en-US', {
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
      });

      const query = `
        query($username: String!, $from: DateTime!, $to: DateTime!) {
          user(login: $username) {
            publicRepositories: repositories(privacy: PUBLIC, ownerAffiliations: OWNER) {
              totalCount
            }
            repositories(first: 100, ownerAffiliations: OWNER, privacy: PUBLIC) {
              nodes { stargazerCount }
            }
            contributionsCollection {
              contributionCalendar { totalContributions }
            }
            monthlyContributions: contributionsCollection(from: $from, to: $to) {
              totalCommitContributions
              totalRepositoriesWithContributedCommits
              totalPullRequestContributions
              totalPullRequestReviewContributions
              totalRepositoryContributions
              commitContributionsByRepository(maxRepositories: 5) {
                repository { nameWithOwner }
                contributions { totalCount }
              }
              pullRequestContributionsByRepository(maxRepositories: 5) {
                repository { nameWithOwner }
                contributions(first: 50) {
                  totalCount
                  nodes {
                    pullRequest { merged }
                  }
                }
              }
            }
          }
        }
      `;

      interface GraphQLContributionResponse {
        user: {
          publicRepositories: { totalCount: number };
          repositories: { nodes: Array<{ stargazerCount: number }> };
          contributionsCollection: {
            contributionCalendar: { totalContributions: number };
          };
          monthlyContributions: {
            totalCommitContributions: number;
            totalRepositoriesWithContributedCommits: number;
            totalPullRequestContributions: number;
            totalPullRequestReviewContributions: number;
            totalRepositoryContributions: number;
            commitContributionsByRepository: Array<{
              repository: { nameWithOwner: string };
              contributions: { totalCount: number };
            }>;
            pullRequestContributionsByRepository: Array<{
              repository: { nameWithOwner: string };
              contributions: {
                totalCount: number;
                nodes: Array<{ pullRequest: { merged: boolean } }>;
              };
            }>;
          };
        };
      }

      const response = await this.octokit.graphql<GraphQLContributionResponse>(
        query,
        {
          username: this.username,
          from: fromDate.toISOString(),
          to: toDate.toISOString(),
        },
      );

      const user = response.user;
      const monthly = user.monthlyContributions;

      const publicRepos = user.publicRepositories.totalCount;
      const totalContributions =
        user.contributionsCollection.contributionCalendar.totalContributions;
      const totalStars = user.repositories.nodes.reduce(
        (sum, repo) => sum + (repo.stargazerCount || 0),
        0,
      );

      const topRepos = monthly.commitContributionsByRepository.map((r) => ({
        name: r.repository.nameWithOwner.replace(`${this.username}/`, ''),
        count: r.contributions.totalCount,
      }));

      let totalMerged = 0;
      for (const prByRepo of monthly.pullRequestContributionsByRepository) {
        for (const node of prByRepo.contributions.nodes) {
          if (node.pullRequest.merged) totalMerged++;
        }
      }

      const summary: GitHubActivitySummary = {
        stats: { publicRepos, totalStars, totalContributions },
        contributions: {
          period,
          commits: {
            total: monthly.totalCommitContributions,
            repoCount: monthly.totalRepositoriesWithContributedCommits,
            topRepos,
          },
          pullRequests: {
            opened: monthly.totalPullRequestContributions,
            merged: totalMerged,
          },
          reviews: monthly.totalPullRequestReviewContributions,
          reposCreated: monthly.totalRepositoryContributions,
        },
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
}
