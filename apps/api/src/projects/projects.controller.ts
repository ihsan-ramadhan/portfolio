import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { FileInterceptor } from '@nest-lab/fastify-multer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectsService } from './projects.service';
import { StorageService } from '../modules/storage/storage.service';

@Controller()
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly storageService: StorageService,
  ) {}

  @Get('projects')
  @SkipThrottle()
  async getProjects() {
    return this.projectsService.findAll();
  }

  @Get('projects/featured')
  @SkipThrottle()
  async getFeatured() {
    return this.projectsService.findPinned();
  }

  @Post('projects')
  @UseGuards(JwtAuthGuard)
  async createProject(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @Patch('projects/:id')
  @UseGuards(JwtAuthGuard)
  async updateProject(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete('projects/:id')
  @UseGuards(JwtAuthGuard)
  async removeProject(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }

  @Get('admin/projects')
  @UseGuards(JwtAuthGuard)
  async getAdminProjects() {
    return this.projectsService.findAllForAdmin();
  }

  @Patch('admin/projects/:id')
  @UseGuards(JwtAuthGuard)
  async updateAdminProject(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @Post('admin/projects/upload-image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadProjectImage(@UploadedFile() file: Express.Multer.File) {
    const fileName = `project-image-${Date.now()}`;
    const url = await this.storageService.uploadFile(file, fileName);
    return { imageUrl: url };
  }
}
