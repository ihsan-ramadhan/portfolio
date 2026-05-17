import {
  IsArray,
  IsBoolean,
  IsOptional,
  IsString,
  IsUrl,
} from 'class-validator';

export class UpdateProjectDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  customDesc?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @IsUrl({}, { message: 'Format URL tidak valid' })
  @IsOptional()
  url?: string;

  @IsString()
  @IsOptional()
  language?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsBoolean()
  @IsOptional()
  isPinned?: boolean;

  @IsBoolean()
  @IsOptional()
  isVisible?: boolean;
}
