# Script para probar los endpoints de películas favoritas
# Asegúrate de tener el servidor ejecutándose en http://localhost:3000

Write-Host "=== Prueba de Endpoints de Películas Favoritas ===" -ForegroundColor Green

# URL base
$baseUrl = "http://localhost:3000"

# 1. Crear un usuario (si no existe)
Write-Host "`n1. Creando usuario de prueba..." -ForegroundColor Yellow
$registerBody = @{
    email = "test@example.com"
    password = "password123"
    firstName = "Usuario"
    lastName = "Prueba"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "$baseUrl/auth/register" -Method POST -Body $registerBody -ContentType "application/json"
    Write-Host "Usuario creado exitosamente" -ForegroundColor Green
} catch {
    Write-Host "Usuario ya existe o error en registro" -ForegroundColor Yellow
}

# 2. Login para obtener token JWT
Write-Host "`n2. Iniciando sesión..." -ForegroundColor Yellow
$loginBody = @{
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.access_token
    Write-Host "Login exitoso, token obtenido" -ForegroundColor Green
} catch {
    Write-Host "Error en login: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Headers para requests autenticados
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# 3. Buscar una película para agregar a favoritos
Write-Host "`n3. Buscando película para agregar a favoritos..." -ForegroundColor Yellow
try {
    $searchResponse = Invoke-RestMethod -Uri "$baseUrl/movies/search?title=batman" -Method GET
    $movie = $searchResponse.Search[0]
    Write-Host "Película encontrada: $($movie.Title) ($($movie.Year))" -ForegroundColor Green
} catch {
    Write-Host "Error buscando película: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 4. Agregar película a favoritos
Write-Host "`n4. Agregando película a favoritos..." -ForegroundColor Yellow
$favoriteBody = @{
    imdbId = $movie.imdbID
    title = $movie.Title
    year = $movie.Year
    poster = $movie.Poster
    type = $movie.Type
} | ConvertTo-Json

try {
    $addResponse = Invoke-RestMethod -Uri "$baseUrl/movies/favorites/add" -Method POST -Body $favoriteBody -Headers $headers
    Write-Host "Película agregada a favoritos exitosamente" -ForegroundColor Green
    Write-Host "ID: $($addResponse.id), Título: $($addResponse.title)" -ForegroundColor Cyan
} catch {
    Write-Host "Error agregando a favoritos: $($_.Exception.Message)" -ForegroundColor Red
}

# 5. Verificar si la película es favorita
Write-Host "`n5. Verificando si la película es favorita..." -ForegroundColor Yellow
try {
    $checkResponse = Invoke-RestMethod -Uri "$baseUrl/movies/favorites/check/$($movie.imdbID)" -Method GET -Headers $headers
    Write-Host "¿Es favorita? $($checkResponse.isFavorite)" -ForegroundColor Green
} catch {
    Write-Host "Error verificando favorito: $($_.Exception.Message)" -ForegroundColor Red
}

# 6. Listar películas favoritas
Write-Host "`n6. Listando películas favoritas..." -ForegroundColor Yellow
try {
    $favoritesResponse = Invoke-RestMethod -Uri "$baseUrl/movies/favorites/list" -Method GET -Headers $headers
    Write-Host "Películas favoritas encontradas: $($favoritesResponse.Count)" -ForegroundColor Green
    foreach ($fav in $favoritesResponse) {
        Write-Host "  - $($fav.title) ($($fav.year))" -ForegroundColor Cyan
    }
} catch {
    Write-Host "Error listando favoritos: $($_.Exception.Message)" -ForegroundColor Red
}

# 7. Eliminar película de favoritos
Write-Host "`n7. Eliminando película de favoritos..." -ForegroundColor Yellow
try {
    $deleteResponse = Invoke-RestMethod -Uri "$baseUrl/movies/favorites/remove/$($movie.imdbID)" -Method DELETE -Headers $headers
    Write-Host "Película eliminada de favoritos: $($deleteResponse.message)" -ForegroundColor Green
} catch {
    Write-Host "Error eliminando de favoritos: $($_.Exception.Message)" -ForegroundColor Red
}

# 8. Verificar que ya no es favorita
Write-Host "`n8. Verificando que ya no es favorita..." -ForegroundColor Yellow
try {
    $checkResponse = Invoke-RestMethod -Uri "$baseUrl/movies/favorites/check/$($movie.imdbID)" -Method GET -Headers $headers
    Write-Host "¿Es favorita? $($checkResponse.isFavorite)" -ForegroundColor Green
} catch {
    Write-Host "Error verificando favorito: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== Prueba completada ===" -ForegroundColor Green 