import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class CreateEducationDto {
  @ApiProperty({ example: 'Politeknik Negeri Bandung' })
  @IsString()
  institution: string;

  @ApiProperty({ example: 'Informatics Engineering' })
  @IsString()
  major: string;

  @ApiProperty({ example: 2022 })
  @IsInt()
  startYear: number;

  @ApiProperty({ example: 2026, required: false })
  @IsInt()
  @IsOptional()
  endYear?: number;

  @ApiProperty({ example: 1, required: false })
  @IsInt()
  @IsOptional()
  order?: number;
}
