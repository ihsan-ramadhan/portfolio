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

@Injectable()
export class GitHubService {
  private readonly logger = new Logger(GitHubService.name);
  private octokit: Octokit;
  private readonly username: string;

  constructor(private configService: ConfigService) {
    const githubToken = this.configService.get<string>('GITHUB_TOKEN');
    const githubUsername = this.configService.get<string>('GITHUB_USERNAME');

    if (!githubToken || !githubUsername) {
      this.logger.error('GitHub token or username not configured');
      throw new Error('GitHub credentials not configured');
    }

    this.octokit = new Octokit({
      auth: githubToken,
    });

    this.username = githubUsername;
  }

  async fetchPublicRepositories(): Promise<GitHubRepository[]> {
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

      return pinnedRepos.map((repo) => ({
        id: repo.databaseId,
        name: repo.name,
        description: repo.description ?? null,
        url: repo.url,
        language: repo.primaryLanguage?.name ?? null,
        stargazers_count: repo.stargazerCount ?? 0,
        pinned: true,
      }));
    } catch (error) {
      this.logger.error(
        'Error fetching pinned repositories from GitHub',
        error,
      );
      return this.fetchOwnedRepositories();
    }
  }

  private async fetchOwnedRepositories(): Promise<GitHubRepository[]> {
    const { data: repositories } = await this.octokit.repos.listForUser({
      username: this.username,
      type: 'owner',
      per_page: 10,
      sort: 'updated',
    });

    return repositories.map((repo) => ({
      id: repo.id,
      name: repo.name,
      description: repo.description ?? null,
      url: repo.html_url,
      language: repo.language ?? null,
      stargazers_count: repo.stargazers_count ?? 0,
      pinned: false,
    }));
  }

  async getRepositoryDetails(owner: string, repo: string) {
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
}
