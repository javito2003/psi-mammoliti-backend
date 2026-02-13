import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { RegisterUserDto } from '../../src/modules/auth/application/dtos/register-user.dto';
import { faker } from '@faker-js/faker';
import { createTestApp, cleanupDatabase } from '../utils/e2e-setup';
import {
  USER_PASSWORD_MAX_LENGTH,
  USER_PASSWORD_MIN_LENGTH,
} from '../../src/modules/users/domain/entities/user.entity';
import {
  USER_REPOSITORY,
  type UserRepositoryPort,
} from '../../src/modules/users/domain/ports/user.repository.port';

describe('Auth - Register (e2e)', () => {
  let app: INestApplication;
  let userRepository: UserRepositoryPort;

  beforeAll(async () => {
    const context = await createTestApp();
    app = context.app;
    userRepository = app.get<UserRepositoryPort>(USER_REPOSITORY);
  });

  afterEach(async () => {
    await cleanupDatabase(app);
  });

  afterAll(async (done) => {
    await app.close();
    done();
  });

  const userData: RegisterUserDto = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email().toLowerCase(),
    password: faker.string.alphanumeric(USER_PASSWORD_MIN_LENGTH),
  };

  it('should register a new user (201)', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send(userData)
      .expect(201);

    const dbUser = await userRepository.findByEmail(userData.email);
    expect(dbUser).not.toBeNull();
    expect(dbUser!.firstName).toBe(userData.firstName);
    expect(dbUser!.lastName).toBe(userData.lastName);
    expect(dbUser!.email).toBe(userData.email);
    expect(dbUser!.password).not.toBe(userData.password);
    expect(dbUser!.createdAt).toBeInstanceOf(Date);
    expect(dbUser!.updatedAt).toBeInstanceOf(Date);
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
