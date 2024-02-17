import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { WarehouseHistory } from './warehouseHistory.entity';
import { WarehouseProduct } from './warehouseProduct.entity';

@Entity({ name: 'warehouse' })
export class Warehouse {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'int' })
  maxAmount: number;

  @OneToMany(
    () => WarehouseHistory,
    (warehouseHistory) => warehouseHistory.warehouse,
  )
  @JoinColumn()
  warehouseHistory: WarehouseHistory[];

  @OneToMany(
    () => WarehouseProduct,
    (warehouseProduct) => warehouseProduct.warehouse,
  )
  @JoinColumn()
  warehouseProduct: WarehouseProduct[];
}
