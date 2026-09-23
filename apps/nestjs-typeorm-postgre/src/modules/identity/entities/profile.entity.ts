import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Gender } from '../enums/gender.enum';

@Entity({ schema: 'identity', name: 'profiles' })
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid', { unique: true })
  userId: string;

  @OneToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column('varchar', { nullable: true })
  firstName: string | null;

  @Column('varchar', { nullable: true })
  lastName: string | null;

  @Column('varchar', { nullable: true })
  phoneNumber: string | null;

  @Column('date', { nullable: true })
  dateOfBirth: Date | null;

  @Column('enum', { enum: Gender, nullable: true })
  gender: Gender | null;

  @Column('text', { nullable: true })
  bio: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt: Date;
}
