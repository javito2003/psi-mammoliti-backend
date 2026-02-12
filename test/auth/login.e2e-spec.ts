import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { RegisterUserDto } from '../../src/modules/auth/application/dtos/register-user.dto';
import { LoginUserDto } from '../../src/modules/auth/application/dtos/login-user.dto';
import { faker } from '@faker-js/faker';
import { COOKIE_NAME } from '../../src/modules/auth/infrastructure/auth.constants';
import cookieParser from 'cookie-parser';
import { DomainExceptionFilter } from '../../src/modules/shared/infrastructure/adapter/http/filters/domain-exception.filter';

describe('Auth - Login (e2e)', () => {
  let app: INestApplication;

  const userData: RegisterUserDto = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 10 }),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    app.useGlobalFilters(new DomainExceptionFilter());
    app.use(cookieParser());
    await app.init();

    // Pre-register user
    await request(app.getHttpServer())
      .post('/auth/register')
      .send(userData)
      .expect(201);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should login successfully and set cookies (201)', async () => {
    const loginDto: LoginUserDto = {
      email: userData.email,
      password: userData.password,
    };

    const response = await request(app.getHttpServer())
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
  });

  it('should return 401 when logging in with wrong password', async () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: userData.email, password: 'wrongpassword' })
      .expect(401);
  });

  it('should return 401 when logging in with non-existent email', async () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: faker.internet.email(), password: 'anypassword' })
      .expect(401);
  });
});
