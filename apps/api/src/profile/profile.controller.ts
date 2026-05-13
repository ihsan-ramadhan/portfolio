import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  async getProfile() {
    return this.profileService.findOne();
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  async updateProfile(@Body() updateProfileDto: UpdateProfileDto) {
    return this.profileService.update(updateProfileDto);
  }
}
