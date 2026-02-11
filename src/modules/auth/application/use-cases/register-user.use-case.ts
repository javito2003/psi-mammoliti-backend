import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../../users/domain/entities/user.entity';
import { UserCreator } from '../../../users/domain/services/user-creator.service';
import { RegisterUserDto } from '../dtos/register-user.dto';

@Injectable()
export class RegisterUserUseCase {
  constructor(private readonly userCreator: UserCreator) {}

  async execute(dto: RegisterUserDto): Promise<UserEntity> {
    return this.userCreator.execute(
      dto.firstName,
      dto.lastName,
      dto.email,
      dto.password,
    );
  }
}
