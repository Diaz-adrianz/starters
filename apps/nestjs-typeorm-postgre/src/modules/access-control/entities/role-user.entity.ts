import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  CreateDateColumn,
} from 'typeorm';
import { Role } from './role.entity';

@Entity({ schema: 'access_control', name: 'role_users' })
@Unique(['roleId', 'userId'])
export class RoleUser {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  roleId: string;

  @Column('uuid')
  userId: string;

  @Column('varchar')
  username: string;

  @ManyToOne(() => Role, (role) => role.users, { onDelete: 'CASCADE' })
  role: Role;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
