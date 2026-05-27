import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateEducationDto {
  @ApiProperty({ example: 'Politeknik Negeri Bandung', required: false })
  @IsString()
  @IsOptional()
  institution?: string;

  @ApiProperty({ example: 'Informatics Engineering', required: false })
  @IsString()
  @IsOptional()
  major?: string;

  @ApiProperty({ example: 2022, required: false })
  @IsInt()
  @IsOptional()
  startYear?: number;

  @ApiProperty({ example: 2026, required: false })
  @IsInt()
  @IsOptional()
  endYear?: number;

  @ApiProperty({ example: 1, required: false })
  @IsInt()
  @IsOptional()
  order?: number;
}
