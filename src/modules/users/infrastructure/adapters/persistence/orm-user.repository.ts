import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../../domain/entities/user.entity';
import { UserRepositoryPort } from '../../../domain/ports/user.repository.port';
import { User } from './user.schema';

@Injectable()
export class OrmUserRepository implements UserRepositoryPort {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async save(user: UserEntity): Promise<UserEntity> {
    const savedUser = await this.userRepository.save(this.toPersistence(user));
    return this.toDomain(savedUser);
  }

  async updateRefreshToken(id: string, hashedRefreshToken: string | null): Promise<void> {
    await this.userRepository.update(id, { hashedRefreshToken });
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) return null;
    return this.toDomain(user);
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) return null;
    return this.toDomain(user);
  }

  private toDomain(user: User): UserEntity {
    return new UserEntity({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
      hashedRefreshToken: user.hashedRefreshToken || undefined,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }

  private toPersistence(user: UserEntity): User {
    const userEntity = new User();
    userEntity.id = user.id;
    userEntity.firstName = user.firstName;
    userEntity.lastName = user.lastName;
    userEntity.email = user.email;
    userEntity.password = user.password;
    userEntity.hashedRefreshToken = user.hashedRefreshToken || null;
    userEntity.createdAt = user.createdAt;
    userEntity.updatedAt = user.updatedAt;
    return userEntity;
  }
}
