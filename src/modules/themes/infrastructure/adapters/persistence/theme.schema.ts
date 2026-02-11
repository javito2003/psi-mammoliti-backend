import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('themes')
export class Theme {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;
}
