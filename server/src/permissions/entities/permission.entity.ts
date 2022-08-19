import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';

import { Organization } from '../../organizations/entities/organization.entity';
import { User } from '../../users/entities/user.entity';
import { ApprovalStatus, Role } from '../constants';

@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: ApprovalStatus,
    default: ApprovalStatus.pending,
  })
  approvalStatus: ApprovalStatus;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.owner,
  })
  role: Role;

  @ManyToOne(() => Organization, (org) => org.permissions, { cascade: ['insert'], eager: true })
  organization!: Organization;

  @ManyToOne(() => User, (user) => user.permissions, { cascade: ['insert'], eager: true })
  user!: User;

  @CreateDateColumn()
  created_date: Date;
}
