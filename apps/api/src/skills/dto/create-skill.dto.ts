import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export enum SkillCategory {
  FRONTEND = 'FRONTEND',
  BACKEND = 'BACKEND',
  TOOLS = 'TOOLS',
  OTHERS = 'OTHERS',
}

export class CreateSkillDto {
  @ApiProperty({ example: 'TypeScript' })
  @IsString()
  @IsNotEmpty({ message: 'Nama skill tidak boleh kosong' })
  name: string;

  @ApiProperty({ enum: SkillCategory, example: SkillCategory.FRONTEND })
  @IsEnum(SkillCategory, { message: 'Kategori tidak valid' })
  category: SkillCategory;

  @ApiProperty({ example: 85, minimum: 0, maximum: 100, required: false })
  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  proficiency?: number;

  @ApiProperty({
    example: 'typescript',
    required: false,
    description: 'Icon identifier (e.g. devicon slug)',
  })
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiProperty({ example: 'https://www.typescriptlang.org', required: false })
  @IsString()
  @IsOptional()
  url?: string;
}
