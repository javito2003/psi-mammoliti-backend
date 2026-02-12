import { HttpException } from '@nestjs/common';

export type DomainErrorMap = Record<string, (e: Error) => HttpException>;
