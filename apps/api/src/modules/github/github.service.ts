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
      this.logger.log(`Fetching repositories for user: ${this.username}`);

      const { data: repositories } = await this.octokit.repos.listForUser({
        username: this.username,
        type: 'owner',
        per_page: 100,
        sort: 'updated',
      });

      this.logger.log(`Found ${repositories.length} public repositories`);

      return repositories.map((repo) => ({
        id: repo.id,
        name: repo.name,
        description: repo.description ?? null,
        url: repo.html_url,
        language: repo.language ?? null,
        stargazers_count: repo.stargazers_count ?? 0,
        pinned: false,
      }));
    } catch (error) {
      this.logger.error('Error fetching repositories from GitHub', error);
      throw error;
    }
  }

  fetchPinnedRepositories(): GitHubRepository[] {
    try {
      this.logger.log(
        `Fetching pinned repositories for user: ${this.username}`,
      );

      return [];
    } catch (error) {
      this.logger.error('Error fetching pinned repositories', error);
      return [];
    }
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
