import { Bank } from '../../banks/entity/bank.entity';
import { User } from '../../users/entity/users.entity';
import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { CONSUMABLE, PROFITABLE } from '../transactions.constants';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: number;

  @Column({ type: 'simple-enum', enum: [PROFITABLE, CONSUMABLE] })
  type: string;

  @Column()
  createdAt: string;

  @ManyToOne(() => Bank, {
    nullable: false,
    eager: true,
    // createForeignKeyConstraints: false,
  })
  @JoinColumn()
  bank: Bank;

  @ManyToOne(() => User, {
    nullable: false,
    // createForeignKeyConstraints: false,
  })
  @JoinColumn()
  user: number;
}
