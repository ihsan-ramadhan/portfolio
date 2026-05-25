import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class UpdateProjectDto {
  @ApiProperty({ example: 'portfolio', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'Personal portfolio site', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 'Custom description overriding GitHub bio',
    required: false,
  })
  @IsString()
  @IsOptional()
  customDesc?: string;

  @ApiProperty({ example: 'https://example.com/preview.png', required: false })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({
    example: 'https://github.com/ihsan-ramadhan/portfolio',
    required: false,
  })
  @IsUrl({}, { message: 'Format URL tidak valid' })
  @IsOptional()
  url?: string;

  @ApiProperty({ example: 'TypeScript', required: false })
  @IsString()
  @IsOptional()
  language?: string;

  @ApiProperty({
    example: ['React', 'NestJS'],
    required: false,
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isPinned?: boolean;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isVisible?: boolean;
}
