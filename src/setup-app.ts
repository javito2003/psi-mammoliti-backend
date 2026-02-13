import { INestApplication, ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { DomainExceptionFilter } from './modules/shared/infrastructure/adapter/http/filters/domain-exception.filter';

export function setupApp(app: INestApplication) {
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new DomainExceptionFilter());
  app.use(cookieParser());
}
