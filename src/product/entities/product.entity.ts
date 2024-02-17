import { WarehouseHistory } from 'src/warehouse/entities/warehouseHistory.entity';
import { WarehouseProduct } from 'src/warehouse/entities/warehouseProduct.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'product' })
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'int' })
  amount: number;

  @Column({ type: 'boolean' })
  isHazardous: boolean;

  @OneToMany(
    () => WarehouseHistory,
    (warehouseHistory) => warehouseHistory.product,
  )
  warehouseHistory: WarehouseHistory[];

  @OneToMany(
    () => WarehouseProduct,
    (warehouseProduct) => warehouseProduct.product,
  )
  warehouseProduct: WarehouseProduct[];
}
