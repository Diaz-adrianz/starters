import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Role } from './role.entity';
import { Page } from './page.entity';

@Entity({ schema: 'access_control', name: 'role_pages' })
@Unique(['roleId', 'pageId'])
export class RolePage {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  roleId: string;

  @Column('uuid')
  pageId: string;

  @ManyToOne(() => Role, (role) => role.pages, { onDelete: 'CASCADE' })
  role: Role;

  @ManyToOne(() => Page, (p) => p.roles, { onDelete: 'CASCADE' })
  page: Page;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
