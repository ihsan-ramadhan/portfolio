import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { Interest } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateInterestDto } from './dto/create-interest.dto';
import { InterestsService } from './interests.service';

@ApiTags('Interests')
@Controller()
export class InterestsController {
  constructor(private readonly interestsService: InterestsService) {}

  @Get('interests')
  @SkipThrottle()
  @ApiOperation({ summary: 'Get all interests' })
  getInterests(): Promise<Interest[]> {
    return this.interestsService.findAll();
  }

  @Post('admin/interests')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add a new interest' })
  createInterest(
    @Body() createInterestDto: CreateInterestDto,
  ): Promise<Interest> {
    return this.interestsService.create(createInterestDto);
  }

  @Patch('admin/interests/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update an interest' })
  updateInterest(
    @Param('id') id: string,
    @Body() updateInterestDto: Partial<CreateInterestDto>,
  ): Promise<Interest> {
    return this.interestsService.update(id, updateInterestDto);
  }

  @Delete('admin/interests/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete an interest' })
  removeInterest(@Param('id') id: string): Promise<Interest> {
    return this.interestsService.remove(id);
  }
}
