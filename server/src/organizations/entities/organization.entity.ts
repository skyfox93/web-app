import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany } from 'typeorm';

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

  @ManyToMany(() => Organization, (org) => org.users)
  users: User[];

  @OneToMany(
    () => Transaction,
    (transaction) => transaction.donater_organization || transaction.recipient,
  )
  transactions: Transaction[];
}
