import { Controller, Get, Query, Param, HttpException, HttpStatus } from '@nestjs/common';
import {
  MoviesService,
  MovieSearchResponse,
  MovieDetailResponse,
} from './movies.service';
import { SearchMoviesDto } from './dto/search-movies.dto';
import { omdbConfig } from '../config/omdb.config';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

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
} 