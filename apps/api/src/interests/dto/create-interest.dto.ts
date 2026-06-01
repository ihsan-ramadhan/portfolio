import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateInterestDto {
  @ApiProperty({ example: 'Web Dev' })
  @IsString()
  @IsNotEmpty({ message: 'Nama interest tidak boleh kosong' })
  name: string;

  @ApiProperty({ example: 0, required: false })
  @IsInt()
  @IsOptional()
  order?: number;
}
