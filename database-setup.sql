-- Script para configurar la base de datos PostgreSQL
-- Ejecutar como usuario postgres

-- Crear la base de datos
CREATE DATABASE omdb_api;

-- Conectar a la base de datos
\c omdb_api;

-- La tabla users se creará automáticamente cuando la aplicación se ejecute
-- debido a que TypeORM está configurado con synchronize: true

-- Verificar que la tabla se creó
-- \dt users; 