import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupApp } from './setup-app';
import { ConsoleLogger } from '@nestjs/common';

async function bootstrap() {
  const isTest = process.env.NODE_ENV === 'test';

  const app = await NestFactory.create(AppModule, {
    logger: isTest
      ? false
      : new ConsoleLogger({
          json: true,
          colors: true,
        }),
  });

  const allowedOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',')
    : ['http://localhost:3000'];

  app.enableCors({ origin: allowedOrigins, credentials: true });

  setupApp(app);

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
