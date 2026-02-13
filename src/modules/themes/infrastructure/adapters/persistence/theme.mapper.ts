import { ThemeEntity } from 'src/modules/themes/domain/entities/theme.entity';
import { Theme } from './theme.schema';

export class ThemeMapper {
  static toEntity(schema: Theme): ThemeEntity {
    return {
      id: schema.id,
      name: schema.name,
      slug: schema.slug,
    };
  }

  static toPersistence(entity: ThemeEntity): Theme {
    const schema = new Theme();
    schema.id = entity.id;
    schema.name = entity.name;
    schema.slug = entity.slug;
    return schema;
  }
}
