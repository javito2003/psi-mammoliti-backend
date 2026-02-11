export class ThemeEntity {
  id: string;
  name: string;
  slug: string;

  constructor(partial: Partial<ThemeEntity>) {
    Object.assign(this, partial);
  }
}
