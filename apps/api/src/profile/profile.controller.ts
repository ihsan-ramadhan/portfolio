import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Delete,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiConsumes,
} from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { FileInterceptor } from '@nest-lab/fastify-multer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileService } from './profile.service';
import { StorageService } from '../modules/storage/storage.service';

@ApiTags('Profile')
@Controller('profile')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly storageService: StorageService,
  ) {}

  @Get()
  @SkipThrottle()
  @ApiOperation({ summary: 'Get profile data' })
  async getProfile() {
    return this.profileService.findOne();
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update profile bio, headline, location' })
  async updateProfile(@Body() updateProfileDto: UpdateProfileDto) {
    return this.profileService.update(updateProfileDto);
  }

  @Post('photo')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload profile photo' })
  @ApiConsumes('multipart/form-data')
  async uploadPhoto(@UploadedFile() file: Express.Multer.File) {
    const profile = await this.profileService.findOne();
    if (profile?.photoUrl) {
      await this.storageService.deleteFile(profile.photoUrl);
    }

    const fileName = `profile-photo-${Date.now()}`;
    const url = await this.storageService.uploadFile(file, fileName);
    return this.profileService.update({ photoUrl: url });
  }

  @Delete('photo')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete profile photo' })
  async deletePhoto() {
    const profile = await this.profileService.findOne();
    if (profile?.photoUrl) {
      await this.storageService.deleteFile(profile.photoUrl);
    }
    return this.profileService.update({ photoUrl: '' });
  }
}
