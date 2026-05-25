import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from '@fastify/helmet';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import multipart from '@fastify/multipart';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  await app.register(multipart);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3001;
  const nodeEnv = configService.get<string>('NODE_ENV');

  app.setGlobalPrefix('api/v1');

  await app.register(helmet, {
    contentSecurityPolicy: nodeEnv === 'production',
  });

  const frontendUrl = configService.get<string>('FRONTEND_URL');
  let corsOrigin: string | string[] | boolean = false;

  if (frontendUrl) {
    corsOrigin = frontendUrl.includes(',')
      ? frontendUrl.split(',')
      : frontendUrl;
  }

  app.enableCors({
    origin: corsOrigin,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalInterceptors(new TransformInterceptor());

  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  if (nodeEnv !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Portfolio API')
      .setDescription('REST API for ihsanramadhan.my.id')
      .setVersion('1.0')
      .setContact('Muhammad Ihsan Ramadhan', 'https://ihsanramadhan.my.id', '')
      .setExternalDoc(
        'GitHub Repository',
        'https://github.com/ihsan-ramadhan/portfolio',
      )
      .addServer('http://localhost:3000/api/v1', 'Development')
      .addServer('https://api.ihsanramadhan.my.id/api/v1', 'Production')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/v1/docs', app, document, {
      explorer: true,
    });
  }

  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
