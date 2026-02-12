import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { setupApp } from '../../src/setup-app';
import { DataSource } from 'typeorm';

export interface TestContext {
  app: INestApplication;
  module: TestingModule;
}

export async function createTestApp(): Promise<TestContext> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();
  setupApp(app);
  await app.init();
  
  return { app, module: moduleFixture };
}

export async function cleanupDatabase(app: INestApplication) {
  const dataSource = app.get(DataSource);
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();

  try {
    // Disable foreign key checks to avoid constraint errors
    await queryRunner.query('SET FOREIGN_KEY_CHECKS = 0;');

    const entities = dataSource.entityMetadatas;
    for (const entity of entities) {
      const tableName = entity.tableName;
      await queryRunner.query(`TRUNCATE TABLE \`${tableName}\`;`);
    }

    await queryRunner.query('SET FOREIGN_KEY_CHECKS = 1;');
  } finally {
    await queryRunner.release();
  }
}
