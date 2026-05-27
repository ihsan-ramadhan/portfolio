import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateExperienceDto {
  @ApiProperty({ example: 'Tech Solutions Inc.', required: false })
  @IsString()
  @IsOptional()
  company?: string;

  @ApiProperty({ example: 'Software Engineer', required: false })
  @IsString()
  @IsOptional()
  position?: string;

  @ApiProperty({ example: 'Jan 2024', required: false })
  @IsString()
  @IsOptional()
  startDate?: string;

  @ApiProperty({ example: 'Present', required: false })
  @IsString()
  @IsOptional()
  endDate?: string;

  @ApiProperty({ example: 'Developing web applications', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 1, required: false })
  @IsInt()
  @IsOptional()
  order?: number;
}
