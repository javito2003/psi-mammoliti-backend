# PSI Mammoliti - Backend

API REST para una plataforma de agendamiento de turnos con profesionales de salud mental. Construida con NestJS siguiendo arquitectura hexagonal.

## Instrucciones para correr el proyecto

### Requisitos previos

- Node.js 24+
- Yarn
- Docker y Docker Compose

### 1. Levantar la base de datos

```bash
docker compose up -d mysql phpmyadmin
```

Esto inicia MySQL en el puerto `3306` y phpMyAdmin en `http://localhost:8080`.

### 2. Configurar variables de entorno

```bash
cp .env.example .env
```

### 3. Instalar dependencias y correr

```bash
yarn install
yarn migration:run
yarn seed
yarn start:dev
```

La API queda disponible en `http://localhost:3001`.

### 4. Correr con Docker (stack completo)

```bash
docker compose up -d
```

Esto levanta MySQL, phpMyAdmin y el backend en un solo comando.

### Tests

```bash
# Unit tests
yarn test

# E2E tests (requiere MySQL corriendo)
cp .env.test.example .env.test
yarn test:e2e
```

## Decisiones tecnicas principales
* Utilice tecnologias como
    * MySQL
    * NestJS
    * TypeORM
    * Typescript
* Arquitectura hexagonal
* Validaciones de request (body, query, param)
```
modules/
└── [module]/
    ├── application/
    │   └── use-cases/
    ├── domain/
    │   ├── entities/
    │   ├── exceptions/
    │   ├── ports/
    │   └── services/
    └── infrastructure/
        └── adapters/
            ├── http/
            │   ├── controllers/
            │   └── dtos/
            └── persistence/
                └── repository.ts

```
* Test
    * Unit test
    * E2E test

### Que construi y que Asumi
Construi un backend encargado de Mostrar profesionales, permitiendo filtrarlos y realizar una sesion. Ademas, se pueden listar las sesiones por usuario

Asumi:
* Solamente se puede crear y autenticarse como usuario.
* Los turnos duran 1 hora
* El profesional se le crea con un turno (Mañana, Tarde y Noche).
* Los rango de los turnos estan predefinidos
    * Mañana: 8 - 12
    * Tarde: 13 - 17
    * Noche: 18 - 22
* Las sesiones no se pueden cancelar ni modificar
* Los datos como: Profesionales, Tematicas son autogeneradas
