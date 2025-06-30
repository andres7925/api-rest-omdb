import { 
  Controller, 
  Get, 
  Post, 
  Delete, 
  Query, 
  Param, 
  Body, 
  UseGuards, 
  Request, 
  HttpException, 
  HttpStatus 
} from '@nestjs/common';
import {
  MoviesService,
  MovieSearchResponse,
  MovieDetailResponse,
} from './movies.service';
import { FavoritesService } from './favorites.service';
import { SearchMoviesDto } from './dto/search-movies.dto';
import { AddFavoriteDto } from './dto/add-favorite.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { omdbConfig } from '../config/omdb.config';

@Controller('movies')
export class MoviesController {
  constructor(
    private readonly moviesService: MoviesService,
    private readonly favoritesService: FavoritesService,
  ) {}

  @Get('info')
  getApiInfo() {
    return {
      message: 'API de Películas - OMDb Integration',
      status: 'active',
      endpoints: {
        search: 'GET /movies/search?title=batman',
        details: 'GET /movies/:id',
        test: 'GET /movies/test',
        info: 'GET /movies/info',
        favorites: 'GET /movies/favorites/list (requiere autenticación)',
        addFavorite: 'POST /movies/favorites/add (requiere autenticación)',
        removeFavorite: 'DELETE /movies/favorites/remove/:imdbId (requiere autenticación)',
        checkFavorite: 'GET /movies/favorites/check/:imdbId (requiere autenticación)',
        testFavorites: 'GET /movies/favorites/test (requiere autenticación)',
      },
      configuration: {
        apiKey: omdbConfig.apiKey === 'demo' ? 'demo (limitado)' : 'configurado',
        baseUrl: omdbConfig.baseUrl,
        maxResults: omdbConfig.maxResults,
      },
      setup: {
        message: 'Para mejor rendimiento, obtén una API key gratuita',
        url: 'http://www.omdbapi.com/apikey.aspx',
        instructions: 'Ver OMDB_API_SETUP.md para instrucciones detalladas',
      },
    };
  }

  @Get('test')
  async testOmdbApi() {
    try {
      // Intentar buscar una película conocida para probar la API
      const result = await this.moviesService.searchMoviesByTitle('batman');
      return {
        status: 'success',
        message: 'API de OMDb funcionando correctamente',
        data: result,
        apiKey: omdbConfig.apiKey === 'demo' ? 'demo (limitado)' : 'configurado',
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        details: 'La API de OMDb no está disponible o tiene limitaciones',
        recommendation: 'Obtén una API key gratuita en http://www.omdbapi.com/apikey.aspx',
        setupGuide: 'Ver OMDB_API_SETUP.md para instrucciones detalladas',
        apiKey: omdbConfig.apiKey === 'demo' ? 'demo (limitado)' : 'configurado',
      };
    }
  }

  @Get('search')
  async searchMovies(@Query() searchDto: SearchMoviesDto): Promise<MovieSearchResponse> {
    if (!searchDto.title || searchDto.title.trim() === '') {
      throw new HttpException(
        'El título es requerido para buscar películas',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.moviesService.searchMoviesByTitle(
      searchDto.title,
      searchDto.year,
      searchDto.type,
    );
  }

  @Get(':id')
  async getMovieById(@Param('id') id: string): Promise<MovieDetailResponse> {
    if (!id || id.trim() === '') {
      throw new HttpException(
        'El ID de la película es requerido',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.moviesService.getMovieById(id);
  }

  // Endpoints de favoritos (requieren autenticación)

  @UseGuards(JwtAuthGuard)
  @Get('favorites/test')
  async testFavorites(@Request() req) {
    try {
      const userId = req.user.id;
      const testData: AddFavoriteDto = {
        imdbId: 'tt1234567',
        title: 'Película de Prueba',
        year: '2024',
        poster: 'https://example.com/poster.jpg',
        type: 'movie'
      };

      // Intentar agregar una película de prueba
      const result = await this.favoritesService.addToFavorites(userId, testData);
      
      // Eliminar la película de prueba
      await this.favoritesService.removeFromFavorites(userId, testData.imdbId);

      return {
        status: 'success',
        message: 'Servicio de favoritos funcionando correctamente',
        userId: userId,
        testResult: result,
        note: 'La película de prueba fue eliminada automáticamente'
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        userId: req.user?.id,
        error: error
      };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('favorites/list')
  async getFavorites(@Request() req) {
    const userId = req.user.id;
    return await this.favoritesService.getFavorites(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('favorites/add')
  async addToFavorites(@Request() req, @Body() addFavoriteDto: AddFavoriteDto) {
    const userId = req.user.id;
    return await this.favoritesService.addToFavorites(userId, addFavoriteDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('favorites/remove/:imdbId')
  async removeFromFavorites(@Request() req, @Param('imdbId') imdbId: string) {
    const userId = req.user.id;
    await this.favoritesService.removeFromFavorites(userId, imdbId);
    return { message: 'Película eliminada de favoritos exitosamente' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('favorites/check/:imdbId')
  async checkFavorite(@Request() req, @Param('imdbId') imdbId: string) {
    const userId = req.user.id;
    const isFavorite = await this.favoritesService.isFavorite(userId, imdbId);
    return { isFavorite };
  }
} 