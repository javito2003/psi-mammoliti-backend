import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../src/app.module';
import { RegisterUserDto } from '../../src/modules/auth/application/dtos/register-user.dto';
import { faker } from '@faker-js/faker';
import cookieParser from 'cookie-parser';
import { DomainExceptionFilter } from '../../src/modules/shared/infrastructure/adapter/http/filters/domain-exception.filter';

describe('Auth - Register (e2e)', () => {
  let app: INestApplication;

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
  });

  afterAll(async () => {
    await app.close();
  });

  const userData: RegisterUserDto = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 10 }),
  };

  it('should register a new user (201)', async () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send(userData)
      .expect(201);
  });

  it('should return 400 when registering with invalid email', async () => {
    const invalidData = { ...userData, email: 'invalid-email' };
    return request(app.getHttpServer())
      .post('/auth/register')
      .send(invalidData)
      .expect(400);
  });

  it('should return 400 when registering with short password', async () => {
    const invalidData = { ...userData, password: '123' };
    return request(app.getHttpServer())
      .post('/auth/register')
      .send(invalidData)
      .expect(400);
  });

  it('should return 409 when registering with existing email', async () => {
    // Attempt to register with the same userData used in the first test
    return request(app.getHttpServer())
      .post('/auth/register')
      .send(userData)
      .expect(409);
  });
});
