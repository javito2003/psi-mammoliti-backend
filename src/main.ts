import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupApp } from './setup-app';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({ origin: 'http://localhost:3000', credentials: true });
  
  setupApp(app);
  
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
