import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createContactDto: CreateContactDto) {
    const contactMessage = await this.prisma.contactMessage.create({
      data: {
        name: createContactDto.name,
        email: createContactDto.email,
        message: createContactDto.message,
      },
    });

    return {
      data: contactMessage,
      message: 'Message sent successfully',
      statusCode: 201,
    };
  }

  async findAll() {
    const messages = await this.prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return {
      data: messages,
      message: 'Messages retrieved successfully',
      statusCode: 200,
    };
  }

  async markAsRead(id: string) {
    const message = await this.prisma.contactMessage.update({
      where: { id },
      data: { isRead: true },
    });

    return {
      data: message,
      message: 'Message marked as read',
      statusCode: 200,
    };
  }
}
