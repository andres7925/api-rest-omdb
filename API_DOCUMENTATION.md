# Documentación de la API REST OMDB

## Base URL
```
http://localhost:3000
```

## Autenticación

La API utiliza autenticación JWT (JSON Web Tokens). Para endpoints protegidos, incluye el token en el header de autorización:

```
Authorization: Bearer <tu_token_jwt>
```

## Endpoints

### 1. Registro de Usuario

**POST** `/auth/register`

Registra un nuevo usuario en el sistema.

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "123456"
}
```

**Respuesta exitosa (200):**
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

**Errores posibles:**
- `400 Bad Request`: Datos de entrada inválidos
- `409 Conflict`: El email ya está registrado

### 2. Login de Usuario

**POST** `/auth/login`

Autentica un usuario existente y devuelve un token JWT.

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "123456"
}
```

**Respuesta exitosa (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "usuario@ejemplo.com"
  }
}
```

**Errores posibles:**
- `400 Bad Request`: Datos de entrada inválidos
- `401 Unauthorized`: Credenciales incorrectas

### 3. Obtener Perfil de Usuario

**GET** `/auth/profile`

Obtiene la información del usuario autenticado.

**Headers:**
```
Authorization: Bearer <tu_token_jwt>
```

**Respuesta exitosa (200):**
```json
{
  "userId": 1,
  "email": "usuario@ejemplo.com"
}
```

**Errores posibles:**
- `401 Unauthorized`: Token inválido o expirado

## Códigos de Estado HTTP

- `200 OK`: Operación exitosa
- `201 Created`: Recurso creado exitosamente
- `400 Bad Request`: Datos de entrada inválidos
- `401 Unauthorized`: No autenticado o token inválido
- `403 Forbidden`: No autorizado para acceder al recurso
- `404 Not Found`: Recurso no encontrado
- `409 Conflict`: Conflicto (ej: email ya registrado)
- `500 Internal Server Error`: Error interno del servidor

## Validaciones

### Email
- Debe ser un email válido
- Debe ser único en el sistema

### Password
- Mínimo 6 caracteres
- Se encripta automáticamente con bcrypt

## Ejemplos de Uso

### Registro de usuario con cURL
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nuevo@usuario.com",
    "password": "123456"
  }'
```

### Login con cURL
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "nuevo@usuario.com",
    "password": "123456"
  }'
```

### Obtener perfil con cURL
```bash
curl -X GET http://localhost:3000/auth/profile \
  -H "Authorization: Bearer <tu_token_jwt>"
```

## Notas de Seguridad

1. **Tokens JWT**: Los tokens expiran después de 1 hora
2. **Contraseñas**: Se encriptan con bcrypt antes de almacenarse
3. **Validación**: Todos los datos de entrada se validan automáticamente
4. **CORS**: Habilitado para desarrollo (configurar apropiadamente en producción)

## Configuración de Desarrollo

Para ejecutar la API en modo desarrollo:

```bash
npm run start:dev
```

La API estará disponible en `http://localhost:3000` y se reiniciará automáticamente cuando detecte cambios en el código. 