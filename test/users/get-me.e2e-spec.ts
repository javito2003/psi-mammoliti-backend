import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { RegisterUserDto } from '../../src/modules/auth/application/dtos/register-user.dto';
import { faker } from '@faker-js/faker';
import { COOKIE_NAME } from '../../src/modules/auth/infrastructure/auth.constants';
import { createTestApp, cleanupDatabase } from '../utils/e2e-setup';

describe('Users - Get Me (e2e)', () => {
  let app: INestApplication;
  let accessTokenCookie: string;

  const userData: RegisterUserDto = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email().toLowerCase(),
    password: 'password123',
  };

  beforeAll(async () => {
    const context = await createTestApp();
    app = context.app;
  });

  beforeEach(async () => {
    // Register
    await request(app.getHttpServer())
      .post('/auth/register')
      .send(userData)
      .expect(201);

    // Login
    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: userData.email, password: userData.password })
      .expect(201);

    const cookies = loginResponse.headers['set-cookie'];
    const accessCookie = cookies.find((c: string) =>
      c.startsWith(COOKIE_NAME.ACCESS),
    );
    accessTokenCookie = accessCookie.split(';')[0];
  });

  afterEach(async () => {
    await cleanupDatabase(app);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return user profile (200)', async () => {
    const response = await request(app.getHttpServer())
      .get('/users/me')
      .set('Cookie', [accessTokenCookie])
      .expect(200);

    const { body } = response;
    expect(body).toEqual(
      expect.objectContaining({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
      }),
    );
    expect(body.createdAt).toBeDefined();
    expect(body.updatedAt).toBeDefined();
    expect(body.id).toBeDefined();
    expect(body.password).toBeUndefined();
  });

  it('should return 401 without token', async () => {
    return request(app.getHttpServer()).get('/users/me').expect(401);
  });
});
