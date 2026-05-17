import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.project.findMany({
      where: { isVisible: true },
      orderBy: { stars: 'desc' },
    });
  }

  async findAllForAdmin() {
    return this.prisma.project.findMany({
      orderBy: { stars: 'desc' },
    });
  }

  async findPinned() {
    return this.prisma.project.findMany({
      where: { isPinned: true, isVisible: true },
      orderBy: { stars: 'desc' },
    });
  }

  async create(createProjectDto: CreateProjectDto) {
    return this.prisma.project.create({
      data: {
        ...createProjectDto,
        profileId: 'default-profile',
      },
    });
  }

  async update(id: string, updateProjectDto: UpdateProjectDto) {
    try {
      return await this.prisma.project.update({
        where: { id },
        data: updateProjectDto,
      });
    } catch (error) {
      console.error(`Prisma update error for project ${id}:`, error);
      throw new NotFoundException('Proyek tidak ditemukan');
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.project.delete({
        where: { id },
      });
    } catch {
      throw new NotFoundException('Proyek tidak ditemukan');
    }
  }
}
