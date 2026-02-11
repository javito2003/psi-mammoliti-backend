export class UserEntity {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  hashedRefreshToken?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
