import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../../domain/entities/user.entity';
import { UserRepositoryPort } from '../../../domain/ports/user.repository.port';
import { User } from './user.schema';
import { UserMapper } from './user.mapper';

@Injectable()
export class OrmUserRepository implements UserRepositoryPort {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async save(user: UserEntity): Promise<UserEntity> {
    const savedUser = await this.userRepository.save(
      UserMapper.toPersistence(user),
    );
    return UserMapper.toEntity(savedUser);
  }

  async updateRefreshToken(
    id: string,
    hashedRefreshToken: string | null,
  ): Promise<void> {
    await this.userRepository.update(id, { hashedRefreshToken });
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) return null;
    return UserMapper.toEntity(user);
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) return null;
    return UserMapper.toEntity(user);
  }
}
