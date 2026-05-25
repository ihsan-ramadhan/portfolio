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
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiConsumes,
} from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { FileInterceptor } from '@nest-lab/fastify-multer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectsService } from './projects.service';
import { StorageService } from '../modules/storage/storage.service';

@ApiTags('Projects')
@Controller()
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly storageService: StorageService,
  ) {}

  @Get('projects')
  @SkipThrottle()
  @ApiOperation({ summary: 'Get all visible projects' })
  async getProjects() {
    return this.projectsService.findAll();
  }

  @Get('projects/featured')
  @SkipThrottle()
  @ApiOperation({ summary: 'Get pinned/featured projects' })
  async getFeatured() {
    return this.projectsService.findPinned();
  }

  @Post('projects')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a project manually' })
  async createProject(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @Patch('projects/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a project' })
  async updateProject(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete('projects/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a project' })
  async removeProject(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }

  @Get('admin/projects')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all projects including hidden ones' })
  async getAdminProjects() {
    return this.projectsService.findAllForAdmin();
  }

  @Patch('admin/projects/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Customize project (override GitHub data, set visibility, order)',
  })
  async updateAdminProject(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @Post('admin/projects/upload-image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upload project preview image' })
  @ApiConsumes('multipart/form-data')
  async uploadProjectImage(
    @UploadedFile() file: Express.Multer.File,
    @Body('oldImageUrl') oldImageUrl?: string,
  ) {
    if (oldImageUrl) {
      await this.storageService.deleteFile(oldImageUrl);
    }
    const fileName = `project-image-${Date.now()}`;
    const url = await this.storageService.uploadFile(file, fileName);
    return { imageUrl: url };
  }

  @Delete('admin/projects/image')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a project preview image from storage' })
  async deleteProjectImage(@Body('imageUrl') imageUrl: string) {
    if (imageUrl) {
      await this.storageService.deleteFile(imageUrl);
    }
    return { message: 'Image deleted successfully' };
  }
}
