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
      orderBy: [{ isPinned: 'desc' }, { pinnedAt: 'desc' }, { stars: 'desc' }],
    });
  }

  async findAllForAdmin() {
    return this.prisma.project.findMany({
      orderBy: [{ isPinned: 'desc' }, { pinnedAt: 'desc' }, { stars: 'desc' }],
    });
  }

  async findPinned() {
    return this.prisma.project.findMany({
      where: { isPinned: true, isVisible: true },
      orderBy: [{ pinnedAt: 'desc' }, { stars: 'desc' }],
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
      const dataToUpdate: any = { ...updateProjectDto };
      if (updateProjectDto.isPinned === true) {
        dataToUpdate.pinnedAt = new Date();
      } else if (updateProjectDto.isPinned === false) {
        dataToUpdate.pinnedAt = null;
      }

      return await this.prisma.project.update({
        where: { id },
        data: dataToUpdate,
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
