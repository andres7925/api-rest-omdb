<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# API REST OMDB con Autenticación JWT

Este es un API REST construido con NestJS que permite a los usuarios registrarse y hacer login usando autenticación JWT.

## Características

- Registro de usuarios con email y password
- Login de usuarios con JWT
- Autenticación basada en tokens
- Base de datos PostgreSQL con migraciones
- Validación de datos con class-validator
- Encriptación de contraseñas con bcrypt

## Requisitos

- Node.js (versión 16 o superior)
- PostgreSQL
- npm o yarn

## Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/andres7925/api-rest-omdb
cd api-rest-omdb
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura la base de datos PostgreSQL:
   - Asegúrate de que PostgreSQL esté ejecutándose en el puerto 5432
   - El usuario por defecto es `postgres` con contraseña `123`
   - Ejecuta el script de configuración:
   ```powershell
   .\setup-database.ps1
   ```
   - O crea manualmente la base de datos `omdb_api`

4. Ejecuta las migraciones:
```bash
npm run migration:run
```

5. Ejecuta la aplicación:
```bash
npm run start:dev
```

La aplicación estará disponible en `http://localhost:3000`

## Migraciones

El proyecto usa migraciones de TypeORM para gestionar la base de datos de forma controlada.

### Comandos de Migración

```bash
# Generar nueva migración
npm run migration:generate -- src/migrations/NombreMigracion

# Ejecutar migraciones pendientes
npm run migration:run

# Revertir última migración
npm run migration:revert

# Ver estado de migraciones
npm run migration:show

# Sincronizar esquema (solo desarrollo)
npm run schema:sync

# Eliminar esquema (¡CUIDADO!)
npm run schema:drop
```

### Flujo de Trabajo

1. **Hacer cambios en entidades** (ej: agregar campo a User)
2. **Generar migración:**
   ```bash
   npm run migration:generate -- src/migrations/AddUserPhone
   ```
3. **Revisar la migración generada** en `src/migrations/`
4. **Ejecutar la migración:**
   ```bash
   npm run migration:run
   ```

Para más detalles, consulta [MIGRATIONS_GUIDE.md](MIGRATIONS_GUIDE.md)

## Endpoints

### Registro de usuario
```
POST /auth/register
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "password": "123456"
}
```

### Login de usuario
```
POST /auth/login
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "password": "123456"
}
```

### Obtener perfil (requiere autenticación)
```
GET /auth/profile
Authorization: Bearer <token_jwt>
```

## Respuestas

### Registro exitoso
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "usuario@ejemplo.com",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Login exitoso
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "usuario@ejemplo.com"
  }
}
```

## Estructura del proyecto

```
src/
├── auth/                 # Módulo de autenticación
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.module.ts
│   ├── guards/          # Guards de autenticación
│   └── strategies/      # Estrategias de Passport
├── users/               # Módulo de usuarios
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── users.module.ts
├── entities/            # Entidades de TypeORM
│   └── user.entity.ts
├── migrations/          # Migraciones de base de datos
│   └── 1704067200000-CreateUsersTable.ts
├── dto/                 # Data Transfer Objects
│   └── auth.dto.ts
├── app.module.ts
└── main.ts
```

## Scripts disponibles

- `npm run start:dev`: Ejecuta la aplicación en modo desarrollo
- `npm run build`: Compila la aplicación
- `npm run start`: Ejecuta la aplicación compilada
- `npm run test`: Ejecuta las pruebas unitarias
- `npm run test:e2e`: Ejecuta las pruebas end-to-end
- `npm run migration:run`: Ejecuta migraciones pendientes
- `npm run migration:generate`: Genera nueva migración
- `npm run migration:revert`: Revierte última migración

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
