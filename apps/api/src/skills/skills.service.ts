import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSkillDto } from './dto/create-skill.dto';

@Injectable()
export class SkillsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.skill.findMany({
      orderBy: { category: 'asc' },
    });
  }

  async create(createSkillDto: CreateSkillDto) {
    return this.prisma.skill.create({
      data: createSkillDto,
    });
  }

  async update(id: string, updateSkillDto: Partial<CreateSkillDto>) {
    try {
      return await this.prisma.skill.update({
        where: { id },
        data: updateSkillDto,
      });
    } catch {
      throw new NotFoundException('Skill tidak ditemukan');
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.skill.delete({
        where: { id },
      });
    } catch {
      throw new NotFoundException('Skill tidak ditemukan');
    }
  }
}
