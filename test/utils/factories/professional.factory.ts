import { DataSource } from 'typeorm';
import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';
import { Professional } from '../../../src/modules/professionals/infrastructure/adapters/persistence/professional.schema';
import { UserFactory } from './user.factory';

export class ProfessionalFactory {
  private userFactory: UserFactory;

  constructor(private dataSource: DataSource) {
    this.userFactory = new UserFactory(dataSource);
  }

  async create(overrides: Partial<Professional> = {}): Promise<Professional> {
    const user = overrides.user || (await this.userFactory.create());
    const repo = this.dataSource.getRepository(Professional);

    const professional = repo.create({
      id: uuidv4(),
      userId: user.id,
      user: user,
      bio: faker.lorem.sentence(),
      price: faker.number.int({ min: 10, max: 100 }),
      timezone: 'UTC',
      themes: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides,
    });
    return repo.save(professional);
  }
}
