import request from 'supertest';
import { RegisterUserDto } from '../../src/modules/auth/application/dtos/register-user.dto';
import { LoginUserDto } from '../../src/modules/auth/application/dtos/login-user.dto';
import { faker } from '@faker-js/faker';
import { COOKIE_NAME } from '../../src/modules/auth/infrastructure/auth.constants';
import { cleanupDatabase, getTestApp } from '../utils/e2e-setup';
import { USER_PASSWORD_MIN_LENGTH } from '../../src/modules/users/domain/entities/user.entity';
import {
  USER_REPOSITORY,
  type UserRepositoryPort,
} from '../../src/modules/users/domain/ports/user.repository.port';

describe('Auth - Login (e2e)', () => {
  let userRepository: UserRepositoryPort;

  const userData: RegisterUserDto = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email().toLowerCase(),
    password: faker.string.alpha(USER_PASSWORD_MIN_LENGTH),
  };

  beforeAll(() => {
    userRepository = getTestApp().get<UserRepositoryPort>(USER_REPOSITORY);
  });

  beforeEach(async () => {
    // Pre-register user before each test to ensure clean state
    await request(getTestApp().getHttpServer())
      .post('/auth/register')
      .send(userData)
      .expect(201);
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  it('should login successfully and set cookies (201)', async () => {
    const loginDto: LoginUserDto = {
      email: userData.email,
      password: userData.password,
    };

    const response = await request(getTestApp().getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(201);

    const cookies = response.headers['set-cookie'];
    expect(cookies).toBeDefined();

    const accessCookie = cookies.find((c: string) =>
      c.startsWith(COOKIE_NAME.ACCESS),
    );
    const refreshCookie = cookies.find((c: string) =>
      c.startsWith(COOKIE_NAME.REFRESH),
    );

    expect(accessCookie).toBeDefined();
    expect(refreshCookie).toBeDefined();
    expect(accessCookie).toMatch(/HttpOnly/);
    expect(refreshCookie).toMatch(/HttpOnly/);

    const dbUser = await userRepository.findByEmail(userData.email);
    expect(dbUser).not.toBeNull();
    expect(dbUser!.hashedRefreshToken).toBeDefined();
  });

  it('should return 401 when logging in with wrong password', async () => {
    return request(getTestApp().getHttpServer())
      .post('/auth/login')
      .send({
        email: userData.email,
        password: faker.string.alpha(USER_PASSWORD_MIN_LENGTH),
      })
      .expect(401);
  });

  it('should return 401 when logging in with non-existent email', async () => {
    return request(getTestApp().getHttpServer())
      .post('/auth/login')
      .send({
        email: faker.internet.email(),
        password: faker.string.alpha(USER_PASSWORD_MIN_LENGTH),
      })
      .expect(401);
  });
});
