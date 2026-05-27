import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsInt, IsString, ValidateNested } from 'class-validator';

export class SectionOrderItemDto {
  @ApiProperty({ example: 'hero' })
  @IsString()
  name: string;

  @ApiProperty({ example: 1 })
  @IsInt()
  order: number;
}

export class ReorderSectionsDto {
  @ApiProperty({ type: [SectionOrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SectionOrderItemDto)
  sections: SectionOrderItemDto[];
}
