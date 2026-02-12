import { faker } from '@faker-js/faker';
import { GetAvailableSlotsUseCase } from './get-available-slots.use-case';
import { AppointmentRepositoryPort } from '../../domain/ports/appointment.repository.port';
import { ProfessionalRepositoryPort } from '../../../professionals/domain/ports/professional.repository.port';
import { ProfessionalEntity } from '../../../professionals/domain/entities/professional.entity';
import { AvailabilityBlock } from '../../../professionals/domain/entities/professional-availability.entity';
import { AppointmentStatus } from '../../domain/entities/appointment.entity';
import { ProfessionalNotFoundError } from 'src/modules/professionals/domain/exceptions/professionals.error';

describe('GetAvailableSlotsUseCase', () => {
  let useCase: GetAvailableSlotsUseCase;
  let appointmentRepo: jest.Mocked<AppointmentRepositoryPort>;
  let professionalRepo: jest.Mocked<ProfessionalRepositoryPort>;

  beforeEach(() => {
    jest.useFakeTimers();

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

    useCase = new GetAvailableSlotsUseCase(appointmentRepo, professionalRepo);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const buildProfessional = (): ProfessionalEntity => ({
    id: faker.string.uuid(),
    userId: faker.string.uuid(),
    bio: faker.lorem.sentence(),
    price: faker.number.int({ min: 10, max: 300 }),
    timezone: 'America/Argentina/Buenos_Aires',
    themes: [],
    availability: [
      {
        id: faker.string.uuid(),
        professionalId: faker.string.uuid(),
        dayOfWeek: 1,
        block: AvailabilityBlock.MORNING,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  it('should return generated slots excluding overlapping appointments and past times', async () => {
    const professional = buildProfessional();
    const weekStart = new Date('2026-02-09T00:00:00.000Z');
    const professionalId = professional.id;

    jest.setSystemTime(new Date('2026-02-08T00:00:00.000Z'));

    professionalRepo.findById.mockResolvedValue(professional);
    appointmentRepo.findByProfessionalIdAndDateRange.mockResolvedValue([
      {
        id: faker.string.uuid(),
        professionalId,
        userId: faker.string.uuid(),
        startAt: new Date('2026-02-09T09:00:00.000Z'),
        endAt: new Date('2026-02-09T10:00:00.000Z'),
        status: AppointmentStatus.CONFIRMED,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    const result = await useCase.execute(
      professionalId,
      weekStart.toISOString(),
    );

    const startDate = new Date(weekStart);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 7);

    expect(
      appointmentRepo.findByProfessionalIdAndDateRange,
    ).toHaveBeenCalledWith(professionalId, startDate, endDate);

    const monday8 = new Date(startDate);
    monday8.setHours(8, 0, 0, 0);
    const monday10 = new Date(startDate);
    monday10.setHours(10, 0, 0, 0);
    const monday11 = new Date(startDate);
    monday11.setHours(11, 0, 0, 0);

    expect(result).toEqual(
      expect.arrayContaining([
        monday8.toISOString(),
        monday10.toISOString(),
        monday11.toISOString(),
      ]),
    );
    expect(result).not.toContain(
      new Date('2026-02-09T09:00:00.000Z').toISOString(),
    );
  });

  it('should throw ProfessionalNotFoundError when professional does not exist', async () => {
    const professionalId = faker.string.uuid();

    professionalRepo.findById.mockResolvedValue(null);

    await expect(useCase.execute(professionalId)).rejects.toThrow(
      ProfessionalNotFoundError,
    );

    expect(
      appointmentRepo.findByProfessionalIdAndDateRange,
    ).not.toHaveBeenCalled();
  });
});
