import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  async findOne() {
    const profile = await this.prisma.profile.findUnique({
      where: { id: 'default-profile' },
      include: {
        experiences: { orderBy: { order: 'asc' } },
        educations: { orderBy: { order: 'asc' } },
      },
    });

    if (!profile) {
      throw new NotFoundException('Profil tidak ditemukan');
    }

    return profile;
  }

  async update(updateProfileDto: UpdateProfileDto) {
    return this.prisma.profile.update({
      where: { id: 'default-profile' },
      data: updateProfileDto,
    });
  }
}
