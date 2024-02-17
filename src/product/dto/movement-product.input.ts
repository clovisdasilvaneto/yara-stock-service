import { EProductAction } from 'src/warehouse/entities/warehouseHistory.entity';

export class MovementProductInput {
  id: number;
  productId: number;
  warehouseId: number;
  action: EProductAction;
  amount: number;
  date: string;
}
