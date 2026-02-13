import { DataSource } from 'typeorm';
import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';
import { Appointment } from '../../../src/modules/appointments/infrastructure/adapters/persistence/appointment.schema';
import { AppointmentStatus } from '../../../src/modules/appointments/domain/entities/appointment.entity';
import { ProfessionalFactory } from './professional.factory';
import { UserFactory } from './user.factory';

export class AppointmentFactory {
  private professionalFactory: ProfessionalFactory;
  private userFactory: UserFactory;

  constructor(private dataSource: DataSource) {
    this.professionalFactory = new ProfessionalFactory(dataSource);
    this.userFactory = new UserFactory(dataSource);
  }

  async create(overrides: Partial<Appointment> = {}): Promise<Appointment> {
    const repo = this.dataSource.getRepository(Appointment);

    // Resolve dependencies
    const professional =
      overrides.professional || (await this.professionalFactory.create());
    const user = overrides.user || (await this.userFactory.create());

    // Default dates
    const startAt = overrides.startAt || faker.date.future();
    const endAt =
      overrides.endAt || new Date(startAt.getTime() + 60 * 60 * 1000);

    const appointment = repo.create({
      id: uuidv4(),
      professionalId: professional.id,
      professional,
      userId: user.id,
      user,
      startAt,
      endAt,
      status: AppointmentStatus.CONFIRMED,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides,
    });
    return repo.save(appointment);
  }
}
