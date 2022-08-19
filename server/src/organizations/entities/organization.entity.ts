import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  JoinColumn,
} from 'typeorm';

import { Permission } from '../../permissions/entities/permission.entity';
import { Transaction } from '../../transactions/entities/transaction.entity';
import { User } from '../../users/entities/user.entity';

@Entity('organizations')
export class Organization {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  name: string;

  @Column('text')
  doing_business_as: string;

  @Column('text')
  description: string;

  @Column('text')
  website: string;

  @Column('text')
  address: string;

  @Column('text')
  phone: string;

  @Column('text')
  city: string;

  @Column('text')
  state: string;

  @Column({ type: 'text', unique: true })
  ein: string;

  @Column({ type: 'text' })
  nonprofit_classification: string;

  @OneToMany(() => Permission, (permission) => permission.organization)
  permissions!: Permission[];

  @OneToMany(
    () => Transaction,
    (transaction) => transaction.donater_organization || transaction.recipient,
  )
  transactions: Transaction[];
}
