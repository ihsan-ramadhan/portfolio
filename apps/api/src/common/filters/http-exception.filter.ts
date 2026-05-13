import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : null;

    const message: unknown =
      typeof exceptionResponse === 'object' && exceptionResponse !== null
        ? (exceptionResponse as Record<string, unknown>).message ||
          (exceptionResponse as Record<string, unknown>).error ||
          'Unknown error'
        : exception instanceof Error
          ? exception.message
          : 'Internal server error';

    const finalMessage: unknown = Array.isArray(message)
      ? (message as unknown[])[0]
      : message;

    response.status(status).send({
      data: null,
      message:
        typeof finalMessage === 'string' ? finalMessage : String(finalMessage),
      statusCode: status,
    });
  }
}
