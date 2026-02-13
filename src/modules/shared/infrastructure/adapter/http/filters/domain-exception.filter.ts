import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { DomainError } from 'src/modules/shared/domain/base.exception';
import { domainHttpErrorMap } from '../domain.error-map';
import { Response } from 'express';

@Catch()
export class DomainExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(DomainExceptionFilter.name, {
    timestamp: true,
  });

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      this.logger.error(
        `HTTP Exception: ${status} - ${exception.message}`,
        exception.stack,
      );
      return res.status(status).json(exception.getResponse());
    }

    if (exception instanceof DomainError) {
      const mapper = domainHttpErrorMap[exception.code];
      if (mapper) {
        const httpEx = mapper(exception);
        this.logger.warn(
          `Domain Error: ${exception.code} - ${exception.message}`,
          exception.meta,
        );
        return res.status(httpEx.getStatus()).json(httpEx.getResponse());
      }
    }

    this.logger.error(
      `Unexpected Exception: ${exception instanceof Error ? exception.message : String(exception)}`,
      {
        stack: exception instanceof Error ? exception.stack : undefined,
      },
    );
    const httpEx = new InternalServerErrorException();
    return res.status(httpEx.getStatus()).json(httpEx.getResponse());
  }
}
