export const TOKEN_GENERATOR = 'TOKEN_GENERATOR';

export interface TokenGeneratorPort {
  sign(payload: Record<string, unknown>, expiresIn: number): string;
  verify<T extends object>(token: string): Promise<T>;
}
