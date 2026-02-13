import { DataSource } from 'typeorm';
import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../../../src/modules/users/infrastructure/adapters/persistence/user.schema';
import { USER_PASSWORD_MIN_LENGTH } from '../../../src/modules/users/domain/entities/user.entity';

export class UserFactory {
  constructor(private dataSource: DataSource) {}

  async create(overrides: Partial<User> = {}): Promise<User> {
    const repo = this.dataSource.getRepository(User);
    const user = repo.create({
      id: uuidv4(),
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email().toLowerCase(),
      password: faker.string.alphanumeric(USER_PASSWORD_MIN_LENGTH),
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides,
    });
    return repo.save(user);
  }
}
