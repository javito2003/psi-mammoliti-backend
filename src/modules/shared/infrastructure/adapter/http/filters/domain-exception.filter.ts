import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import { DomainError } from 'src/modules/shared/domain/base.exception';
import { domainHttpErrorMap } from '../domain.error-map';
import { Response } from 'express';

@Catch()
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      return res.status(status).json(exception.getResponse());
    }

    if (exception instanceof DomainError) {
      const mapper = domainHttpErrorMap[exception.code];
      if (mapper) {
        const httpEx = mapper(exception);
        return res.status(httpEx.getStatus()).json(httpEx.getResponse());
      }
    }

    const httpEx = new InternalServerErrorException();
    return res.status(httpEx.getStatus()).json(httpEx.getResponse());
  }
}
