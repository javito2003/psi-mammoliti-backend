import { NestFactory } from '@nestjs/core';
import { SeedModule } from './database/seeds/seed.module';
import { SeedService } from './database/seeds/seed.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeedModule);
  const logger = console;

  try {
    const seedService = app.get(SeedService);
    await seedService.seed();
    logger.log('Seeding finished successfully');
  } catch (error) {
    logger.error('Seeding failed', error);
  } finally {
    await app.close();
  }
}

bootstrap();
