import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { FavoritesService } from './favorites.service';
import { FavoriteMovie } from '../entities/favorite-movie.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([FavoriteMovie]),
  ],
  controllers: [MoviesController],
  providers: [MoviesService, FavoritesService],
  exports: [MoviesService, FavoritesService],
})
export class MoviesModule {} 