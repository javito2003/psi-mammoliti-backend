import { UserEntity } from '../../../users/domain/entities/user.entity';
import { ThemeEntity } from '../../../themes/domain/entities/theme.entity';

export class ProfessionalEntity {
  id: string;
  userId: string;
  user?: UserEntity;
  bio: string;
  price: number;
  timezone: string;
  themes: ThemeEntity[];
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<ProfessionalEntity>) {
    Object.assign(this, partial);
  }
}
