import { User } from '../../users/entity/users.entity';
import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Bank {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: 0 })
  balance: number;

  @ManyToOne(() => User, {
    nullable: false,
    // createForeignKeyConstraints: false,
  })
  @JoinColumn()
  user: number;
}
