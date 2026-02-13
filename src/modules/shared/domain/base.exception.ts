export abstract class DomainError extends Error {
  abstract readonly code: string;

  protected constructor(
    message: string,
    public readonly meta?: Record<string, unknown>,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}
