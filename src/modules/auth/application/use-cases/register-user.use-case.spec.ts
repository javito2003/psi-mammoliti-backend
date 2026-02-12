import { faker } from '@faker-js/faker';
import { RegisterUserUseCase } from './register-user.use-case';
import { UserCreator } from '../../../users/domain/services/user-creator.service';

describe('RegisterUserUseCase', () => {
  let useCase: RegisterUserUseCase;
  let userCreator: jest.Mocked<UserCreator>;

  beforeEach(() => {
    userCreator = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<UserCreator>;

    useCase = new RegisterUserUseCase(userCreator);
  });

  it('should delegate user creation to UserCreator', async () => {
    const dto = {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };

    userCreator.execute.mockResolvedValue({
      id: faker.string.uuid(),
      ...dto,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await useCase.execute(dto);

    expect(userCreator.execute).toHaveBeenCalledWith(
      dto.firstName,
      dto.lastName,
      dto.email,
      dto.password,
    );
    expect(result.email).toBe(dto.email);
  });
});