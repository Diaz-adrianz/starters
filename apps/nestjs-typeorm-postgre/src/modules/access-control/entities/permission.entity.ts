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
@Unique(['resource', 'action'])
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  resource: string;

  @Column()
  action: string;

  @Column({ type: 'varchar', nullable: true })
  group?: string | null;

  @Column({ type: 'varchar', nullable: true })
  description?: string | null;

  @OneToMany(() => RolePermission, (rp) => rp.permission)
  roles: RolePermission[];

  @Column({ default: true })
  enabled: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
