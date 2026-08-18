import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../identity/entities/user.entity';
import { Role } from './role.entity';

@Entity({ schema: 'access_control', name: 'user_roles' })
@Unique(['userId', 'roleId'])
export class UserRole {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId: string;

  @Column()
  roleId: string;

  @ManyToOne(() => User, (user) => user.roles, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Role, (role) => role.users, { onDelete: 'CASCADE' })
  role: Role;

  @CreateDateColumn()
  createdAt: Date;
}
