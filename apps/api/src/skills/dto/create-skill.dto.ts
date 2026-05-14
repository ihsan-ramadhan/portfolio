import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { SkillCategory } from '@prisma/client';

export class CreateSkillDto {
  @IsString()
  @IsNotEmpty({ message: 'Nama skill tidak boleh kosong' })
  name: string;

  @IsEnum(SkillCategory, { message: 'Kategori tidak valid' })
  category: SkillCategory;

  @IsInt()
  @Min(0)
  @Max(100)
  @IsOptional()
  proficiency?: number;

  @IsString()
  @IsOptional()
  icon?: string;
}
