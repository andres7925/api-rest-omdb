# API de Películas Favoritas - Documentación

Esta funcionalidad permite a los usuarios autenticados guardar y gestionar sus películas favoritas.

## Autenticación

Todos los endpoints de favoritos requieren autenticación JWT. Incluye el token en el header:

```
Authorization: Bearer tu_jwt_token_aqui
```

## Endpoints Disponibles

### 1. Listar Películas Favoritas

**Endpoint:** `GET /movies/favorites/list`

**Headers requeridos:**
- `Authorization: Bearer <jwt_token>`

**Respuesta exitosa:**
```json
[
  {
    "id": 1,
    "userId": 1,
    "imdbId": "tt0372784",
    "title": "Batman Begins",
    "year": "2005",
    "poster": "https://m.media-amazon.com/images/M/...",
    "type": "movie",
    "createdAt": "2024-01-01T12:00:00.000Z"
  }
]
```

### 2. Agregar Película a Favoritos

**Endpoint:** `POST /movies/favorites/add`

**Headers requeridos:**
- `Authorization: Bearer <jwt_token>`
- `Content-Type: application/json`

**Body:**
```json
{
  "imdbId": "tt0372784",
  "title": "Batman Begins",
  "year": "2005",
  "poster": "https://m.media-amazon.com/images/M/...",
  "type": "movie"
}
```

**Respuesta exitosa:**
```json
{
  "id": 1,
  "userId": 1,
  "imdbId": "tt0372784",
  "title": "Batman Begins",
  "year": "2005",
  "poster": "https://m.media-amazon.com/images/M/...",
  "type": "movie",
  "createdAt": "2024-01-01T12:00:00.000Z"
}
```

### 3. Eliminar Película de Favoritos

**Endpoint:** `DELETE /movies/favorites/remove/:imdbId`

**Headers requeridos:**
- `Authorization: Bearer <jwt_token>`

**Ejemplo:**
```
DELETE /movies/favorites/remove/tt0372784
```

**Respuesta exitosa:**
```json
{
  "message": "Película eliminada de favoritos exitosamente"
}
```

### 4. Verificar si una Película es Favorita

**Endpoint:** `GET /movies/favorites/check/:imdbId`

**Headers requeridos:**
- `Authorization: Bearer <jwt_token>`

**Ejemplo:**
```
GET /movies/favorites/check/tt0372784
```

**Respuesta exitosa:**
```json
{
  "isFavorite": true
}
```

## Códigos de Error

- `401 Unauthorized`: Token JWT inválido o faltante
- `409 Conflict`: La película ya está en favoritos
- `404 Not Found`: Película no encontrada en favoritos
- `500 Internal Server Error`: Error interno del servidor

## Ejemplos de Uso

### Obtener token JWT (login)
```bash
curl -X POST "http://localhost:3000/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "usuario@ejemplo.com", "password": "password123"}'
```

### Agregar película a favoritos
```bash
curl -X POST "http://localhost:3000/movies/favorites/add" \
  -H "Authorization: Bearer tu_jwt_token_aqui" \
  -H "Content-Type: application/json" \
  -d '{
    "imdbId": "tt0372784",
    "title": "Batman Begins",
    "year": "2005",
    "poster": "https://m.media-amazon.com/images/M/...",
    "type": "movie"
  }'
```

### Listar favoritos
```bash
curl -X GET "http://localhost:3000/movies/favorites/list" \
  -H "Authorization: Bearer tu_jwt_token_aqui"
```

### Verificar si es favorita
```bash
curl -X GET "http://localhost:3000/movies/favorites/check/tt0372784" \
  -H "Authorization: Bearer tu_jwt_token_aqui"
```

### Eliminar de favoritos
```bash
curl -X DELETE "http://localhost:3000/movies/favorites/remove/tt0372784" \
  -H "Authorization: Bearer tu_jwt_token_aqui"
```


## Notas Importantes

- Un usuario no puede tener la misma película como favorita dos veces
- Al eliminar un usuario, todas sus películas favoritas se eliminan automáticamente 
- Los favoritos se ordenan por fecha de creación (más recientes primero)
- La validación de datos se realiza tanto en el frontend como en el backend 