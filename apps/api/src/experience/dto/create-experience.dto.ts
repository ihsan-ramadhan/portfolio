import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateExperienceDto {
  @ApiProperty({ example: 'Tech Solutions Inc.' })
  @IsString()
  company: string;

  @ApiProperty({ example: 'Software Engineer' })
  @IsString()
  position: string;

  @ApiProperty({ example: 'Jan 2024' })
  @IsString()
  startDate: string;

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
