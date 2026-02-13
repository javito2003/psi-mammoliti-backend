import { closeTestApp, createTestApp } from './utils/e2e-setup';

process.env.NODE_ENV = 'test';

beforeAll(async () => {
  await createTestApp();
});

afterAll(async () => {
  await closeTestApp();
});
