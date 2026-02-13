import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createTestApp, cleanupDatabase } from '../utils/e2e-setup';
import { DataSource } from 'typeorm';
import { ProfessionalFactory } from '../utils/factories/professional.factory';
import { ThemeFactory } from '../utils/factories/theme.factory';

describe('Professionals - Get All (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let professionalFactory: ProfessionalFactory;
  let themeFactory: ThemeFactory;

  beforeAll(async () => {
    const context = await createTestApp();
    app = context.app;
    dataSource = app.get(DataSource);
    professionalFactory = new ProfessionalFactory(dataSource);
    themeFactory = new ThemeFactory(dataSource);
  });

  afterEach(async () => {
    await cleanupDatabase(app);
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return paginated professionals', async () => {
    await professionalFactory.create();
    await professionalFactory.create();

    const response = await request(app.getHttpServer())
      .get('/professionals')
      .query({ page: 1, limit: 10 })
      .expect(200);

    expect(response.body.data).toHaveLength(2);
    expect(response.body.meta.total).toBe(2);
    expect(response.body.meta.page).toBe(1);
    expect(response.body.meta.limit).toBe(10);
  });

  it('should filter by theme', async () => {
    const theme1 = await themeFactory.create({
      name: 'Anxiety',
      slug: 'anxiety',
    });
    const theme2 = await themeFactory.create({
      name: 'Depression',
      slug: 'depression',
    });

    await professionalFactory.create({ themes: [theme1] });
    await professionalFactory.create({ themes: [theme2] });
    await professionalFactory.create(); // No theme

    const response = await request(app.getHttpServer())
      .get('/professionals')
      .query({ theme: 'anxiety' })
      .expect(200);

    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].themes[0].name).toBe('Anxiety');
    expect(response.body.meta.total).toBe(1);
  });
});