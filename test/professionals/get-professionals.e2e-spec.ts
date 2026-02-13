import request from 'supertest';
import { cleanupDatabase, getTestApp } from '../utils/e2e-setup';
import { DataSource } from 'typeorm';
import { ProfessionalFactory } from '../utils/factories/professional.factory';
import { ThemeFactory } from '../utils/factories/theme.factory';
import { ProfessionalResponseDto } from '../../src/modules/professionals/infrastructure/adapters/http/dtos/professional-response.dto';

describe('Professionals - Get All (e2e)', () => {
  let dataSource: DataSource;
  let professionalFactory: ProfessionalFactory;
  let themeFactory: ThemeFactory;

  beforeAll(() => {
    dataSource = getTestApp().get(DataSource);
    professionalFactory = new ProfessionalFactory(dataSource);
    themeFactory = new ThemeFactory(dataSource);
  });

  afterEach(async () => {
    await cleanupDatabase();
  });

  it('should respect pagination limit', async () => {
    const promises = Array(15)
      .fill(null)
      .map(() => professionalFactory.create());
    const professionalsCreated = await Promise.all(promises);

    const response = await request(getTestApp().getHttpServer())
      .get('/professionals')
      .query({ page: 1, limit: 10 })
      .expect(200);

    expect(response.body.data).toHaveLength(10);
    expect(response.body.meta.total).toBe(15);
    expect(response.body.meta.totalPages).toBe(2);
    expect(response.body.meta.page).toBe(1);
    expect(response.body.meta.limit).toBe(10);

    response.body.data.forEach((prof: ProfessionalResponseDto) => {
      const found = professionalsCreated.find((p) => p.id === prof.id);

      expect(found).toBeTruthy();
      expect(prof).toEqual<ProfessionalResponseDto>({
        id: found!.id,
        firstName: found!.user.firstName,
        lastName: found!.user.lastName,
        bio: found!.bio,
        price: found!.price,
        timezone: found!.timezone,
        themes: prof.themes.map((t) => ({
          id: t.id,
          name: t.name,
        })),
      });
    });
  });

  it('should return correct page (offset)', async () => {
    await professionalFactory.create();
    await professionalFactory.create();
    await professionalFactory.create();

    const responsePage1 = await request(getTestApp().getHttpServer())
      .get('/professionals')
      .query({ page: 1, limit: 2 })
      .expect(200);

    const responsePage2 = await request(getTestApp().getHttpServer())
      .get('/professionals')
      .query({ page: 2, limit: 2 })
      .expect(200);

    expect(responsePage1.body.data).toHaveLength(2);
    expect(responsePage2.body.data).toHaveLength(1);

    const idsPage1 = responsePage1.body.data.map((p: { id: string }) => p.id);
    const idsPage2 = responsePage2.body.data.map((p: { id: string }) => p.id);

    expect(idsPage1).not.toContain(idsPage2[0]);
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
    await professionalFactory.create();

    const response = await request(getTestApp().getHttpServer())
      .get('/professionals')
      .query({ theme: 'anxiety' })
      .expect(200);

    expect(response.body.data).toHaveLength(1);
    expect(response.body.data[0].themes[0].name).toBe('Anxiety');
    expect(response.body.meta.total).toBe(1);
  });
});
