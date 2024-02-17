import { Product } from 'src/product/entities/product.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Warehouse } from './warehouse.entity';

export enum EProductAction {
  IMPORT = 'IMPORT',
  EXPORT = 'EXPORT',
}

@Entity({ name: 'warehouse_history' })
export class WarehouseHistory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (product) => product.warehouseHistory)
  @JoinColumn()
  product: Product;

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.warehouseHistory)
  @JoinColumn()
  warehouse: Warehouse;

  @Column()
  action: EProductAction;

  @Column({ type: 'int' })
  amount: number;

  @Column({ type: 'date' })
  date: string;
}
