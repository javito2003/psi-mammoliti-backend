import { faker } from '@faker-js/faker';
import { RefreshAccessTokenUseCase } from './refresh-access-token.use-case';
import { UserRepositoryPort } from '../../../users/domain/ports/user.repository.port';
import { PasswordHasherPort } from '../../../users/domain/ports/password-hasher.port';
import { TokenGeneratorPort } from '../../domain/ports/token-generator.port';
import { TokenGenerator } from '../../domain/services/token-generator.service';
import {
  AccessDeniedError,
  InvalidRefreshTokenError,
} from '../../domain/exceptions/auth.error';

describe('RefreshAccessTokenUseCase', () => {
  let useCase: RefreshAccessTokenUseCase;
  let userRepository: jest.Mocked<UserRepositoryPort>;
  let passwordHasher: jest.Mocked<PasswordHasherPort>;
  let tokenGeneratorPort: jest.Mocked<TokenGeneratorPort>;
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

    tokenGeneratorPort = {
      sign: jest.fn(),
      verify: jest.fn(),
    };

    tokenGenerator = {
      generate: jest.fn(),
    } as unknown as jest.Mocked<TokenGenerator>;

    useCase = new RefreshAccessTokenUseCase(
      userRepository,
      passwordHasher,
      tokenGeneratorPort,
      tokenGenerator,
    );
  });

  it('should issue new tokens when refresh token is valid', async () => {
    const userId = faker.string.uuid();
    const email = faker.internet.email();
    const refreshToken = faker.string.alphanumeric(50);

    tokenGeneratorPort.verify.mockResolvedValue({ sub: userId, email });
    userRepository.findById.mockResolvedValue({
      id: userId,
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email,
      password: faker.internet.password(),
      hashedRefreshToken: faker.string.alphanumeric(20),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    passwordHasher.compare.mockResolvedValue(true);
    tokenGenerator.generate.mockResolvedValue({
      accessToken: faker.string.alphanumeric(20),
      refreshToken: faker.string.alphanumeric(20),
    });

    const result = await useCase.execute(refreshToken);

    expect(tokenGeneratorPort.verify).toHaveBeenCalledWith(refreshToken);
    expect(passwordHasher.compare).toHaveBeenCalledWith(
      refreshToken,
      expect.any(String),
    );
    expect(tokenGenerator.generate).toHaveBeenCalledWith(userId, email);
    expect(result).toEqual({
      accessToken: expect.any(String),
      newRefreshToken: expect.any(String),
    });
  });

  it('should throw InvalidRefreshTokenError when token verification fails', async () => {
    tokenGeneratorPort.verify.mockRejectedValue(new Error('invalid token'));

    await expect(useCase.execute(faker.string.alphanumeric(50))).rejects.toThrow(
      InvalidRefreshTokenError,
    );

    expect(userRepository.findById).not.toHaveBeenCalled();
  });

  it('should throw AccessDeniedError when user has no stored refresh token', async () => {
    const userId = faker.string.uuid();
    const email = faker.internet.email();

    tokenGeneratorPort.verify.mockResolvedValue({ sub: userId, email });
    userRepository.findById.mockResolvedValue({
      id: userId,
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email,
      password: faker.internet.password(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await expect(useCase.execute(faker.string.alphanumeric(50))).rejects.toThrow(
      AccessDeniedError,
    );

    expect(passwordHasher.compare).not.toHaveBeenCalled();
  });

  it('should throw AccessDeniedError when token hash comparison fails', async () => {
    const userId = faker.string.uuid();
    const email = faker.internet.email();

    tokenGeneratorPort.verify.mockResolvedValue({ sub: userId, email });
    userRepository.findById.mockResolvedValue({
      id: userId,
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email,
      password: faker.internet.password(),
      hashedRefreshToken: faker.string.alphanumeric(20),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    passwordHasher.compare.mockResolvedValue(false);

    await expect(useCase.execute(faker.string.alphanumeric(50))).rejects.toThrow(
      AccessDeniedError,
    );

    expect(tokenGenerator.generate).not.toHaveBeenCalled();
  });
});