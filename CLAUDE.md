# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn start:dev          # Start dev server (watch mode)
yarn build              # Build
yarn lint               # ESLint with auto-fix
yarn format             # Prettier

yarn test               # Unit tests
yarn test:watch         # Tests in watch mode
yarn test -- --testPathPattern=<pattern>  # Run a single test file

yarn seed               # Seed the database
yarn migration:generate src/modules/shared/infrastructure/database/migrations/<Name>  # Generate migration
yarn migration:run      # Run pending migrations
yarn migration:revert   # Revert last migration
```

Docker (MySQL + phpMyAdmin): `docker compose up -d`

## Architecture

NestJS backend using **hexagonal architecture** (ports & adapters). Each feature module under `src/modules/` follows this layout:

```
module-name/
├── domain/
│   ├── entities/        # Domain entities (TypeScript interfaces)
│   ├── ports/           # Repository/service interfaces with DI token constants
│   ├── exceptions/      # Domain errors extending DomainError
│   └── services/        # Pure domain services (no NestJS decorators)
├── application/
│   ├── use-cases/       # Injectable orchestrators with single execute() method
│   └── dtos/            # Input/validation DTOs (class-validator)
└── infrastructure/
    ├── adapters/
    │   ├── persistence/ # TypeORM schemas, mappers, ORM repository implementations
    │   └── http/        # Controllers, response DTOs, error maps
    ├── guards/          # Auth guards
    ├── strategies/      # Passport strategies
    └── {module}.module.ts
```

### Key Conventions

**Domain layer is framework-free.** Domain services are plain classes wired via `useFactory` in the module:
```typescript
{
  provide: UserCreator,
  useFactory: (repo, hasher) => new UserCreator(repo, hasher),
  inject: [USER_REPOSITORY, PASSWORD_HASHER],
}
```

**Ports** define an interface and a string token for DI:
```typescript
export const USER_REPOSITORY = 'USER_REPOSITORY';
export interface UserRepositoryPort { ... }
```

**Adapters** bind port tokens to implementations in the module's `providers`:
```typescript
{ provide: USER_REPOSITORY, useClass: OrmUserRepository }
```

**Mappers** (`toPersistence` / `toDomain` or `toEntity`) convert between domain entities and TypeORM schemas. Located alongside the schema in `adapters/persistence/`.

**Domain errors** extend `DomainError` (in `shared/domain/base.exception.ts`) with an abstract `code` string. Each module has an error map (`infrastructure/adapters/http/{module}.error-map.ts`) that maps error codes to NestJS `HttpException` factories. All maps are composed into `domainHttpErrorMap` in `shared/infrastructure/adapter/http/domain.error-map.ts` and handled by the global `DomainExceptionFilter`. Use cases throw domain errors, not HTTP exceptions.

**Auth** uses JWT in HTTP-only cookies (`accessToken` + `refreshToken`). The `JwtAuthGuard` and `@UserId()` param decorator are used on protected endpoints.

**Response DTOs** use `@Exclude()`/`@Expose()` from class-transformer with `ClassSerializerInterceptor`.

## Database

MySQL via TypeORM. Synchronize is off — use migrations. Schemas are `*.schema.ts` files in `adapters/persistence/`. Entities auto-load via `autoLoadEntities: true`.
