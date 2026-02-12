export const USER_PASSWORD_MIN_LENGTH = 6;
export const USER_PASSWORD_MAX_LENGTH = 16;

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
