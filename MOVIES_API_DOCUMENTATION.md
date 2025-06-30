# API de Películas - Documentación

Esta API permite buscar películas usando la API de OMDb (Open Movie Database).

## Endpoints Disponibles

### 1. Buscar Películas por Título

**Endpoint:** `GET /movies/search`

**Parámetros de consulta:**
- `title` (requerido): Título de la película a buscar
- `year` (opcional): Año de lanzamiento
- `type` (opcional): Tipo de contenido ('movie', 'series', 'episode')

**Ejemplo de uso:**
```
GET /movies/search?title=batman&year=2008&type=movie
```

**Respuesta exitosa:**
```json
{
  "Search": [
    {
      "Title": "The Dark Knight",
      "Year": "2008",
      "imdbID": "tt0468569",
      "Type": "movie",
      "Poster": "https://m.media-amazon.com/images/M/..."
    }
  ],
  "totalResults": "1",
  "Response": "True"
}
```

### 2. Obtener Detalles de una Película

**Endpoint:** `GET /movies/:id`

**Parámetros:**
- `id` (requerido): ID de IMDb de la película

**Ejemplo de uso:**
```
GET /movies/tt0468569
```

**Respuesta exitosa:**
```json
{
  "Title": "The Dark Knight",
  "Year": "2008",
  "Rated": "PG-13",
  "Released": "18 Jul 2008",
  "Runtime": "152 min",
  "Genre": "Action, Crime, Drama",
  "Director": "Christopher Nolan",
  "Writer": "Jonathan Nolan, Christopher Nolan",
  "Actors": "Christian Bale, Heath Ledger, Aaron Eckhart",
  "Plot": "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham...",
  "Poster": "https://m.media-amazon.com/images/M/...",
  "Ratings": [
    {
      "Source": "Internet Movie Database",
      "Value": "9.0/10"
    }
  ],
  "imdbRating": "9.0",
  "imdbID": "tt0468569",
  "Type": "movie",
  "Response": "True"
}
```

## Ejemplos de Uso

### Buscar películas de Batman
```bash
curl "http://localhost:3000/movies/search?title=batman"
```

### Buscar películas de 2023
```bash
curl "http://localhost:3000/movies/search?title=2023&year=2023"
```

### Obtener detalles de una película específica
```bash
curl "http://localhost:3000/movies/tt0468569"
```
