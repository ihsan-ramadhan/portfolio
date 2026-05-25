import {
  Controller,
  Post,
  Get,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SyncService } from './sync.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

@ApiTags('Sync')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('admin/sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Post('trigger')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: 'Trigger GitHub repository sync manually' })
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
  @ApiOperation({ summary: 'Get last sync status' })
  async getSyncStatus() {
    const status = await this.syncService.getLatestSyncStatus();

    return {
      data: status,
      message: 'Latest sync status retrieved',
      statusCode: HttpStatus.OK,
    };
  }

  @Get('history')
  @ApiOperation({ summary: 'Get sync history (last 10)' })
  async getSyncHistory() {
    const history = await this.syncService.getSyncHistory(10);

    return {
      data: history,
      message: 'Sync history retrieved',
      statusCode: HttpStatus.OK,
    };
  }
}
