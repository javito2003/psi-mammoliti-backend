import { faker } from '@faker-js/faker';
import { UserCreator } from './user-creator.service';
import { UserRepositoryPort } from '../ports/user.repository.port';
import { PasswordHasherPort } from '../ports/password-hasher.port';
import { UserAlreadyExistsError } from '../exceptions/user-already-exists.error';
import { UserEntity } from '../entities/user.entity';

describe('UserCreator', () => {
  let userCreator: UserCreator;
  let userRepository: jest.Mocked<UserRepositoryPort>;
  let passwordHasher: jest.Mocked<PasswordHasherPort>;

  beforeEach(() => {
    userRepository = {
      save: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
      updateRefreshToken: jest.fn(),
    };

    passwordHasher = {
      hash: jest.fn(),
      compare: jest.fn(),
    };

    userCreator = new UserCreator(userRepository, passwordHasher);
  });

  const input = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
  };

  it('should create a user when email does not exist', async () => {
    const hashedPassword = faker.internet.password();

    userRepository.findByEmail.mockResolvedValue(null);
    passwordHasher.hash.mockResolvedValue(hashedPassword);
    userRepository.save.mockImplementation(async (user) => user);

    const result = await userCreator.execute(
      input.firstName,
      input.lastName,
      input.email,
      input.password,
    );

    expect(userRepository.findByEmail).toHaveBeenCalledWith(input.email);
    expect(passwordHasher.hash).toHaveBeenCalledWith(input.password);
    expect(userRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        password: hashedPassword,
      }),
    );
    expect(result.id).toBeDefined();
    expect(result.createdAt).toBeInstanceOf(Date);
    expect(result.updatedAt).toBeInstanceOf(Date);
  });

  it('should throw UserAlreadyExistsError when email already exists', async () => {
    userRepository.findByEmail.mockResolvedValue({
      id: faker.string.uuid(),
      email: input.email,
    } as UserEntity);

    await expect(
      userCreator.execute(
        input.firstName,
        input.lastName,
        input.email,
        input.password,
      ),
    ).rejects.toThrow(UserAlreadyExistsError);

    expect(passwordHasher.hash).not.toHaveBeenCalled();
    expect(userRepository.save).not.toHaveBeenCalled();
  });

  it('should store the hashed password, not the plain one', async () => {
    const hashedPassword = faker.string.uuid();

    userRepository.findByEmail.mockResolvedValue(null);
    passwordHasher.hash.mockResolvedValue(hashedPassword);
    userRepository.save.mockImplementation(async (user) => user);

    const result = await userCreator.execute(
      input.firstName,
      input.lastName,
      input.email,
      input.password,
    );

    expect(result.password).toBe(hashedPassword);
    expect(result.password).not.toBe(input.password);
  });
});
