import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async findOne() {
    let profile = await this.prisma.profile.findUnique({
      where: { id: 'default-profile' },
      include: {
        experiences: { orderBy: { order: 'asc' } },
        educations: { orderBy: { order: 'asc' } },
        projects: { orderBy: { lastSyncedAt: 'desc' } },
      },
    });

    if (!profile) {
      profile = await this.prisma.profile.create({
        data: {
          id: 'default-profile',
          headline: 'Full Stack Developer',
          bio: 'I love coding and building things.',
        },
        include: {
          experiences: true,
          educations: true,
          projects: true,
        },
      });
    }

    return profile;
  }

  async update(updateProfileDto: UpdateProfileDto) {
    return this.prisma.profile.upsert({
      where: { id: 'default-profile' },
      update: updateProfileDto,
      create: {
        id: 'default-profile',
        headline: updateProfileDto.headline || 'Developer',
        bio: updateProfileDto.bio || '',
        location: updateProfileDto.location || '',
        photoUrl: updateProfileDto.photoUrl || '',
      },
    });
  }
}
