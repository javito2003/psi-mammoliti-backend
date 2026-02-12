import { faker } from '@faker-js/faker';
import { GetThemesUseCase } from './get-themes.use-case';
import { ThemeRepositoryPort } from '../../domain/ports/theme.repository.port';

describe('GetThemesUseCase', () => {
  let useCase: GetThemesUseCase;
  let repository: jest.Mocked<ThemeRepositoryPort>;

  beforeEach(() => {
    repository = {
      save: jest.fn(),
      findAll: jest.fn(),
    };

    useCase = new GetThemesUseCase(repository);
  });

  it('should return all themes from repository', async () => {
    const themes = [
      {
        id: faker.string.uuid(),
        name: 'Anxiety',
        slug: 'anxiety',
      },
      {
        id: faker.string.uuid(),
        name: 'Burnout',
        slug: 'burnout',
      },
    ];

    repository.findAll.mockResolvedValue(themes);

    const result = await useCase.execute();

    expect(repository.findAll).toHaveBeenCalled();
    expect(result).toEqual(themes);
  });
});
