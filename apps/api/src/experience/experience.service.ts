import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';

@Injectable()
export class ExperienceService {
  private readonly DEFAULT_PROFILE_ID = 'default-profile';

  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.experience.findMany({
      where: { profileId: this.DEFAULT_PROFILE_ID },
      orderBy: { order: 'asc' },
    });
  }

  async create(createExperienceDto: CreateExperienceDto) {
    // If order is not provided, find the max order and add 1
    let order = createExperienceDto.order;
    if (order === undefined) {
      const maxOrder = await this.prisma.experience.aggregate({
        where: { profileId: this.DEFAULT_PROFILE_ID },
        _max: { order: true },
      });
      order = (maxOrder._max.order || 0) + 1;
    }

    return this.prisma.experience.create({
      data: {
        ...createExperienceDto,
        profileId: this.DEFAULT_PROFILE_ID,
        order,
      },
    });
  }

  async update(id: string, updateExperienceDto: UpdateExperienceDto) {
    const experience = await this.prisma.experience.findUnique({
      where: { id },
    });

    if (!experience) {
      throw new NotFoundException(`Experience with ID ${id} not found`);
    }

    return this.prisma.experience.update({
      where: { id },
      data: updateExperienceDto,
    });
  }

  async remove(id: string) {
    const experience = await this.prisma.experience.findUnique({
      where: { id },
    });

    if (!experience) {
      throw new NotFoundException(`Experience with ID ${id} not found`);
    }

    return this.prisma.experience.delete({
      where: { id },
    });
  }
}
