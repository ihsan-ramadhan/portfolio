import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3001;

  app.setGlobalPrefix('api/v1');

  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
