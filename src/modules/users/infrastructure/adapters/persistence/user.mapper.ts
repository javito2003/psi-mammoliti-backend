import { UserEntity } from 'src/modules/users/domain/entities/user.entity';
import { User } from './user.schema';

export class UserMapper {
  static toEntity(dto: User): UserEntity {
    return {
      id: dto.id,
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      password: dto.password,
      hashedRefreshToken: dto.hashedRefreshToken || undefined,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
    };
  }

  static toPersistence(entity: UserEntity): User {
    const user = new User();
    user.id = entity.id;
    user.firstName = entity.firstName;
    user.lastName = entity.lastName;
    user.email = entity.email;
    user.password = entity.password;
    user.hashedRefreshToken = entity.hashedRefreshToken || null;
    user.createdAt = entity.createdAt;
    user.updatedAt = entity.updatedAt;
    return user;
  }
}
