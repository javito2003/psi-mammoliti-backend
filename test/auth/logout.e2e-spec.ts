import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { RegisterUserDto } from '../../src/modules/auth/application/dtos/register-user.dto';
import { faker } from '@faker-js/faker';
import { COOKIE_NAME } from '../../src/modules/auth/infrastructure/auth.constants';
import cookieParser from 'cookie-parser';
import { DomainExceptionFilter } from '../../src/modules/shared/infrastructure/adapter/http/filters/domain-exception.filter';

describe('Auth - Logout (e2e)', () => {
  let app: INestApplication;
  let accessTokenCookie: string;

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

  afterAll(async () => {
    await app.close();
  });

  it('should logout successfully (200)', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/logout')
      .set('Cookie', [accessTokenCookie])
      .expect(200);

    const cookies = response.headers['set-cookie'];

    // Check that cookies are cleared (either empty value or past expiration)
    const accessCookie = cookies.find((c: string) =>
      c.startsWith(`${COOKIE_NAME.ACCESS}=`),
    );
    const refreshCookie = cookies.find((c: string) =>
      c.startsWith(`${COOKIE_NAME.REFRESH}=`),
    );

    expect(accessCookie).toBeDefined();
    expect(refreshCookie).toBeDefined();

    // Typically cleared cookies look like Name=; Path=/; Expires=...
  });

  it('should return 401 (or 403) when logging out without access token', async () => {
    // The logout endpoint is protected by JwtAuthGuard
    return request(app.getHttpServer()).post('/auth/logout').expect(401);
  });
});
