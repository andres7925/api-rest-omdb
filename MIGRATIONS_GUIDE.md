### Configuración de TypeORM
```typescript
// typeorm.config.ts
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '123',
  database: 'omdb_api',
  entities: [User],
  migrations: ['src/migrations/*.ts'],
  synchronize: false, // Importante: deshabilitado para usar migraciones
});
```

## Comandos Disponibles

### 1. Generar Migración
```bash
npm run migration:generate -- src/migrations/NombreDeLaMigracion
```
**Ejemplo:**
```bash
npm run migration:generate -- src/migrations/AddUserRole
```

### 2. Ejecutar Migraciones
```bash
npm run migration:run
```
Aplica todas las migraciones pendientes.

### 3. Revertir Última Migración
```bash
npm run migration:revert
```
Deshace la última migración aplicada.

### 4. Ver Estado de Migraciones
```bash
npm run migration:show
```
Muestra qué migraciones están aplicadas y cuáles pendientes.

### 5. Sincronizar Esquema (Solo desarrollo)
```bash
npm run schema:sync
```
Sincroniza el esquema sin usar migraciones (útil para desarrollo).

### 6. Eliminar Esquema (¡CUIDADO!)
```bash
npm run schema:drop
```
Elimina todas las tablas (¡solo usar en desarrollo!).

## Estructura de una Migración

```typescript
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateUsersTable1704067200000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Código para aplicar la migración
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          // ... más columnas
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Código para revertir la migración
    await queryRunner.dropTable('users');
  }
}
```

## Migración Inicial Incluida

El proyecto incluye la migración `1704067200000-CreateUsersTable.ts` que crea la tabla de usuarios con:

- `id` - Clave primaria autoincremental
- `email` - Email único del usuario
- `password` - Contraseña encriptada
- `createdAt` - Timestamp de creación
- `updatedAt` - Timestamp de última actualización

## Ejemplos de Migraciones Comunes

### Agregar Nueva Columna
```typescript
public async up(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.addColumn('users', {
    name: 'phone',
    type: 'varchar',
    isNullable: true,
  });
}

public async down(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.dropColumn('users', 'phone');
}
```

### Crear Nueva Tabla
```typescript
public async up(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.createTable(
    new Table({
      name: 'profiles',
      columns: [
        {
          name: 'id',
          type: 'int',
          isPrimary: true,
          isGenerated: true,
        },
        {
          name: 'userId',
          type: 'int',
        },
        {
          name: 'bio',
          type: 'text',
          isNullable: true,
        },
      ],
      foreignKeys: [
        {
          columnNames: ['userId'],
          referencedTableName: 'users',
          referencedColumnNames: ['id'],
        },
      ],
    }),
  );
}
```

### Agregar Índice
```typescript
public async up(queryRunner: QueryRunner): Promise<void> {
  await queryRunner.createIndex('users', {
    name: 'IDX_USERS_EMAIL',
    columnNames: ['email'],
  });
}
```

## Resolución de Problemas

### Error: "No migrations are pending"
- Verifica que hay migraciones en `src/migrations/`
- Asegúrate de que las migraciones no se han ejecutado ya

### Error: "Migration has already been executed"
- Usa `npm run migration:show` para ver el estado
- Si necesitas revertir, usa `npm run migration:revert`

### Error de Conexión a Base de Datos
- Verifica que PostgreSQL esté ejecutándose
- Confirma las credenciales en `typeorm.config.ts`
- Asegúrate de que la base de datos `omdb_api` existe

## Migración desde `synchronize: true`

Si ya tienes datos con `synchronize: true`:

1. **Hacer backup de la base de datos**
2. **Generar migración inicial:**
   ```bash
   npm run migration:generate -- src/migrations/InitialSchema
   ```
3. **Revisar y ajustar la migración generada**
4. **Deshabilitar `synchronize: false`**
5. **Ejecutar la migración:**
   ```bash
   npm run migration:run
   ```