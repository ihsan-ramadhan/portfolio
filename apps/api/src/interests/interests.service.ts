import { Injectable, NotFoundException } from '@nestjs/common';
import { Interest } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInterestDto } from './dto/create-interest.dto';

@Injectable()
export class InterestsService {
  constructor(private prisma: PrismaService) {}

  findAll(): Promise<Interest[]> {
    return this.prisma.interest.findMany({
      orderBy: { order: 'asc' },
    });
  }

  create(createInterestDto: CreateInterestDto): Promise<Interest> {
    return this.prisma.interest.create({
      data: createInterestDto,
    });
  }

  async update(
    id: string,
    updateInterestDto: Partial<CreateInterestDto>,
  ): Promise<Interest> {
    try {
      return await this.prisma.interest.update({
        where: { id },
        data: updateInterestDto,
      });
    } catch {
      throw new NotFoundException('Interest tidak ditemukan');
    }
  }

  async remove(id: string): Promise<Interest> {
    try {
      return await this.prisma.interest.delete({
        where: { id },
      });
    } catch {
      throw new NotFoundException('Interest tidak ditemukan');
    }
  }
}
