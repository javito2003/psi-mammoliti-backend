export interface UserEntity {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  hashedRefreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type UserPublicEntity = Omit<
  UserEntity,
  'password' | 'hashedRefreshToken'
>;
