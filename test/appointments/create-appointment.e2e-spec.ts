import request from 'supertest';
import { cleanupDatabase, getTestApp } from '../utils/e2e-setup';
import { DataSource } from 'typeorm';
import { ProfessionalFactory } from '../utils/factories/professional.factory';
import { AppointmentFactory } from '../utils/factories/appointment.factory';
import { RegisterUserDto } from '../../src/modules/auth/application/dtos/register-user.dto';
import { faker } from '@faker-js/faker';
import { COOKIE_NAME } from '../../src/modules/auth/infrastructure/auth.constants';
import { ProfessionalAvailability } from '../../src/modules/professionals/infrastructure/adapters/persistence/professional-availability.schema';
import { AvailabilityBlock } from '../../src/modules/professionals/domain/entities/professional-availability.entity';
import { AppointmentStatus } from '../../src/modules/appointments/domain/entities/appointment.entity';
import { v4 as uuidv4 } from 'uuid';

describe('Appointments - Create Appointment (e2e)', () => {
  let dataSource: DataSource;
  let professionalFactory: ProfessionalFactory;
  let appointmentFactory: AppointmentFactory;
  let accessTokenCookie: string;

  beforeAll(() => {
    dataSource = getTestApp().get(DataSource);
    professionalFactory = new ProfessionalFactory(dataSource);
    appointmentFactory = new AppointmentFactory(dataSource);
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  beforeEach(async () => {
    const userData: RegisterUserDto = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email().toLowerCase(),
      password: 'password123',
    };

    await request(getTestApp().getHttpServer())
      .post('/auth/register')
      .send(userData)
      .expect(201);

    const loginResp = await request(getTestApp().getHttpServer())
      .post('/auth/login')
      .send({ email: userData.email, password: userData.password })
      .expect(201);

    accessTokenCookie = loginResp.headers['set-cookie']
      .find((c: string) => c.startsWith(COOKIE_NAME.ACCESS))
      .split(';')[0];
  });

  it('should create an appointment and return correct structure (201)', async () => {
    const professional = await professionalFactory.create();

    // Add availability
    const availRepo = dataSource.getRepository(ProfessionalAvailability);
    await availRepo.save(
      availRepo.create({
        id: uuidv4(),
        professionalId: professional.id,
        dayOfWeek: 1, // Monday
        block: AvailabilityBlock.MORNING, // 8-12
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    );

    // Calculate a valid slot: Next Monday at 9:00
    const d = new Date();
    while (d.getDay() !== 1) {
      d.setDate(d.getDate() + 1);
    }
    d.setHours(9, 0, 0, 0);

    const response = await request(getTestApp().getHttpServer())
      .post(`/professionals/${professional.id}/appointments`)
      .set('Cookie', [accessTokenCookie])
      .send({ startAt: d.toISOString() })
      .expect(201);

    expect(response.body).toMatchObject({
      id: expect.any(String),
      professionalId: professional.id,
      startAt: d.toISOString(),
      status: AppointmentStatus.CONFIRMED,
    });
    expect(response.body.userId).toBeDefined();
  });

  it('should return 400 when appointment slot is already booked', async () => {
    const professional = await professionalFactory.create();

    // Add availability
    const availRepo = dataSource.getRepository(ProfessionalAvailability);
    await availRepo.save(
      availRepo.create({
        id: uuidv4(),
        professionalId: professional.id,
        dayOfWeek: 1, // Monday
        block: AvailabilityBlock.MORNING, // 8-12
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    );

    // Calculate a valid slot
    const d = new Date();
    while (d.getDay() !== 1) {
      d.setDate(d.getDate() + 1);
    }
    d.setHours(9, 0, 0, 0);

    // Create an existing appointment at this time
    await appointmentFactory.create({
      professional,
      startAt: d,
      endAt: new Date(d.getTime() + 60 * 60 * 1000),
    });

    // Try to book the same slot
    await request(getTestApp().getHttpServer())
      .post(`/professionals/${professional.id}/appointments`)
      .set('Cookie', [accessTokenCookie])
      .send({ startAt: d.toISOString() })
      .expect(400);
  });
});
