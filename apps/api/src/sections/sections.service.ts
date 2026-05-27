import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateSectionDto } from './dto/update-section.dto';
import { ReorderSectionsDto } from './dto/reorder-sections.dto';

@Injectable()
export class SectionsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.siteSection.findMany({
      orderBy: { order: 'asc' },
    });
  }

  async update(id: string, updateSectionDto: UpdateSectionDto) {
    const section = await this.prisma.siteSection.findUnique({
      where: { id },
    });

    if (!section) {
      throw new NotFoundException(`Section with ID ${id} not found`);
    }

    return this.prisma.siteSection.update({
      where: { id },
      data: updateSectionDto,
    });
  }

  async reorder(reorderSectionsDto: ReorderSectionsDto) {
    const queries = reorderSectionsDto.sections.map((sec) =>
      this.prisma.siteSection.update({
        where: { name: sec.name },
        data: { order: sec.order },
      }),
    );

    await this.prisma.$transaction(queries);
    return this.findAll();
  }
}
