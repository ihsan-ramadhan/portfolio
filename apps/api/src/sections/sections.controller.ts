import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateSectionDto } from './dto/update-section.dto';
import { ReorderSectionsDto } from './dto/reorder-sections.dto';
import { SectionsService } from './sections.service';

@ApiTags('Sections')
@Controller()
export class SectionsController {
  constructor(private readonly sectionsService: SectionsService) {}

  @Get('sections')
  @SkipThrottle()
  @ApiOperation({ summary: 'Get all site sections sorted by order' })
  async getSections() {
    return this.sectionsService.findAll();
  }

  @Patch('admin/sections/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update isEnabled or order for a section' })
  async updateSection(
    @Param('id') id: string,
    @Body() updateSectionDto: UpdateSectionDto,
  ) {
    return this.sectionsService.update(id, updateSectionDto);
  }

  @Put('admin/sections/reorder')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Bulk reorder multiple sections' })
  async reorderSections(@Body() reorderSectionsDto: ReorderSectionsDto) {
    return this.sectionsService.reorder(reorderSectionsDto);
  }
}
