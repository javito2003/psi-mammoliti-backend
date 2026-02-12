import { faker } from '@faker-js/faker';
import { GetProfessionalsUseCase } from './get-professionals.use-case';
import { ProfessionalRepositoryPort } from '../../domain/ports/professional.repository.port';
import { SortOrder } from 'src/modules/shared/domain/interfaces/query-options.interface';

describe('GetProfessionalsUseCase', () => {
  let useCase: GetProfessionalsUseCase;
  let repository: jest.Mocked<ProfessionalRepositoryPort>;

  beforeEach(() => {
    repository = {
      save: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      findByUserId: jest.fn(),
    };

    useCase = new GetProfessionalsUseCase(repository);
  });

  it('should return paginated professionals with provided filter and query', async () => {
    const filter = { themeSlug: 'anxiety' };
    const query = {
      page: 3,
      limit: 5,
      sortBy: 'createdAt',
      sortOrder: SortOrder.ASC,
    };

    repository.findAll.mockResolvedValue({
      data: [
        {
          id: faker.string.uuid(),
          userId: faker.string.uuid(),
          bio: faker.lorem.sentence(),
          price: 120,
          timezone: 'America/Argentina/Buenos_Aires',
          themes: [],
          availability: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      total: 11,
    });

    const result = await useCase.execute(filter, query);

    expect(repository.findAll).toHaveBeenCalledWith(filter, {
      ...query,
      offset: 10,
      limit: 5,
    });
    expect(result).toEqual({
      data: expect.any(Array),
      total: 11,
      page: 3,
      limit: 5,
      totalPages: 3,
    });
  });

  it('should apply default pagination and empty filter when inputs are undefined', async () => {
    repository.findAll.mockResolvedValue({
      data: [],
      total: 0,
    });

    const result = await useCase.execute();

    expect(repository.findAll).toHaveBeenCalledWith(
      {},
      {
        offset: 0,
        limit: 50,
      },
    );
    expect(result).toEqual({
      data: [],
      total: 0,
      page: 1,
      limit: 50,
      totalPages: 0,
    });
  });
});
