import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ScheduleModule } from '@nestjs/schedule';
import * as Joi from 'joi';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ProfileModule } from './profile/profile.module';
import { SkillsModule } from './skills/skills.module';
import { ProjectsModule } from './projects/projects.module';
import { GitHubModule } from './modules/github/github.module';
import { SyncModule } from './modules/sync/sync.module';
import { StorageModule } from './modules/storage/storage.module';
import { ContactModule } from './modules/contact/contact.module';

@Module({
  imports: [
    PrismaModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        PORT: Joi.number().default(3001),
        DATABASE_URL: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRY: Joi.string().default('7d'),
        ADMIN_EMAIL: Joi.string().email().required(),
        ADMIN_PASSWORD_HASH: Joi.string().required(),
        GITHUB_TOKEN: Joi.string().required(),
        GITHUB_USERNAME: Joi.string().required(),
        SUPABASE_URL: Joi.string().required(),
        SUPABASE_SERVICE_KEY: Joi.string().required(),
        FRONTEND_URL: Joi.string().required(),
      }),
    }),
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 10,
      },
      {
        name: 'medium',
        ttl: 60000,
        limit: 100,
      },
    ]),
    AuthModule,
    ProfileModule,
    SkillsModule,
    ProjectsModule,
    GitHubModule,
    SyncModule,
    StorageModule,
    ContactModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
