import { faker } from '@faker-js/faker';
import { LogoutUserUseCase } from './logout-user.use-case';
import { UserRepositoryPort } from '../../../users/domain/ports/user.repository.port';

describe('LogoutUserUseCase', () => {
  let useCase: LogoutUserUseCase;
  let userRepository: jest.Mocked<UserRepositoryPort>;

  beforeEach(() => {
    userRepository = {
      save: jest.fn(),
      updateRefreshToken: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
    };

    useCase = new LogoutUserUseCase(userRepository);
  });

  it('should clear refresh token for user', async () => {
    const userId = faker.string.uuid();

    await useCase.execute(userId);

    expect(userRepository.updateRefreshToken).toHaveBeenCalledWith(
      userId,
      null,
    );
  });
});
