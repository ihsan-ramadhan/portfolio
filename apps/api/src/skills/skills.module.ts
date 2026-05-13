import { Module } from '@nestjs/common';
import { SkillsService } from './skills.service';
import { SkillsController } from './skills.controller';

@Module({
  providers: [SkillsService],
  controllers: [SkillsController],
})
export class SkillsModule {}
