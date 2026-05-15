import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from '../src/common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';
import { fastifyMultipart } from '@fastify/multipart';

let cachedApp: NestFastifyApplication;

export default async function handler(req: any, res: any) {
  if (!cachedApp) {
    cachedApp = await NestFactory.create<NestFastifyApplication>(
      AppModule,
      new FastifyAdapter(),
    );
    cachedApp.setGlobalPrefix('api/v1');
    cachedApp.useGlobalPipes(
      new ValidationPipe({ transform: true, whitelist: true }),
    );

    cachedApp.useGlobalInterceptors(new TransformInterceptor());
    cachedApp.useGlobalFilters(new HttpExceptionFilter());
    await cachedApp.register(fastifyMultipart);

    cachedApp.enableCors({
      origin: (process.env.FRONTEND_URL || '*').trim().replace(/['"]/g, ''),
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    });

    await cachedApp.init();
  }

  const fastify = cachedApp.getHttpAdapter().getInstance();
  fastify.ready((err) => {
    if (err) throw err;
    fastify.server.emit('request', req, res);
  });
}
