import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

export class UpdateSectionDto {
  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isEnabled?: boolean;

  @ApiProperty({ example: 1, required: false })
  @IsNumber()
  @IsOptional()
  order?: number;
}
