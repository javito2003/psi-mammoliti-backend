import { faker } from '@faker-js/faker';
import { CreateAppointmentUseCase } from './create-appointment.use-case';
import { AppointmentRepositoryPort } from '../../domain/ports/appointment.repository.port';
import { ProfessionalRepositoryPort } from '../../../professionals/domain/ports/professional.repository.port';
import { AppointmentStatus } from '../../domain/entities/appointment.entity';
import { ProfessionalEntity } from '../../../professionals/domain/entities/professional.entity';
import { AvailabilityBlock } from '../../../professionals/domain/entities/professional-availability.entity';
import { ProfessionalNotFoundError } from 'src/modules/professionals/domain/exceptions/professionals.error';
import { AppointmentAlreadyBookedError } from '../../domain/exceptions/appointments.error';

function nextMonday9AM(): Date {
  const now = new Date();
  const daysUntilMonday = (8 - now.getDay()) % 7 || 7;
  const date = new Date(now);
  date.setDate(date.getDate() + daysUntilMonday);
  date.setHours(9, 0, 0, 0);
  return date;
}

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

  const buildProfessional = (): ProfessionalEntity => {
    const profId = faker.string.uuid();
    return {
      id: profId,
      userId: faker.string.uuid(),
      bio: faker.lorem.sentence(),
      price: faker.number.int({ min: 10, max: 300 }),
      timezone: 'America/Argentina/Buenos_Aires',
      themes: [],
      availability: [
        {
          id: faker.string.uuid(),
          professionalId: profId,
          dayOfWeek: 1, // Monday — matches 2026-02-16
          block: AvailabilityBlock.MORNING,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  };

  it('should create and persist a confirmed appointment when slot is available', async () => {
    const professional = buildProfessional();
    const userId = faker.string.uuid();
    const startDate = nextMonday9AM();
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + 1);

    professionalRepo.findById.mockResolvedValue(professional);
    appointmentRepo.findByProfessionalIdAndDateRange.mockResolvedValue([]);
    appointmentRepo.save.mockImplementation((appointment) =>
      Promise.resolve(appointment),
    );

    const result = await useCase.execute(
      professional.id,
      userId,
      startDate.toISOString(),
    );

    expect(professionalRepo.findById).toHaveBeenCalledWith(professional.id);
    expect(
      appointmentRepo.findByProfessionalIdAndDateRange,
    ).toHaveBeenCalledWith(professional.id, startDate, endDate);
    const savedAppointment = appointmentRepo.save.mock.calls[0]?.[0];
    expect(savedAppointment).toBeDefined();
    expect(savedAppointment?.id).toBeDefined();
    expect(savedAppointment?.professionalId).toBe(professional.id);
    expect(savedAppointment?.userId).toBe(userId);
    expect(savedAppointment?.startAt).toEqual(startDate);
    expect(savedAppointment?.endAt).toEqual(endDate);
    expect(savedAppointment?.status).toBe(AppointmentStatus.CONFIRMED);
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
    const startDate = nextMonday9AM();
    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + 1);

    professionalRepo.findById.mockResolvedValue(professional);
    appointmentRepo.findByProfessionalIdAndDateRange.mockResolvedValue([
      {
        id: faker.string.uuid(),
        professionalId: professional.id,
        userId,
        startAt: startDate,
        endAt: endDate,
        status: AppointmentStatus.CONFIRMED,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);

    await expect(
      useCase.execute(professional.id, userId, startDate.toISOString()),
    ).rejects.toThrow(AppointmentAlreadyBookedError);

    expect(appointmentRepo.save).not.toHaveBeenCalled();
  });
});
