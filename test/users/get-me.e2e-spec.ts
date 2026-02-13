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

  afterAll(async (done) => {
    await app.close();
    done();
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
    expect(body.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
    );
    expect(new Date(body.createdAt).getTime()).not.toBeNaN();
    expect(new Date(body.updatedAt).getTime()).not.toBeNaN();
    expect(body.password).toBeUndefined();
    expect(body.hashedRefreshToken).toBeUndefined();
  });

  it('should return 401 without token', async () => {
    return request(app.getHttpServer()).get('/users/me').expect(401);
  });
});
