import { CreateWarehouseInput } from './create-warehouse.input';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateWarehouseInput extends PartialType(CreateWarehouseInput) {
  id: number;
}
