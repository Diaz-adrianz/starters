import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  CreateDateColumn,
} from 'typeorm';
import { Role } from './role.entity';
import { Permission } from './permission.entity';
import { Condition } from '../interfaces/condition.interface';

@Entity({ schema: 'access_control', name: 'role_permissions' })
@Unique(['roleId', 'permissionId'])
export class RolePermission {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  roleId: string;

  @Column('uuid')
  permissionId: string;

  @Column('jsonb', { nullable: true })
  condition: Condition | null;

  @ManyToOne(() => Role, (role) => role.permissions, { onDelete: 'CASCADE' })
  role: Role;

  @ManyToOne(() => Permission, (perm) => perm.roles, { onDelete: 'CASCADE' })
  permission: Permission;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
