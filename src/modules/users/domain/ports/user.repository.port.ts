import { UserEntity } from '../entities/user.entity';

export const USER_REPOSITORY = 'USER_REPOSITORY';

export interface UserRepositoryPort {
  save(user: UserEntity): Promise<UserEntity>;
  updateRefreshToken(
    id: string,
    hashedRefreshToken: string | null,
  ): Promise<void>;
  findByEmail(email: string): Promise<UserEntity | null>;
  findById(id: string): Promise<UserEntity | null>;
}
