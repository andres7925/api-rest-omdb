import { IsString, IsNotEmpty } from 'class-validator';

export class AddFavoriteDto {
  @IsString()
  @IsNotEmpty()
  imdbId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  year: string;

  @IsString()
  poster?: string;

  @IsString()
  type?: string;
} 