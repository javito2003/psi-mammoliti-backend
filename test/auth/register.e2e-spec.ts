import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { RegisterUserDto } from '../../src/modules/auth/application/dtos/register-user.dto';
import { faker } from '@faker-js/faker';
import { createTestApp, cleanupDatabase } from '../utils/e2e-setup';
import {
  USER_PASSWORD_MAX_LENGTH,
  USER_PASSWORD_MIN_LENGTH,
} from '../../src/modules/users/domain/entities/user.entity';

describe('Auth - Register (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const context = await createTestApp();
    app = context.app;
  });

  afterEach(async () => {
    await cleanupDatabase(app);
  });

  afterAll(async () => {
    await app.close();
  });

  const userData: RegisterUserDto = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email().toLowerCase(),
    password: faker.string.alphanumeric(USER_PASSWORD_MIN_LENGTH),
  };

  it('should register a new user (201)', async () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send(userData)
      .expect(201);
  });

  it('should return 400 when registering with invalid email', async () => {
    const invalidData = { ...userData, email: faker.string.alphanumeric() };
    return request(app.getHttpServer())
      .post('/auth/register')
      .send(invalidData)
      .expect(400);
  });

  it('should return 400 when registering with short password', async () => {
    const invalidData = {
      ...userData,
      password: faker.internet.password({
        length: USER_PASSWORD_MIN_LENGTH - 1,
      }),
    };

    return request(app.getHttpServer())
      .post('/auth/register')
      .send(invalidData)
      .expect(400);
  });

  it('should return 400 when registering with too long password', async () => {
    const invalidData = {
      ...userData,
      password: faker.internet.password({
        length: USER_PASSWORD_MAX_LENGTH + 1,
      }),
    };

    return request(app.getHttpServer())
      .post('/auth/register')
      .send(invalidData)
      .expect(400);
  });

  it('should return 409 when registering with existing email', async () => {
    // Register first to ensure user exists
    await request(app.getHttpServer())
      .post('/auth/register')
      .send(userData)
      .expect(201);

    // Attempt to register with the same userData
    return request(app.getHttpServer())
      .post('/auth/register')
      .send(userData)
      .expect(409);
  });
});
