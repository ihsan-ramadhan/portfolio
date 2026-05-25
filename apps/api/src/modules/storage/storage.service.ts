import {
  Injectable,
  Logger,
  OnModuleInit,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class StorageService implements OnModuleInit {
  private readonly logger = new Logger(StorageService.name);
  private supabase: SupabaseClient<any, any, any>;

  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey = this.configService.get<string>('SUPABASE_SERVICE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      this.logger.error('Supabase credentials are missing!');
      return;
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
    this.logger.log('Supabase Storage Client initialized');
  }

  async uploadFile(
    file: Express.Multer.File,
    path: string,
    bucket = 'portfolio',
  ): Promise<string> {
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .upload(path, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (error) {
      this.logger.error(`Upload failed: ${error.message}`);
      throw new InternalServerErrorException(`Upload failed: ${error.message}`);
    }

    const {
      data: { publicUrl },
    } = this.supabase.storage.from(bucket).getPublicUrl(data.path);

    return publicUrl;
  }

  async deleteFile(url: string, bucket = 'portfolio'): Promise<void> {
    try {
      const urlParts = url.split('/');
      const filename = urlParts[urlParts.length - 1];

      if (!filename) {
        this.logger.warn(`Could not extract filename from URL: ${url}`);
        return;
      }

      const { error } = await this.supabase.storage
        .from(bucket)
        .remove([filename]);

      if (error) {
        this.logger.error(`Delete failed: ${error.message}`);
        throw new InternalServerErrorException(
          `Delete failed: ${error.message}`,
        );
      }

      this.logger.log(`Successfully deleted file: ${filename}`);
    } catch (error) {
      this.logger.error(
        `Error deleting file: ${error instanceof Error ? error.message : 'Unknown'}`,
      );
    }
  }
}
