import { Module } from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { WarehouseResolver } from './warehouse.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Warehouse } from './entities/warehouse.entity';
import { WarehouseHistory } from './entities/warehouseHistory.entity';
import { WarehouseProduct } from './entities/warehouseProduct.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Warehouse, WarehouseProduct, WarehouseHistory]),
  ],
  providers: [WarehouseResolver, WarehouseService],
})
export class WarehouseModule {}
