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

  app.enableCors({ origin: 'http://localhost:3000', credentials: true });

  setupApp(app);

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
