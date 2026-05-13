import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findFeatured() {
    return this.prisma.project.findMany({
      where: { isFeatured: true },
    });
  }

  async create(createProjectDto: CreateProjectDto) {
    return this.prisma.project.create({
      data: {
        ...createProjectDto,
        profileId: 'default-profile', // Hardcoded as per single user logic
      },
    });
  }

  async update(id: string, updateProjectDto: Partial<CreateProjectDto>) {
    try {
      return await this.prisma.project.update({
        where: { id },
        data: updateProjectDto,
      });
    } catch (error) {
      throw new NotFoundException('Proyek tidak ditemukan');
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.project.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException('Proyek tidak ditemukan');
    }
  }
}
