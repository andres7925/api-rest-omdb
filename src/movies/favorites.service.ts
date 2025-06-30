import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FavoriteMovie } from '../entities/favorite-movie.entity';
import { AddFavoriteDto } from './dto/add-favorite.dto';

@Injectable()
export class FavoritesService {
  private readonly logger = new Logger(FavoritesService.name);

  constructor(
    @InjectRepository(FavoriteMovie)
    private favoritesRepository: Repository<FavoriteMovie>,
  ) {}

  async addToFavorites(userId: number, addFavoriteDto: AddFavoriteDto): Promise<FavoriteMovie> {
    try {
      this.logger.log(`Intentando agregar película a favoritos para usuario ${userId}`);
      this.logger.log(`Datos de la película: ${JSON.stringify(addFavoriteDto)}`);

      // Validar que el userId sea válido
      if (!userId || userId <= 0) {
        throw new HttpException(
          'ID de usuario inválido',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Validar datos requeridos
      if (!addFavoriteDto.imdbId || !addFavoriteDto.title || !addFavoriteDto.year) {
        throw new HttpException(
          'imdbId, title y year son requeridos',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Verificar si ya existe como favorita
      this.logger.log(`Verificando si la película ${addFavoriteDto.imdbId} ya está en favoritos`);
      const existingFavorite = await this.favoritesRepository.findOne({
        where: { userId, imdbId: addFavoriteDto.imdbId },
      });

      if (existingFavorite) {
        this.logger.warn(`La película ${addFavoriteDto.imdbId} ya está en favoritos para el usuario ${userId}`);
        throw new HttpException(
          'Esta película ya está en tus favoritos',
          HttpStatus.CONFLICT,
        );
      }

      // Crear nueva película favorita
      this.logger.log(`Creando nueva entrada de película favorita`);
      const favoriteMovie = new FavoriteMovie();
      favoriteMovie.userId = userId;
      favoriteMovie.imdbId = addFavoriteDto.imdbId;
      favoriteMovie.title = addFavoriteDto.title;
      favoriteMovie.year = addFavoriteDto.year;
      favoriteMovie.poster = addFavoriteDto.poster || undefined;
      favoriteMovie.type = addFavoriteDto.type || undefined;

      this.logger.log(`Guardando película favorita en la base de datos`);
      const savedFavorite = await this.favoritesRepository.save(favoriteMovie);
      
      this.logger.log(`Película agregada exitosamente con ID: ${savedFavorite.id}`);
      return savedFavorite;
    } catch (error) {
      this.logger.error(`Error en addToFavorites: ${error.message}`);
      this.logger.error(`Stack trace: ${error.stack}`);

      if (error instanceof HttpException) {
        throw error;
      }

      // Manejar errores específicos de base de datos
      if (error.code === '23505') { // Unique constraint violation
        throw new HttpException(
          'Esta película ya está en tus favoritos',
          HttpStatus.CONFLICT,
        );
      }

      if (error.code === '23503') { // Foreign key constraint violation
        throw new HttpException(
          'Usuario no encontrado',
          HttpStatus.NOT_FOUND,
        );
      }

      throw new HttpException(
        'Error al agregar película a favoritos',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getFavorites(userId: number): Promise<FavoriteMovie[]> {
    try {
      this.logger.log(`Obteniendo favoritos para usuario ${userId}`);
      
      if (!userId || userId <= 0) {
        throw new HttpException(
          'ID de usuario inválido',
          HttpStatus.BAD_REQUEST,
        );
      }

      const favorites = await this.favoritesRepository.find({
        where: { userId },
        order: { createdAt: 'DESC' },
      });

      this.logger.log(`Encontradas ${favorites.length} películas favoritas para el usuario ${userId}`);
      return favorites;
    } catch (error) {
      this.logger.error(`Error en getFavorites: ${error.message}`);
      
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Error al obtener películas favoritas',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async removeFromFavorites(userId: number, imdbId: string): Promise<void> {
    try {
      this.logger.log(`Eliminando película ${imdbId} de favoritos para usuario ${userId}`);
      
      if (!userId || userId <= 0) {
        throw new HttpException(
          'ID de usuario inválido',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (!imdbId) {
        throw new HttpException(
          'imdbId es requerido',
          HttpStatus.BAD_REQUEST,
        );
      }

      const result = await this.favoritesRepository.delete({
        userId,
        imdbId,
      });

      if (result.affected === 0) {
        this.logger.warn(`No se encontró la película ${imdbId} en favoritos del usuario ${userId}`);
        throw new HttpException(
          'Película no encontrada en favoritos',
          HttpStatus.NOT_FOUND,
        );
      }

      this.logger.log(`Película ${imdbId} eliminada exitosamente de favoritos`);
    } catch (error) {
      this.logger.error(`Error en removeFromFavorites: ${error.message}`);
      
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Error al eliminar película de favoritos',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async isFavorite(userId: number, imdbId: string): Promise<boolean> {
    try {
      this.logger.log(`Verificando si la película ${imdbId} es favorita para usuario ${userId}`);
      
      if (!userId || userId <= 0 || !imdbId) {
        return false;
      }

      const favorite = await this.favoritesRepository.findOne({
        where: { userId, imdbId },
      });

      const isFavorite = !!favorite;
      this.logger.log(`Película ${imdbId} es favorita: ${isFavorite}`);
      return isFavorite;
    } catch (error) {
      this.logger.error(`Error en isFavorite: ${error.message}`);
      return false;
    }
  }
} 