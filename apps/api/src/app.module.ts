import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
