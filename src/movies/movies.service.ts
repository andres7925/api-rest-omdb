import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import axios from 'axios';
import { omdbConfig } from '../config/omdb.config';

export interface MovieSearchResult {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

export interface MovieSearchResponse {
  Search: MovieSearchResult[];
  totalResults: string;
  Response: string;
}

export interface MovieDetailResponse {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Poster: string;
  Ratings: Array<{ Source: string; Value: string }>;
  imdbRating: string;
  imdbID: string;
  Type: string;
  Response: string;
}

@Injectable()
export class MoviesService {
  private readonly logger = new Logger(MoviesService.name);

  async searchMoviesByTitle(
    title: string,
    year?: string,
    type?: string,
  ): Promise<MovieSearchResponse> {
    try {
      this.logger.log(`Buscando películas con título: ${title}`);
      
      const params = {
        apikey: omdbConfig.apiKey,
        s: title,
        ...(year && { y: year }),
        ...(type && { type }),
      };

      this.logger.log(`Parámetros de búsqueda: ${JSON.stringify(params)}`);

      const response = await axios.get(omdbConfig.baseUrl, { params });
      
      this.logger.log(`Respuesta de OMDb: ${JSON.stringify(response.data)}`);

      if (response.data.Response === 'False') {
        const errorMessage = response.data.Error || 'Error al buscar películas';
        this.logger.error(`Error de OMDb: ${errorMessage}`);
        
        // Manejar casos específicos de la API demo
        if (errorMessage.includes('Request limit reached') || 
            errorMessage.includes('Invalid API key') ||
            errorMessage.includes('Too many results')) {
          throw new HttpException(
            'La API de OMDb tiene limitaciones. Por favor, obtén una API key gratuita en http://www.omdbapi.com/apikey.aspx',
            HttpStatus.SERVICE_UNAVAILABLE,
          );
        }
        
        throw new HttpException(
          errorMessage,
          HttpStatus.BAD_REQUEST,
        );
      }

      return response.data;
    } catch (error) {
      this.logger.error(`Error en searchMoviesByTitle: ${error.message}`);
      
      if (error instanceof HttpException) {
        throw error;
      }

      // Si es un error de red o timeout
      if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
        throw new HttpException(
          'No se puede conectar con la API de OMDb. Verifica tu conexión a internet.',
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }

      throw new HttpException(
        'Error interno del servidor al buscar películas',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getMovieById(imdbId: string): Promise<MovieDetailResponse> {
    try {
      this.logger.log(`Obteniendo detalles de película con ID: ${imdbId}`);
      
      const params = {
        apikey: omdbConfig.apiKey,
        i: imdbId,
        plot: 'full', // Obtener plot completo
      };

      const response = await axios.get(omdbConfig.baseUrl, { params });

      if (response.data.Response === 'False') {
        const errorMessage = response.data.Error || 'Película no encontrada';
        this.logger.error(`Error de OMDb: ${errorMessage}`);
        
        throw new HttpException(
          errorMessage,
          HttpStatus.NOT_FOUND,
        );
      }

      return response.data;
    } catch (error) {
      this.logger.error(`Error en getMovieById: ${error.message}`);
      
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Error interno del servidor al obtener detalles de la película',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
} 