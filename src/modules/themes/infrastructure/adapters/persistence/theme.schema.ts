import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('themes')
export class Theme {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  slug: string;
}
