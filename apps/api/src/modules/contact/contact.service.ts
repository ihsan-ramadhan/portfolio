import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createContactDto: CreateContactDto) {
    return this.prisma.contactMessage.create({
      data: {
        name: createContactDto.name,
        email: createContactDto.email,
        message: createContactDto.message,
      },
    });
  }

  async findAll() {
    return this.prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async markAsRead(id: string) {
    return this.prisma.contactMessage.update({
      where: { id },
      data: { isRead: true },
    });
  }

  async remove(id: string) {
    try {
      return await this.prisma.contactMessage.delete({
        where: { id },
      });
    } catch {
      throw new NotFoundException('Message not found');
    }
  }
}
