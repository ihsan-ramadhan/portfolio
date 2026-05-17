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
import { CreateProjectDto } from './dto/create-project.dto';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @SkipThrottle()
  async getProjects() {
    return this.projectsService.findAll();
  }

  @Get('featured')
  @SkipThrottle()
  async getFeatured() {
    return this.projectsService.findPinned();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createProject(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateProject(
    @Param('id') id: string,
    @Body() updateProjectDto: Partial<CreateProjectDto>,
  ) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async removeProject(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }
}
