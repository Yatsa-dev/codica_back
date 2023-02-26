import { Bank } from 'src/banks/entity/bank.entity';
import { User } from 'src/users/entity/users.entity';
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

  @Column({ type: 'enum', enum: [PROFITABLE, CONSUMABLE] })
  type: string;

  @Column({ type: 'timestamp' })
  createdAt: Date;

  @ManyToOne(() => Bank, { nullable: false, eager: true })
  @JoinColumn()
  bank: number;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn()
  user: number;
}
