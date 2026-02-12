import { UserPublicEntity } from '../../../users/domain/entities/user.entity';
import { ThemeEntity } from '../../../themes/domain/entities/theme.entity';
import { ProfessionalAvailabilityEntity } from './professional-availability.entity';

export interface ProfessionalEntity {
  id: string;
  userId: string;
  user?: UserPublicEntity;
  bio: string;
  price: number;
  timezone: string;
  themes: ThemeEntity[];
  availability: ProfessionalAvailabilityEntity[];
  createdAt: Date;
  updatedAt: Date;
}
