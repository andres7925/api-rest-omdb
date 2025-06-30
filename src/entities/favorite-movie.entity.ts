import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  ManyToOne, 
  JoinColumn,
  Unique 
} from 'typeorm';
import { User } from './user.entity';

@Entity('favorite_movies')
@Unique(['userId', 'imdbId']) // Un usuario no puede tener la misma película como favorita dos veces
export class FavoriteMovie {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  imdbId: string;

  @Column()
  title: string;

  @Column()
  year: string;

  @Column({ nullable: true })
  poster?: string;

  @Column({ nullable: true })
  type?: string;

  @CreateDateColumn()
  createdAt: Date;

  // Relación con el usuario
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
} 