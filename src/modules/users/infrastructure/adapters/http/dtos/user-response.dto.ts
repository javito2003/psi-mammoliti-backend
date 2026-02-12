import { Exclude, Expose } from 'class-transformer';
import type { UserEntity } from '../../../../domain/entities/user.entity';

@Exclude()
export class UserResponseDto {
  @Expose()
  id: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  email: string;

  @Expose()
  createdAt: Date;

  constructor(user: UserEntity) {
    Object.assign(this, user);
  }
}
