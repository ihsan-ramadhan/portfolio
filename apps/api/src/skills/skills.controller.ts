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
import { SkipThrottle } from '@nestjs/throttler';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateSkillDto } from './dto/create-skill.dto';
import { SkillsService } from './skills.service';

@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Get()
  @SkipThrottle()
  async getSkills() {
    return this.skillsService.findAll();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createSkill(@Body() createSkillDto: CreateSkillDto) {
    return this.skillsService.create(createSkillDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateSkill(
    @Param('id') id: string,
    @Body() updateSkillDto: Partial<CreateSkillDto>,
  ) {
    return this.skillsService.update(id, updateSkillDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async removeSkill(@Param('id') id: string) {
    return this.skillsService.remove(id);
  }
}
