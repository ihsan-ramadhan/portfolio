import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { GitHubService, GitHubActivitySummary } from './github.service';

@ApiTags('GitHub')
@Controller('github')
export class GitHubController {
  constructor(private readonly githubService: GitHubService) {}

  @Get('activity')
  @SkipThrottle()
  @ApiOperation({ summary: 'Get recent GitHub activity and stats' })
  async getGitHubActivity(): Promise<GitHubActivitySummary> {
    return this.githubService.getGitHubActivitySummary();
  }
}
