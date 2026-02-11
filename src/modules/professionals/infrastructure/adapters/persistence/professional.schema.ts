import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { User } from '../../../../users/infrastructure/adapters/persistence/user.schema';
import { Theme } from '../../../../themes/infrastructure/adapters/persistence/theme.schema';

@Entity('professionals')
export class Professional {
  @PrimaryColumn()
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'text' })
  bio: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column()
  timezone: string;

  @ManyToMany(() => Theme)
  @JoinTable({
    name: 'professional_themes',
    joinColumn: { name: 'professional_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'theme_id', referencedColumnName: 'id' },
  })
  themes: Theme[];

  @Column({ type: 'timestamp' })
  createdAt: Date;

  @Column({ type: 'timestamp' })
  updatedAt: Date;
}
