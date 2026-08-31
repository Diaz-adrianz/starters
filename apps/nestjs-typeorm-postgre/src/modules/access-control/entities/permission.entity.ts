import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { RolePermission } from './role-permission.entity';

@Entity({ schema: 'access_control', name: 'permissions' })
@Unique(['module', 'resource', 'action'])
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar')
  module: string;

  @Column('varchar')
  resource: string;

  @Column('varchar')
  action: string;

  @Column('varchar')
  description: string;

  @Column('bool', { default: false })
  enabled: boolean;

  @OneToMany(() => RolePermission, (rp) => rp.permission)
  roles: RolePermission[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
