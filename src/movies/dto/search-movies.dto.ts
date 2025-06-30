import { IsString, IsOptional, IsIn } from 'class-validator';

export class SearchMoviesDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  year?: string;

  @IsOptional()
  @IsIn(['movie', 'series', 'episode'])
  type?: string;
} 