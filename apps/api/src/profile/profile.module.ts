import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { StorageModule } from '../modules/storage/storage.module';

@Module({
  imports: [StorageModule],
  providers: [ProfileService],
  controllers: [ProfileController],
})
export class ProfileModule {}
