import { v4 as uuidv4 } from 'uuid';
import { UserEntity } from '../entities/user.entity';
import { type PasswordHasherPort } from '../ports/password-hasher.port';
import { type UserRepositoryPort } from '../ports/user.repository.port';
import { UserAlreadyExistsError } from '../exceptions/user-already-exists.error';

export class UserCreator {
  constructor(
    private readonly userRepository: UserRepositoryPort,
    private readonly passwordHasher: PasswordHasherPort,
  ) {}

  async execute(
    firstName: string,
    lastName: string,
    email: string,
    plainPassword: string,
  ): Promise<UserEntity> {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new UserAlreadyExistsError();
    }

    const hashedPassword = await this.passwordHasher.hash(plainPassword);

    const newUser = new UserEntity({
      id: uuidv4(),
      firstName,
      lastName,
      email,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return this.userRepository.save(newUser);
  }
}
