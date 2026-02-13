import { ProfessionalEntity } from 'src/modules/professionals/domain/entities/professional.entity';
import { Professional } from './professional.schema';
import { ProfessionalAvailability } from './professional-availability.schema';
import { Theme } from 'src/modules/themes/infrastructure/adapters/persistence/theme.schema';

export class ProfessionalMapper {
  static toDomain(schema: Professional): ProfessionalEntity {
    return {
      id: schema.id,
      userId: schema.userId,
      user: schema.user
        ? {
            id: schema.user.id,
            firstName: schema.user.firstName,
            lastName: schema.user.lastName,
            email: schema.user.email,
            createdAt: schema.user.createdAt,
            updatedAt: schema.user.updatedAt,
          }
        : undefined,
      bio: schema.bio,
      price: Number(schema.price),
      timezone: schema.timezone,
      themes: schema.themes?.map((t) => ({
        id: t.id,
        name: t.name,
        slug: t.slug,
      })),
      availability: schema.availability?.map((a) => ({
        id: a.id,
        professionalId: a.professionalId,
        dayOfWeek: a.dayOfWeek,
        block: a.block,
        createdAt: a.createdAt,
        updatedAt: a.updatedAt,
      })),
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
    };
  }

  static toPersistence(domain: ProfessionalEntity): Professional {
    const schema = new Professional();
    schema.id = domain.id;
    schema.userId = domain.userId;
    schema.bio = domain.bio;
    schema.price = domain.price;
    schema.timezone = domain.timezone;
    schema.themes = domain.themes?.map((t) => {
      const theme = new Theme();
      theme.id = t.id;
      return theme;
    });
    schema.availability = domain.availability?.map((a) => {
      const av = new ProfessionalAvailability();
      av.id = a.id;
      av.professionalId = domain.id; // Ensure link
      av.dayOfWeek = a.dayOfWeek;
      av.block = a.block;
      av.createdAt = a.createdAt;
      av.updatedAt = a.updatedAt;
      return av;
    });
    schema.createdAt = domain.createdAt;
    schema.updatedAt = domain.updatedAt;
    return schema;
  }
}
