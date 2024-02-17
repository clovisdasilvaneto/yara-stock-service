import { Product } from 'src/product/entities/product.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Warehouse } from './warehouse.entity';

@Entity({ name: 'warehouse_product' })
export class WarehouseProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, (product) => product.warehouseProduct)
  @JoinColumn()
  product: Product;

  @ManyToOne(() => Warehouse, (warehouse) => warehouse.warehouseProduct)
  @JoinColumn()
  warehouse: Warehouse;

  @Column({ type: 'int' })
  amount: number;
}
