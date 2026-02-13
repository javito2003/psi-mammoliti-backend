import { DataSource } from 'typeorm';
import { faker } from '@faker-js/faker';
import { v4 as uuidv4 } from 'uuid';
import { Theme } from '../../../src/modules/themes/infrastructure/adapters/persistence/theme.schema';

export class ThemeFactory {
  constructor(private dataSource: DataSource) {}

  async create(overrides: Partial<Theme> = {}): Promise<Theme> {
    const repo = this.dataSource.getRepository(Theme);
    const theme = repo.create({
      id: uuidv4(),
      name: faker.lorem.word(),
      slug: faker.lorem.slug(),
      ...overrides,
    });
    return repo.save(theme);
  }
}
