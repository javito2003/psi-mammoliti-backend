import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp, cleanupDatabase } from '../utils/e2e-setup';
import { DataSource } from 'typeorm';
import { AppointmentFactory } from '../utils/factories/appointment.factory';
import { ProfessionalFactory } from '../utils/factories/professional.factory';
import { RegisterUserDto } from '../../src/modules/auth/application/dtos/register-user.dto';
import { faker } from '@faker-js/faker';
import { COOKIE_NAME } from '../../src/modules/auth/infrastructure/auth.constants';
import { User } from '../../src/modules/users/infrastructure/adapters/persistence/user.schema';
import { AppointmentStatus } from '../../src/modules/appointments/domain/entities/appointment.entity';

describe('Appointments - Get User Appointments (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let appointmentFactory: AppointmentFactory;
  let professionalFactory: ProfessionalFactory;

  let accessTokenCookie: string;
  let user: User;

  beforeAll(async () => {
    const context = await createTestApp();
    app = context.app;
    dataSource = app.get(DataSource);
    appointmentFactory = new AppointmentFactory(dataSource);
    professionalFactory = new ProfessionalFactory(dataSource);
  });

  afterEach(async () => {
    await cleanupDatabase(app);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    // Register & Login User
    const userData: RegisterUserDto = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email().toLowerCase(),
      password: 'password123',
    };

    await request(app.getHttpServer())
      .post('/auth/register')
      .send(userData)
      .expect(201);

    const loginResp = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: userData.email, password: userData.password })
      .expect(201);

    const cookies = loginResp.headers['set-cookie'];
    accessTokenCookie = cookies
      .find((c: string) => c.startsWith(COOKIE_NAME.ACCESS))
      .split(';')[0];

    const userRepo = dataSource.getRepository(User);
    user = (await userRepo.findOneBy({ email: userData.email }))!;
  });

  it('should return my appointments (200) with correct structure', async () => {
    const professional = await professionalFactory.create();

    // Create appointments for this user
    await appointmentFactory.create({ user, professional });
    await appointmentFactory.create({ user, professional });

    const response = await request(app.getHttpServer())
      .get('/appointments')
      .set('Cookie', [accessTokenCookie])
      .query({ page: 1, limit: 10 })
      .expect(200);

    expect(response.body.data).toHaveLength(2);
    expect(response.body.meta.total).toBe(2);

    // Verify structure
    const appointment = response.body.data[0];
    expect(appointment).toMatchObject({
      id: expect.any(String),
      professionalId: professional.id,
      userId: user.id,
      startAt: expect.any(String),
      endAt: expect.any(String),
      status: AppointmentStatus.CONFIRMED,
    });
  });

  it('should return empty list when no appointments exist', async () => {
    const response = await request(app.getHttpServer())
      .get('/appointments')
      .set('Cookie', [accessTokenCookie])
      .expect(200);

    expect(response.body.data).toEqual([]);
    expect(response.body.meta.total).toBe(0);
  });
});