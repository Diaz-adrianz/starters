import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from './user-role.entity';
import { RolePermission } from './role-permission.entity';
import { RolePage } from './role-page.entity';

@Entity({ schema: 'access_control', name: 'roles' })
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { unique: true })
  name: string;

  @Column('bool', { default: false })
  isDefault: boolean;

  @OneToMany(() => UserRole, (ur) => ur.role)
  users: UserRole[];

  @OneToMany(() => RolePermission, (ur) => ur.role)
  permissions: RolePermission[];

  @OneToMany(() => RolePage, (rp) => rp.role)
  pages: RolePage[];

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt: Date;
}
