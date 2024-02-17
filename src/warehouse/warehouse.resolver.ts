import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { WarehouseService } from './warehouse.service';
import { CreateWarehouseInput } from './dto/create-warehouse.input';
import { UpdateWarehouseInput } from './dto/update-warehouse.input';

@Resolver('Warehouse')
export class WarehouseResolver {
  constructor(private readonly warehouseService: WarehouseService) {}

  @Mutation('createWarehouse')
  create(
    @Args('createWarehouseInput') createWarehouseInput: CreateWarehouseInput,
  ) {
    return this.warehouseService.create(createWarehouseInput);
  }

  @Query('warehouses')
  findAll() {
    return this.warehouseService.findAll();
  }

  @Query('warehouse')
  findOne(@Args('id') id: number) {
    return this.warehouseService.findOne(id);
  }

  @Mutation('updateWarehouse')
  update(
    @Args('updateWarehouseInput') updateWarehouseInput: UpdateWarehouseInput,
  ) {
    return this.warehouseService.update(
      updateWarehouseInput.id,
      updateWarehouseInput,
    );
  }

  @Mutation('removeWarehouse')
  remove(@Args('id') id: number) {
    return this.warehouseService.remove(id);
  }
}
