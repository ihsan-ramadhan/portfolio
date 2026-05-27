import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({ example: 'Full Stack Developer', required: false })
  @IsString()
  @IsOptional()
  headline?: string;

  @ApiProperty({
    example: 'Passionate developer from Indonesia.',
    required: false,
  })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiProperty({ example: 'https://example.com/photo.jpg', required: false })
  @IsUrl({}, { message: 'Format URL foto tidak valid' })
  @IsOptional()
  photoUrl?: string;

  @ApiProperty({ example: 'Bandung, Indonesia', required: false })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({ example: 'Still Exploring', required: false })
  @IsString()
  @IsOptional()
  statusBadge?: string;

  @ApiProperty({ example: 'Building digital experiences that matter.', required: false })
  @IsString()
  @IsOptional()
  tagline?: string;
}
