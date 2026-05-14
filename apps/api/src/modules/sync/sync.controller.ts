import {
  Controller,
  Post,
  Get,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { SyncService } from './sync.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@Controller('admin/sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Post('trigger')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.ACCEPTED)
  triggerSync() {
    this.syncService.syncGitHubRepositories().catch((error) => {
      console.error('Async sync error:', error);
    });

    return {
      data: null,
      message: 'Sync triggered successfully',
      statusCode: HttpStatus.ACCEPTED,
    };
  }

  @Get('status')
  @UseGuards(JwtAuthGuard)
  async getSyncStatus() {
    const status = await this.syncService.getLatestSyncStatus();

    return {
      data: status,
      message: 'Latest sync status retrieved',
      statusCode: HttpStatus.OK,
    };
  }

  @Get('history')
  @UseGuards(JwtAuthGuard)
  async getSyncHistory() {
    const history = await this.syncService.getSyncHistory(10);

    return {
      data: history,
      message: 'Sync history retrieved',
      statusCode: HttpStatus.OK,
    };
  }
}
