import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';
import { GitHubService } from '../github/github.service';
import { SyncStatus, SyncSource } from '@prisma/client';

@Injectable()
export class SyncService {
  private readonly logger = new Logger(SyncService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly githubService: GitHubService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCronSync() {
    this.logger.log('Executing automated GitHub sync...');
    await this.syncGitHubRepositories();
  }

  async syncGitHubRepositories(): Promise<void> {
    try {
      this.logger.log('Starting GitHub repository sync...');

      const repositories = await this.githubService.fetchPublicRepositories();
      this.logger.log(
        `Fetched ${repositories.length} repositories from GitHub`,
      );

      let successCount = 0;
      let errorCount = 0;

      for (const repo of repositories) {
        try {
          await this.prisma.project.upsert({
            where: { githubId: repo.id },
            update: {
              name: repo.name,
              description: repo.description,
              url: repo.url,
              language: repo.language,
              stars: repo.stargazers_count,
              lastSyncedAt: new Date(),
            },
            create: {
              githubId: repo.id,
              name: repo.name,
              description: repo.description,
              url: repo.url,
              language: repo.language,
              stars: repo.stargazers_count,
              lastSyncedAt: new Date(),
              isVisible: true,
            },
          });

          successCount++;
        } catch (error) {
          this.logger.error(`Error upserting repository ${repo.name}:`, error);
          errorCount++;
        }
      }

      const message = `Synced ${successCount} repositories successfully, ${errorCount} failed`;
      this.logger.log(message);

      await this.logSync(
        SyncSource.GITHUB,
        SyncStatus.SUCCESS,
        `Synced ${successCount} repos, ${errorCount} errors`,
      );
    } catch (error) {
      this.logger.error('Fatal error during GitHub sync:', error);

      await this.logSync(
        SyncSource.GITHUB,
        SyncStatus.FAILED,
        `Sync failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );

      throw error;
    }
  }

  async getLatestSyncStatus() {
    const latestSync = await this.prisma.syncLog.findFirst({
      where: { source: SyncSource.GITHUB },
      orderBy: { syncedAt: 'desc' },
    });

    return latestSync || null;
  }

  async getSyncHistory(limit: number = 10) {
    return this.prisma.syncLog.findMany({
      where: { source: SyncSource.GITHUB },
      orderBy: { syncedAt: 'desc' },
      take: limit,
    });
  }

  private async logSync(
    source: SyncSource,
    status: SyncStatus,
    message?: string,
  ) {
    try {
      await this.prisma.syncLog.create({
        data: {
          source,
          status,
          message,
        },
      });
    } catch (error) {
      this.logger.error('Error logging sync:', error);
    }
  }
}
