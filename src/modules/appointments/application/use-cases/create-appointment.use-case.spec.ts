import { faker } from '@faker-js/faker';
import { CreateAppointmentUseCase } from './create-appointment.use-case';
import { AppointmentRepositoryPort } from '../../domain/ports/appointment.repository.port';
import { ProfessionalRepositoryPort } from '../../../professionals/domain/ports/professional.repository.port';
import { AppointmentStatus } from '../../domain/entities/appointment.entity';
import { ProfessionalEntity } from '../../../professionals/domain/entities/professional.entity';
import { ProfessionalNotFoundError } from 'src/modules/professionals/domain/exceptions/professionals.error';
import { AppointmentAlreadyBookedError } from '../../domain/exceptions/appointments.error';

describe('CreateAppointmentUseCase', () => {
  let useCase: CreateAppointmentUseCase;
  let appointmentRepo: jest.Mocked<AppointmentRepositoryPort>;
  let professionalRepo: jest.Mocked<ProfessionalRepositoryPort>;

  beforeEach(() => {
    appointmentRepo = {
      save: jest.fn(),
      findByProfessionalIdAndDateRange: jest.fn(),
      findByUserId: jest.fn(),
    };

    professionalRepo = {
      save: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByUserId: jest.fn(),
    };

    useCase = new CreateAppointmentUseCase(appointmentRepo, professionalRepo);
  });

  const buildProfessional = (): ProfessionalEntity => ({
    id: faker.string.uuid(),
    userId: faker.string.uuid(),
    bio: faker.lorem.sentence(),
    price: faker.number.int({ min: 10, max: 300 }),
    timezone: 'America/Argentina/Buenos_Aires',
    themes: [],
    availability: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  it('should create and persist a confirmed appointment when slot is available', async () => {
    const professional = buildProfessional();
    const userId = faker.string.uuid();
    const startAt = '2026-02-16T09:00:00.000Z';

    professionalRepo.findById.mockResolvedValue(professional);
    appointmentRepo.findByProfessionalIdAndDateRange.mockResolvedValue([]);
    appointmentRepo.save.mockImplementation(async (appointment) => appointment);

    const result = await useCase.execute(professional.id, userId, startAt);

    expect(professionalRepo.findById).toHaveBeenCalledWith(professional.id);
    expect(
      appointmentRepo.findByProfessionalIdAndDateRange,
    ).toHaveBeenCalledWith(
      professional.id,
      new Date(startAt),
      new Date('2026-02-16T10:00:00.000Z'),
    );
    expect(appointmentRepo.save).toHaveBeenCalledWith(
      expect.objectContaining({
        id: expect.any(String),
        professionalId: professional.id,
        userId,
        startAt: new Date(startAt),
        endAt: new Date('2026-02-16T10:00:00.000Z'),
        status: AppointmentStatus.CONFIRMED,
      }),
    );
    expect(result.status).toBe(AppointmentStatus.CONFIRMED);
  });

  it('should throw ProfessionalNotFoundError when professional does not exist', async () => {
    const professionalId = faker.string.uuid();

    professionalRepo.findById.mockResolvedValue(null);

    await expect(
      useCase.execute(
        professionalId,
        faker.string.uuid(),
        new Date().toISOString(),
      ),
    ).rejects.toThrow(ProfessionalNotFoundError);

    expect(
      appointmentRepo.findByProfessionalIdAndDateRange,
    ).not.toHaveBeenCalled();
    expect(appointmentRepo.save).not.toHaveBeenCalled();
  });

  it('should throw AppointmentAlreadyBookedError when slot overlaps', async () => {
    const professional = buildProfessional();
    const userId = faker.string.uuid();
    const startAt = '2026-02-16T09:00:00.000Z';

    professionalRepo.findById.mockResolvedValue(professional);
    appointmentRepo.findByProfessionalIdAndDateRange.mockResolvedValue([
      {
        id: faker.string.uuid(),
        professionalId: professional.id,
        userId,
        startAt: new Date(startAt),
        endAt: new Date('2026-02-16T10:00:00.000Z'),
        status: AppointmentStatus.CONFIRMED,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    await expect(
      useCase.execute(professional.id, userId, startAt),
    ).rejects.toThrow(AppointmentAlreadyBookedError);

    expect(appointmentRepo.save).not.toHaveBeenCalled();
  });
});
