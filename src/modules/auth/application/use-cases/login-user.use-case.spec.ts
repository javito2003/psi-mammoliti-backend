import { faker } from '@faker-js/faker';
import { LoginUserUseCase } from './login-user.use-case';
import { UserRepositoryPort } from '../../../users/domain/ports/user.repository.port';
import { PasswordHasherPort } from '../../../users/domain/ports/password-hasher.port';
import { TokenGenerator } from '../../domain/services/token-generator.service';
import { InvalidCredentialsError } from '../../domain/exceptions/auth.error';

describe('LoginUserUseCase', () => {
  let useCase: LoginUserUseCase;
  let userRepository: jest.Mocked<UserRepositoryPort>;
  let passwordHasher: jest.Mocked<PasswordHasherPort>;
  let tokenGenerator: jest.Mocked<TokenGenerator>;

  beforeEach(() => {
    userRepository = {
      save: jest.fn(),
      updateRefreshToken: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
    };

    passwordHasher = {
      hash: jest.fn(),
      compare: jest.fn(),
    };

    tokenGenerator = {
      generate: jest.fn(),
    } as unknown as jest.Mocked<TokenGenerator>;

    useCase = new LoginUserUseCase(
      userRepository,
      passwordHasher,
      tokenGenerator,
    );
  });

  it('should return tokens when credentials are valid', async () => {
    const email = faker.internet.email();
    const password = faker.internet.password();
    const userId = faker.string.uuid();
    const storedPassword = faker.internet.password();

    userRepository.findByEmail.mockResolvedValue({
      id: userId,
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email,
      password: storedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    passwordHasher.compare.mockResolvedValue(true);
    tokenGenerator.generate.mockResolvedValue({
      accessToken: faker.string.alphanumeric(20),
      refreshToken: faker.string.alphanumeric(20),
    });

    const result = await useCase.execute({ email, password });

    expect(userRepository.findByEmail).toHaveBeenCalledWith(email);
    expect(passwordHasher.compare).toHaveBeenCalledWith(
      password,
      storedPassword,
    );
    expect(tokenGenerator.generate).toHaveBeenCalledWith(userId, email);
    expect(result).toEqual({
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
    });
  });

  it('should throw InvalidCredentialsError when user does not exist', async () => {
    userRepository.findByEmail.mockResolvedValue(null);

    await expect(
      useCase.execute({
        email: faker.internet.email(),
        password: faker.internet.password(),
      }),
    ).rejects.toThrow(InvalidCredentialsError);

    expect(passwordHasher.compare).not.toHaveBeenCalled();
    expect(tokenGenerator.generate).not.toHaveBeenCalled();
  });

  it('should throw InvalidCredentialsError when password does not match', async () => {
    const email = faker.internet.email();

    userRepository.findByEmail.mockResolvedValue({
      id: faker.string.uuid(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email,
      password: faker.internet.password(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    passwordHasher.compare.mockResolvedValue(false);

    await expect(
      useCase.execute({ email, password: faker.internet.password() }),
    ).rejects.toThrow(InvalidCredentialsError);

    expect(tokenGenerator.generate).not.toHaveBeenCalled();
  });
});
