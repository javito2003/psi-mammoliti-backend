import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { RegisterUserDto } from '../../src/modules/auth/application/dtos/register-user.dto';
import { faker } from '@faker-js/faker';
import { COOKIE_NAME } from '../../src/modules/auth/infrastructure/auth.constants';
import { createTestApp, cleanupDatabase } from '../utils/e2e-setup';
import { USER_PASSWORD_MIN_LENGTH } from '../../src/modules/users/domain/entities/user.entity';

describe('Auth - Refresh (e2e)', () => {
  let app: INestApplication;
  let refreshTokenCookie: string;

  const userData: RegisterUserDto = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email().toLowerCase(),
    password: faker.string.alpha(USER_PASSWORD_MIN_LENGTH),
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
    const refreshCookie = cookies.find((c: string) =>
      c.startsWith(COOKIE_NAME.REFRESH),
    );
    refreshTokenCookie = refreshCookie.split(';')[0];
  });

  afterEach(async () => {
    await cleanupDatabase(app);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should refresh tokens successfully (201)', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/refresh')
      .set('Cookie', [refreshTokenCookie])
      .expect(201);

    const cookies = response.headers['set-cookie'];
    expect(cookies).toBeDefined();

    const newAccessCookie = cookies.find((c: string) =>
      c.startsWith(COOKIE_NAME.ACCESS),
    );
    const newRefreshCookie = cookies.find((c: string) =>
      c.startsWith(COOKIE_NAME.REFRESH),
    );

    expect(newAccessCookie).toBeDefined();
    expect(newRefreshCookie).toBeDefined();
  });

  it('should return 401 when refreshing without cookie', async () => {
    return request(app.getHttpServer()).post('/auth/refresh').expect(401);
  });

  it('should return 401 when refreshing with invalid cookie', async () => {
    return request(app.getHttpServer())
      .post('/auth/refresh')
      .set('Cookie', [`${COOKIE_NAME.REFRESH}=invalidtoken`])
      .expect(401);
  });
});
