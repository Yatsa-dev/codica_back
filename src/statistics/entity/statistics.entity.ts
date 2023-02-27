import { PrimaryGeneratedColumn, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { Transaction } from '../../transactions/entity/transaction.entity';
import { Category } from '../../categories/entity/category.entity';

@Entity()
export class Statistic {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Transaction, {
    onDelete: 'CASCADE',
    nullable: false,
    eager: true,
    // createForeignKeyConstraints: false,
  })
  @JoinColumn()
  transaction: Transaction;

  @ManyToOne(() => Category, {
    nullable: false,
    eager: true,
    // createForeignKeyConstraints: false,
  })
  @JoinColumn()
  category: Category;
}
