import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEducationDto } from './dto/create-education.dto';
import { UpdateEducationDto } from './dto/update-education.dto';

@Injectable()
export class EducationService {
  private readonly DEFAULT_PROFILE_ID = 'default-profile';

  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.education.findMany({
      where: { profileId: this.DEFAULT_PROFILE_ID },
      orderBy: { order: 'asc' },
    });
  }

  async create(createEducationDto: CreateEducationDto) {
    let order = createEducationDto.order;
    if (order === undefined) {
      const maxOrder = await this.prisma.education.aggregate({
        where: { profileId: this.DEFAULT_PROFILE_ID },
        _max: { order: true },
      });
      order = (maxOrder._max.order || 0) + 1;
    }

    return this.prisma.education.create({
      data: {
        ...createEducationDto,
        profileId: this.DEFAULT_PROFILE_ID,
        order,
      },
    });
  }

  async update(id: string, updateEducationDto: UpdateEducationDto) {
    const education = await this.prisma.education.findUnique({
      where: { id },
    });

    if (!education) {
      throw new NotFoundException(`Education with ID ${id} not found`);
    }

    return this.prisma.education.update({
      where: { id },
      data: updateEducationDto,
    });
  }

  async remove(id: string) {
    const education = await this.prisma.education.findUnique({
      where: { id },
    });

    if (!education) {
      throw new NotFoundException(`Education with ID ${id} not found`);
    }

    return this.prisma.education.delete({
      where: { id },
    });
  }
}
