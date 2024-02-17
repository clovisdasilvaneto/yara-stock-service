import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductResolver } from './product.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Warehouse } from 'src/warehouse/entities/warehouse.entity';
import { WarehouseHistory } from 'src/warehouse/entities/warehouseHistory.entity';
import { WarehouseProduct } from 'src/warehouse/entities/warehouseProduct.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      Warehouse,
      WarehouseHistory,
      WarehouseProduct,
    ]),
  ],
  providers: [ProductResolver, ProductService],
})
export class ProductModule {}
