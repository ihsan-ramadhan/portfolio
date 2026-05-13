import { IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  headline?: string;

  @IsString()
  @IsOptional()
  bio?: string;

  @IsUrl({}, { message: 'Format URL foto tidak valid' })
  @IsOptional()
  photoUrl?: string;

  @IsString()
  @IsOptional()
  location?: string;
}
