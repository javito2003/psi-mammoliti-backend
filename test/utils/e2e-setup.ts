import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../src/app.module';
import { setupApp } from '../../src/setup-app';
import { DataSource } from 'typeorm';
import { Connection } from 'mysql2';

export interface TestContext {
  app: INestApplication;
  module: TestingModule;
  connection: DataSource;
}

let testContext: TestContext | null = null;

export async function createTestApp(): Promise<TestContext> {
  if (testContext) {
    return testContext;
  }

  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();
  setupApp(app);
  await app.init();

  testContext = {
    app,
    module: moduleFixture,
    connection: moduleFixture.get(DataSource),
  };
  return testContext;
}

export function getTestApp(): INestApplication {
  if (!testContext) {
    throw new Error('Test app is not initialized. Call createTestApp() first.');
  }

  return testContext.app;
}

export async function closeTestApp(): Promise<void> {
  if (!testContext) {
    return;
  }

  await testContext.app.close();
  await testContext.connection.destroy();
  testContext = null;
}

export async function cleanupDatabase(app: INestApplication = getTestApp()) {
  const dataSource = app.get(DataSource);
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();

  try {
    // Disable foreign key checks to avoid constraint errors
    await queryRunner.query('SET FOREIGN_KEY_CHECKS = 0;');

    const entities = dataSource.entityMetadatas;
    for (const entity of entities) {
      const tableName = entity.tableName;
      await queryRunner.query(`DELETE FROM \`${tableName}\`;`);
    }

    await queryRunner.query('SET FOREIGN_KEY_CHECKS = 1;');
  } finally {
    await queryRunner.release();
  }
}
