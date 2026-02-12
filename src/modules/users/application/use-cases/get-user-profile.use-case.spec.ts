import { faker } from '@faker-js/faker';
import { GetUserProfileUseCase } from './get-user-profile.use-case';
import { UserRepositoryPort } from '../../domain/ports/user.repository.port';
import { UserNotFoundError } from '../../domain/exceptions/users.error';

describe('GetUserProfileUseCase', () => {
  let useCase: GetUserProfileUseCase;
  let userRepository: jest.Mocked<UserRepositoryPort>;

  beforeEach(() => {
    userRepository = {
      save: jest.fn(),
      updateRefreshToken: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
    };

    useCase = new GetUserProfileUseCase(userRepository);
  });

  it('should return user profile when found', async () => {
    const userId = faker.string.uuid();

    userRepository.findById.mockResolvedValue({
      id: userId,
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await useCase.execute(userId);

    expect(userRepository.findById).toHaveBeenCalledWith(userId);
    expect(result.id).toBe(userId);
  });

  it('should throw UserNotFoundError when user does not exist', async () => {
    const userId = faker.string.uuid();

    userRepository.findById.mockResolvedValue(null);

    await expect(useCase.execute(userId)).rejects.toThrow(UserNotFoundError);
  });
});