import { Transaction } from 'src/transactions/entity/transaction.entity';
import { Category } from 'src/categories/entity/category.entity';
import { PrimaryGeneratedColumn, Entity, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class Statistic {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Transaction, {
    onDelete: 'CASCADE',
    nullable: false,
    eager: true,
  })
  @JoinColumn()
  transaction: Transaction;

  @ManyToOne(() => Category, {
    nullable: false,
    eager: true,
  })
  @JoinColumn()
  category: Category;
}
