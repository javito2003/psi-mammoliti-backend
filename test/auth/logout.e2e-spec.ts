import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { RegisterUserDto } from '../../src/modules/auth/application/dtos/register-user.dto';
import { faker } from '@faker-js/faker';
import { COOKIE_NAME } from '../../src/modules/auth/infrastructure/auth.constants';
import { createTestApp, cleanupDatabase } from '../utils/e2e-setup';
import { USER_PASSWORD_MIN_LENGTH } from '../../src/modules/users/domain/entities/user.entity';
import {
  USER_REPOSITORY,
  type UserRepositoryPort,
} from '../../src/modules/users/domain/ports/user.repository.port';

describe('Auth - Logout (e2e)', () => {
  let app: INestApplication;
  let accessTokenCookie: string;
  let userRepository: UserRepositoryPort;

  const userData: RegisterUserDto = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email().toLowerCase(),
    password: faker.string.alpha(USER_PASSWORD_MIN_LENGTH),
  };

  beforeAll(async () => {
    const context = await createTestApp();
    app = context.app;
    userRepository = app.get<UserRepositoryPort>(USER_REPOSITORY);
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

  it('should logout successfully (200)', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/logout')
      .set('Cookie', [accessTokenCookie])
      .expect(200);

    const cookies = response.headers['set-cookie'];

    const accessCookie = cookies.find((c: string) =>
      c.startsWith(`${COOKIE_NAME.ACCESS}=`),
    );
    const refreshCookie = cookies.find((c: string) =>
      c.startsWith(`${COOKIE_NAME.REFRESH}=`),
    );

    expect(accessCookie).toBeDefined();
    expect(refreshCookie).toBeDefined();
    expect(accessCookie).toMatch(`${COOKIE_NAME.ACCESS}=;`);
    expect(refreshCookie).toMatch(`${COOKIE_NAME.REFRESH}=;`);

    const dbUser = await userRepository.findByEmail(userData.email);
    expect(dbUser).not.toBeNull();
    expect(dbUser!.hashedRefreshToken).toBeNull();
  });

  it('should return 401 (or 403) when logging out without access token', async () => {
    return request(app.getHttpServer()).post('/auth/logout').expect(401);
  });
});
