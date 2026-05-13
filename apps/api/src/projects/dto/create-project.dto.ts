import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty({ message: 'Judul proyek tidak boleh kosong' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Deskripsi tidak boleh kosong' })
  description: string;

  @IsUrl({}, { message: 'Format URL gambar tidak valid' })
  @IsOptional()
  imageUrl?: string;

  @IsUrl({}, { message: 'Format URL repo tidak valid' })
  @IsOptional()
  repoUrl?: string;

  @IsUrl({}, { message: 'Format URL live tidak valid' })
  @IsOptional()
  liveUrl?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  technologies?: string[];

  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;
}
