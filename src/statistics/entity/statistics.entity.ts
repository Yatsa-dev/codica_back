import { Transaction } from 'src/transactions/entity/transaction.entity';
import { Category } from 'src/categories/entity/category.entity';
import { PrimaryGeneratedColumn, Entity, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class Statistic {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Transaction, { nullable: false })
  @JoinColumn()
  transaction: number;

  @ManyToOne(() => Category, { nullable: false })
  @JoinColumn()
  category: number;
}
