import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp, cleanupDatabase } from '../utils/e2e-setup';
import { DataSource } from 'typeorm';
import { ProfessionalFactory } from '../utils/factories/professional.factory';
import { AppointmentFactory } from '../utils/factories/appointment.factory';
import { ProfessionalAvailability } from '../../src/modules/professionals/infrastructure/adapters/persistence/professional-availability.schema';
import { AvailabilityBlock } from '../../src/modules/professionals/domain/entities/professional-availability.entity';
import { v4 as uuidv4 } from 'uuid';

describe('Appointments - Get Availability (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let professionalFactory: ProfessionalFactory;
  let appointmentFactory: AppointmentFactory;

  beforeAll(async () => {
    const context = await createTestApp();
    app = context.app;
    dataSource = app.get(DataSource);
    professionalFactory = new ProfessionalFactory(dataSource);
    appointmentFactory = new AppointmentFactory(dataSource);
  });

  afterEach(async () => {
    await cleanupDatabase(app);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return available slots', async () => {
    const professional = await professionalFactory.create();

    // Add availability
    const availRepo = dataSource.getRepository(ProfessionalAvailability);
    await availRepo.save(
      availRepo.create({
        id: uuidv4(),
        professionalId: professional.id,
        dayOfWeek: 1, // Monday
        block: AvailabilityBlock.MORNING,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    );

    // Calculate next Monday
    const d = new Date();
    while (d.getDay() !== 1) {
      d.setDate(d.getDate() + 1);
    }
    const weekStart = d.toISOString();

    const response = await request(app.getHttpServer())
      .get(`/professionals/${professional.id}/appointments/availability`)
      .query({ weekStart })
      .expect(200);

    expect(response.body.slots).toBeDefined();
    expect(response.body.slots.length).toBeGreaterThan(0);
  });

  it('should return available slots for next week', async () => {
    const professional = await professionalFactory.create();

    // Add availability for Monday
    const availRepo = dataSource.getRepository(ProfessionalAvailability);
    await availRepo.save(
      availRepo.create({
        id: uuidv4(),
        professionalId: professional.id,
        dayOfWeek: 1, // Monday
        block: AvailabilityBlock.MORNING,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    );

    // Calculate Monday of NEXT week (current week + 7 days)
    const d = new Date();
    while (d.getDay() !== 1) {
      d.setDate(d.getDate() + 1);
    }
    d.setDate(d.getDate() + 7);
    const weekStart = d.toISOString();

    const response = await request(app.getHttpServer())
      .get(`/professionals/${professional.id}/appointments/availability`)
      .query({ weekStart })
      .expect(200);

    expect(response.body.slots).toBeDefined();
    expect(response.body.slots.length).toBeGreaterThan(0);
    // Verify slot dates are in the expected week range
    const firstSlot = new Date(response.body.slots[0]);
    // Allow small margin for timezone/UTC differences if needed, but weekStart is pretty specific
    expect(firstSlot.getTime()).toBeGreaterThanOrEqual(
      new Date(weekStart).setHours(0, 0, 0, 0),
    );
  });

  it('should exclude booked slots from availability', async () => {
    const professional = await professionalFactory.create();

    // Add availability for Monday Morning (8-12) -> 4 slots: 8, 9, 10, 11
    const availRepo = dataSource.getRepository(ProfessionalAvailability);
    await availRepo.save(
      availRepo.create({
        id: uuidv4(),
        professionalId: professional.id,
        dayOfWeek: 1, // Monday
        block: AvailabilityBlock.MORNING,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    );

    // Calculate next Monday 9:00
    const d = new Date();
    while (d.getDay() !== 1) {
      d.setDate(d.getDate() + 1);
    }
    d.setHours(9, 0, 0, 0); // 9:00 local time

    // Book the 9:00 slot
    await appointmentFactory.create({
      professional,
      startAt: d,
      endAt: new Date(d.getTime() + 60 * 60 * 1000),
    });

    const weekStart = d.toISOString();

    const response = await request(app.getHttpServer())
      .get(`/professionals/${professional.id}/appointments/availability`)
      .query({ weekStart })
      .expect(200);

    const slots = response.body.slots;
    expect(slots).toBeDefined();

    // Check that booked slot is NOT in the list
    expect(slots).not.toContain(d.toISOString());

    // Check that other slots ARE in the list (e.g. 8:00)
    const slot8 = new Date(d);
    slot8.setHours(8, 0, 0, 0);
    expect(slots).toContain(slot8.toISOString());
  });
});