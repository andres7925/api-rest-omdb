# Script para configurar la base de datos PostgreSQL
# Ejecutar como administrador en PowerShell

Write-Host "Configurando base de datos PostgreSQL..." -ForegroundColor Green

# Verificar si PostgreSQL está instalado
try {
    $pgVersion = psql --version
    Write-Host "PostgreSQL encontrado: $pgVersion" -ForegroundColor Green
} catch {
    Write-Host "Error: PostgreSQL no está instalado o no está en el PATH" -ForegroundColor Red
    Write-Host "Por favor, instala PostgreSQL desde: https://www.postgresql.org/download/" -ForegroundColor Yellow
    exit 1
}

# Crear la base de datos
Write-Host "Creando base de datos 'omdb_api'..." -ForegroundColor Yellow
try {
    psql -U postgres -c "CREATE DATABASE omdb_api;"
    Write-Host "Base de datos 'omdb_api' creada exitosamente" -ForegroundColor Green
} catch {
    Write-Host "Error al crear la base de datos. Verifica que:" -ForegroundColor Red
    Write-Host "1. PostgreSQL esté ejecutándose" -ForegroundColor Yellow
    Write-Host "2. El usuario 'postgres' tenga permisos" -ForegroundColor Yellow
    Write-Host "3. La contraseña sea '123'" -ForegroundColor Yellow
    exit 1
}

Write-Host "Configuración completada!" -ForegroundColor Green
Write-Host "Ahora puedes ejecutar: npm run migration:run" -ForegroundColor Cyan 