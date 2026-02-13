import { faker } from '@faker-js/faker';
import { GetUserAppointmentsUseCase } from './get-user-appointments.use-case';
import { AppointmentRepositoryPort } from '../../domain/ports/appointment.repository.port';
import { AppointmentStatus } from '../../domain/entities/appointment.entity';
import { SortOrder } from 'src/modules/shared/domain/interfaces/query-options.interface';

describe('GetUserAppointmentsUseCase', () => {
  let useCase: GetUserAppointmentsUseCase;
  let appointmentRepo: jest.Mocked<AppointmentRepositoryPort>;

  beforeEach(() => {
    appointmentRepo = {
      save: jest.fn(),
      findByProfessionalIdAndDateRange: jest.fn(),
      findByUserId: jest.fn(),
    };

    useCase = new GetUserAppointmentsUseCase(appointmentRepo);
  });

  it('should return paginated appointments with provided query options', async () => {
    const userId = faker.string.uuid();
    const query = {
      page: 2,
      limit: 10,
      sortBy: 'startAt',
      sortOrder: SortOrder.ASC,
    };

    appointmentRepo.findByUserId.mockResolvedValue({
      data: [
        {
          id: faker.string.uuid(),
          professionalId: faker.string.uuid(),
          userId,
          startAt: new Date(),
          endAt: new Date(),
          status: AppointmentStatus.CONFIRMED,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      total: 21,
    });

    const result = await useCase.execute(userId, query);

    expect(appointmentRepo.findByUserId).toHaveBeenCalledWith(userId, {
      ...query,
      offset: 10,
      limit: 10,
    });
    expect(result.total).toBe(21);
    expect(result.page).toBe(2);
    expect(result.limit).toBe(10);
    expect(result.totalPages).toBe(3);
    expect(result.data).toHaveLength(1);
    expect(result.data[0]?.id).toBeDefined();
    expect(result.data[0]?.professionalId).toBeDefined();
    expect(result.data[0]?.userId).toBe(userId);
    expect(result.data[0]?.status).toBe(AppointmentStatus.CONFIRMED);
  });

  it('should apply default pagination when query is not provided', async () => {
    const userId = faker.string.uuid();

    appointmentRepo.findByUserId.mockResolvedValue({
      data: [],
      total: 0,
    });

    const result = await useCase.execute(userId);

    expect(appointmentRepo.findByUserId).toHaveBeenCalledWith(userId, {
      offset: 0,
      limit: 50,
    });
    expect(result).toEqual({
      data: [],
      total: 0,
      page: 1,
      limit: 50,
      totalPages: 0,
    });
  });
});
